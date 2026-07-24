package com.fantatravel.travel.service;

import com.fantatravel.category.service.CategoryService;
import com.fantatravel.destination.service.DestinationService;
import com.fantatravel.point.model.Point;
import com.fantatravel.point.repository.PointRepository;
import com.fantatravel.rule.model.Rule;
import com.fantatravel.rule.service.RuleService;
import com.fantatravel.security.SecurityUtils;
import com.fantatravel.specialcategory.model.SpecialCategory;
import com.fantatravel.specialcategory.service.SpecialCategoryService;
import com.fantatravel.travel.dto.CreateTravelRequest;
import com.fantatravel.travel.dto.LinkRuleTravelRequest;
import com.fantatravel.travel.dto.LinkSpecialCategoryTravelRequest;
import com.fantatravel.travel.dto.ReviewedTravelRequest;
import com.fantatravel.travel.model.*;
import com.fantatravel.travel.repository.TravelRepository;
import com.fantatravel.travel.repository.TravelRuleRepository;
import com.fantatravel.travel.repository.TravelSpecialCategoryRepository;
import com.fantatravel.travel.repository.TravelUserRepository;
import com.fantatravel.user.model.User;
import com.fantatravel.user.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class TravelService {
    private final TravelRepository travelRepository;
    private final TravelRuleRepository travelRuleRepository;
    private final TravelUserRepository travelUserRepository;
    private final PointRepository pointRepository;
    private final DestinationService destinationService;
    private final CategoryService categoryService;
    private final UserService userService;
    private final RuleService ruleService;
    private final SpecialCategoryService specialCategoryService;
    private final TravelSpecialCategoryRepository travelSpecialCategoryRepository;

    public List<Travel> findAllTravels() {
        return travelRepository.findByTravelUsers_User_IdAndTravelUsers_Role(SecurityUtils.getCurrentUserId(), TravelUserRole.TRAVELER);
    }

    public List<Travel> findAllTeams() {
        return travelRepository.findByTravelUsers_User_IdAndTravelUsers_Role(SecurityUtils.getCurrentUserId(), TravelUserRole.PLAYER);
    }

    public Travel findById(Long id) {
        return travelRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Travel not found with id: " + id));
    }

    public void save(Travel travel) {
        travelRepository.save(travel);
    }

    @Transactional
    public Travel create(CreateTravelRequest request) {
        User user = userService.findById(SecurityUtils.getCurrentUserId());
        Travel travel = Travel.builder()
                .name(request.getName())
                .destination(destinationService.findById(request.getDestination().getId()))
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .travelUsers(new ArrayList<>())
                .build();
        travel = travelRepository.save(travel);
        return linkUserToTravel(travel, user, TravelUserRole.TRAVELER);
    }

    @Transactional
    public void delete(Long id) {
        travelRepository.deleteById(id);
    }

    @Transactional
    public Travel linkRules(Long id, LinkRuleTravelRequest request) {
        Travel travel = findById(id);

        // Prevent rule modification when travel is ACTIVE or COMPLETED
        if (travel.getStatus() == TravelStatus.ACTIVE || travel.getStatus() == TravelStatus.COMPLETED) {
            throw new IllegalStateException("Cannot modify rules: travel has already started");
        }

        // Mappa delle TravelRule esistenti indicizzate per ruleId
        Map<Long, TravelRule> existingByRuleId = travel.getTravelRules().stream()
                .filter(tr -> tr.getRule() != null && tr.getRule().getId() != null)
                .collect(Collectors.toMap(tr -> tr.getRule().getId(), Function.identity()));

        List<TravelRule> resultRules = new ArrayList<>();

        for (var r : request.getRules()) {
            if (r.getId() != null) {
                Long ruleId = r.getId();
                TravelRule existing = existingByRuleId.remove(ruleId);

                if (existing != null) {
                    // aggiorna i campi modificabili se necessario
                    if (existing.isRepeatable() != r.isRepeatable()) {
                        existing.setRepeatable(r.isRepeatable());
                    }
                    if (existing.getValue() != r.getValue()) {
                        existing.setValue(r.getValue());
                    }
                    resultRules.add(existing);
                } else {
                    // esiste una rule in request ma non c'era in travel -> crea una nuova TravelRule collegata alla Rule esistente
                    Rule rule = ruleService.findById(ruleId);
                    TravelRule tr = TravelRule.builder()
                            .travel(travel)
                            .rule(rule)
                            .repeatable(r.isRepeatable())
                            .value(r.getValue())
                            .build();
                    resultRules.add(tr);
                }
            } else {
                // rule nuova: crea la Rule e poi la TravelRule
                Rule saved = ruleService.save(Rule.builder()
                        .description(r.getDescription())
                        .category(categoryService.findById(r.getCategory().getId()))
                        .value(r.getValue())
                        .destinations(List.of())
                        .build());

                TravelRule tr = TravelRule.builder()
                        .travel(travel)
                        .rule(saved)
                        .repeatable(r.isRepeatable())
                        .value(r.getValue())
                        .build();
                resultRules.add(tr);
            }
        }

        // existingByRuleId contiene tutte le TravelRule presenti in DB ma NON incluse nella request => vanno rimosse
        if (!existingByRuleId.isEmpty()) {
            // 1) rimuovi dalla collection per far scattare orphanRemoval (se attivo)
            travel.getTravelRules().removeIf(tr -> tr.getRule() != null && existingByRuleId.containsKey(tr.getRule().getId()));

            // 2) elimina esplicitamente dal repo per sicurezza (utile se orphanRemoval non fosse configurato correttamente)
            travelRuleRepository.deleteAll(existingByRuleId.values());
        }

        // Sostituisci la collection con quelle finali (update + new)
        travel.getTravelRules().clear();
        travel.getTravelRules().addAll(resultRules);

        // salva tutto; cascade = ALL sulle travelRules provvederà a persist/merge/delete
        return travelRepository.save(travel);
    }
    @Transactional
    public Travel linkSpecialCategories(Long id, LinkSpecialCategoryTravelRequest request) {
        Travel travel = findById(id);

        // Prevent special category modification when travel is ACTIVE or COMPLETED
        if (travel.getStatus() == TravelStatus.ACTIVE || travel.getStatus() == TravelStatus.COMPLETED) {
            throw new IllegalStateException("Cannot modify special categories: travel has already started");
        }

        Map<Long, TravelSpecialCategory> existingBySpecialCategoryId = travel.getTravelSpecialCategories().stream()
                .filter(tr -> tr.getSpecialCategory() != null && tr.getSpecialCategory().getId() != null)
                .collect(Collectors.toMap(tr -> tr.getSpecialCategory().getId(), Function.identity()));

        List<TravelSpecialCategory> resultSpecialCategories = new ArrayList<>();

        for (var sc : request.getSpecialCategories()) {
            if (sc.getId() != null) {
                Long specialCategoryId = sc.getId();
                TravelSpecialCategory existing = existingBySpecialCategoryId.remove(specialCategoryId);

                if (existing != null) {
                    resultSpecialCategories.add(existing);
                } else {
                    SpecialCategory specialCategory = specialCategoryService.findById(specialCategoryId);
                    TravelSpecialCategory tsc = TravelSpecialCategory.builder()
                            .travel(travel)
                            .specialCategory(specialCategory)
                            .build();
                    resultSpecialCategories.add(tsc);
                }
            }
        }

        if (!existingBySpecialCategoryId.isEmpty()) {
            travel.getTravelSpecialCategories().removeIf(tsc -> tsc.getSpecialCategory() != null && existingBySpecialCategoryId.containsKey(tsc.getSpecialCategory().getId()));

            travelSpecialCategoryRepository.deleteAll(existingBySpecialCategoryId.values());
        }

        travel.getTravelSpecialCategories().clear();
        travel.getTravelSpecialCategories().addAll(resultSpecialCategories);

        return travelRepository.save(travel);
    }


    public void linkUserToTravel(Long travelId, TravelUserRole role) {
        Travel travel = findById(travelId);
        User user = userService.findById(SecurityUtils.getCurrentUserId());
        if (travel.getTravelUsers().stream()
                .noneMatch(tu -> tu.getUser().getId().equals(user.getId()))) {
            linkUserToTravel(travel, user, role);
        }
    }

    public Travel linkUserToTravel(Travel travel, User user, TravelUserRole role) {
        TravelUser travelUser = TravelUser.builder()
                .user(user)
                .travel(travel)
                .role(role)
                .build();
        travel.getTravelUsers().add(travelUser);
        return travelRepository.save(travel);
    }

    public List<TravelUser> getAllTravelers(Long travelId) {
        Travel travel = findById(travelId);
        return travel.getTravelUsers().stream()
                .filter(tu -> tu.getRole() == TravelUserRole.TRAVELER)
                .toList();
    }

    @Transactional
    public Travel review (Long id, ReviewedTravelRequest request) {
        Travel travel = findById(id);
        travel.setReviewed(true);
        travel.setReviewedComment(request.getComment());
        request.getAssignSpecialCategories().forEach(assignSpecialRequest -> {
            TravelUser traveler = null;
            if (assignSpecialRequest.getUser() != null) {
                traveler = travel.getTravelUsers().stream()
                        .filter(tu -> tu.getId().equals(assignSpecialRequest.getUser().getId()))
                        .findFirst()
                        .orElseThrow(() -> new EntityNotFoundException("Traveler not found with id: " + assignSpecialRequest.getUser().getId()));
            }
            TravelSpecialCategory travelSpecialCategory = assignTravelerToSpecialCategories(assignSpecialRequest.getSpecialCategory().getTravelSpecialCategoryId(), traveler);
            travel.getTravelSpecialCategories()
                    .replaceAll(s -> s.getId().equals(travelSpecialCategory.getId())
                            ? travelSpecialCategory
                            : s);
        });
        return travelRepository.save(travel);
    }

    private TravelSpecialCategory assignTravelerToSpecialCategories(Long specialId, TravelUser traveler) {
        TravelSpecialCategory specialCategory = travelSpecialCategoryRepository.findById(specialId).orElseThrow(
                () -> new EntityNotFoundException("Special Category not found with id: " + specialId));
        specialCategory.setUser(traveler);
        return travelSpecialCategoryRepository.save(specialCategory);
    }

    /**
     * Generate or retrieve invite link for a travel
     * @param travelId the travel ID
     * @return the full invite URL
     */
    @Transactional
    public String generateInviteLink(Long travelId) {
        Travel travel = findById(travelId);

        // Generate token if not exists
        if (travel.getInviteToken() == null || travel.getInviteToken().isEmpty()) {
            travel.setInviteToken(UUID.randomUUID().toString());
            travelRepository.save(travel);
        }

        // Return full URL (customize base URL as needed)
        return "https://app.fantatravel.com/join/" + travel.getInviteToken();
    }

    /**
     * Join a travel using invite token
     * @param inviteToken the invite token
     * @return the travel joined
     */
    @Transactional
    public Travel joinTravelByToken(String inviteToken) {
        Travel travel = travelRepository.findByInviteToken(inviteToken)
                .orElseThrow(() -> new EntityNotFoundException("Invalid invite token"));

        // Check if travel is still joinable
        if (travel.getStatus() == TravelStatus.ACTIVE || travel.getStatus() == TravelStatus.COMPLETED) {
            throw new IllegalStateException("Cannot join travel: travel has already started or completed");
        }

        User currentUser = userService.findById(SecurityUtils.getCurrentUserId());

        // Check if user already joined
        boolean alreadyJoined = travel.getTravelUsers().stream()
                .anyMatch(tu -> tu.getUser().getId().equals(currentUser.getId()));

        if (alreadyJoined) {
            return travel; // Already joined, return travel
        }

        // Add user as PLAYER (can create team)
        return linkUserToTravel(travel, currentUser, TravelUserRole.PLAYER);
    }

    /**
     * Start travel: freeze rules, set status to ACTIVE
     * @param travelId the travel ID
     */
    @Transactional
    public Travel startTravel(Long travelId) {
        Travel travel = findById(travelId);

        if (travel.getStatus() != TravelStatus.DRAFT) {
            throw new IllegalStateException("Travel already started or completed");
        }

        travel.setStatus(TravelStatus.ACTIVE);
        return travelRepository.save(travel);
    }

    /**
     * Complete travel: allow special category assignment
     * @param travelId the travel ID
     */
    @Transactional
    public Travel completeTravel(Long travelId) {
        Travel travel = findById(travelId);

        if (travel.getStatus() != TravelStatus.ACTIVE) {
            throw new IllegalStateException("Travel must be ACTIVE to be completed");
        }

        travel.setStatus(TravelStatus.COMPLETED);
        return travelRepository.save(travel);
    }

    /**
     * Mark traveler as abandoned and apply -100 points malus
     * @param travelId the travel ID
     * @param travelUserId the traveler ID
     */
    @Transactional
    public void abandonTraveler(Long travelId, Long travelUserId) {
        Travel travel = findById(travelId);

        // Find the traveler
        TravelUser traveler = travel.getTravelUsers().stream()
                .filter(tu -> tu.getId().equals(travelUserId) && tu.getRole() == TravelUserRole.TRAVELER)
                .findFirst()
                .orElseThrow(() -> new EntityNotFoundException("Traveler not found"));

        // Create or get "Abbandono" rule (-100 points)
        TravelRule abandonRule = travel.getTravelRules().stream()
                .filter(tr -> tr.getRule() != null && "Abbandono".equals(tr.getRule().getDescription()))
                .findFirst()
                .orElseGet(() -> {
                    // Create abandonment rule
                    Rule rule = ruleService.save(Rule.builder()
                            .description("Abbandono")
                            .category(categoryService.findById(1L)) // Assuming category 1 exists
                            .value(-100)
                            .destinations(List.of())
                            .build());

                    TravelRule tr = TravelRule.builder()
                            .travel(travel)
                            .rule(rule)
                            .repeatable(false)
                            .value(-100)
                            .build();

                    travel.getTravelRules().add(tr);
                    travelRepository.save(travel);
                    return tr;
                });

        // Assign -100 malus
        Point abandonPoint = Point.builder()
                .travelRule(abandonRule)
                .travelUser(traveler)
                .day(java.time.LocalDate.now())
                .build();

        pointRepository.save(abandonPoint);
    }
}
