package com.fantatravel.team.service;

import com.fantatravel.category.service.CategoryService;
import com.fantatravel.destination.service.DestinationService;
import com.fantatravel.rule.model.Rule;
import com.fantatravel.rule.service.RuleService;
import com.fantatravel.security.SecurityUtils;
import com.fantatravel.specialcategory.model.SpecialCategory;
import com.fantatravel.team.dto.CreateTeamRequest;
import com.fantatravel.team.model.Team;
import com.fantatravel.team.model.TeamSpecialCategory;
import com.fantatravel.team.model.TeamUser;
import com.fantatravel.team.model.TeamUserId;
import com.fantatravel.team.repository.TeamRepository;
import com.fantatravel.travel.dto.CreateTravelRequest;
import com.fantatravel.travel.dto.LinkRuleTravelRequest;
import com.fantatravel.travel.model.*;
import com.fantatravel.travel.repository.TravelRepository;
import com.fantatravel.travel.repository.TravelSpecialCategoryRepository;
import com.fantatravel.travel.service.TravelService;
import com.fantatravel.user.model.User;
import com.fantatravel.user.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class TeamService {
    private final TeamRepository teamRepository;
    private final TravelService travelService;
    private final UserService userService;
    private final TravelSpecialCategoryRepository travelSpecialCategoryRepository;

    public Team findById(Long id) {
        return teamRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Travel not found with id: " + id));
    }

    public Team createTeam(CreateTeamRequest request) {
        Travel travel = travelService.findById(request.getTravelId());

        // Validate team can be created/modified (before travel start date)
        validateTeamModificationAllowed(travel);

        // Validate team composition
        validateTeamComposition(travel, request);

        Team team = new Team();
        team.setName(request.getName());
        team.setTravelUser(travel.getTravelUsers().stream()
            .filter(tu -> tu.getUser().getId().equals(SecurityUtils.getCurrentUserId()))
            .findFirst()
            .orElseThrow(() -> new EntityNotFoundException("Creator not found for travel")));
        team.setTeamUsers(new ArrayList<>());
        request.getUsers().stream().forEach(user -> {
            TravelUser foundUser = travel.getTravelUsers().stream().filter(travelUser -> travelUser.getId().equals(user.getUser().getId()))
                    .findFirst()
                    .orElseThrow(() -> new EntityNotFoundException("User not found in travel"));
            team.getTeamUsers().add(
                    linkUserToTeam(team, foundUser, user.isCaptain())
            );
        });
        team.setTeamSpecialCategories(new ArrayList<>());
        request.getSpecialCategories().stream().forEach(assignSpecialCategoryRequest -> {
            TravelUser foundUser = null;
            if(assignSpecialCategoryRequest.getUser() != null ) {
                foundUser =travel.getTravelUsers().stream().filter(travelUser -> travelUser.getId().equals(assignSpecialCategoryRequest.getUser().getId()))
                        .findFirst()
                        .orElseThrow(() -> new EntityNotFoundException("User not found in travel"));
            }
            TravelSpecialCategory foundSpecial = travel.getTravelSpecialCategories().stream().filter(tsc -> tsc.getId().equals(assignSpecialCategoryRequest.getSpecialCategory().getTravelSpecialCategoryId()))
                    .findFirst()
                    .orElseThrow(() -> new EntityNotFoundException("User not found in travel"));
            team.getTeamSpecialCategories().add(
                    linkSpecialToTeam(team, foundUser, foundSpecial));
        });
        return teamRepository.save(team);
    }


    public Team updateTeam(Long id, CreateTeamRequest request) {
        Travel travel = travelService.findById(request.getTravelId());

        // Validate team can be modified (before travel start date)
        validateTeamModificationAllowed(travel);

        // Validate team composition
        validateTeamComposition(travel, request);

        Team team = findById(id);
        team.setName(request.getName());
        team.setTravelUser(travel.getTravelUsers().stream()
                .filter(tu -> tu.getUser().getId().equals(SecurityUtils.getCurrentUserId()))
                .findFirst()
                .orElseThrow(() -> new EntityNotFoundException("Creator not found for travel")));
        team.getTeamUsers().clear();
        request.getUsers().stream().forEach(user -> {
            TravelUser foundUser = travel.getTravelUsers().stream().filter(travelUser -> travelUser.getId().equals(user.getUser().getId()))
                    .findFirst()
                    .orElseThrow(() -> new EntityNotFoundException("User not found in travel"));
            team.getTeamUsers().add(
                    linkUserToTeam(team, foundUser, user.isCaptain())
            );
        });
        team.getTeamSpecialCategories().clear();
        request.getSpecialCategories().stream().forEach(assignSpecialCategoryRequest -> {
            TravelUser foundUser = null;
            if(assignSpecialCategoryRequest.getUser() != null ) {
                foundUser =travel.getTravelUsers().stream().filter(travelUser -> travelUser.getId().equals(assignSpecialCategoryRequest.getUser().getId()))
                        .findFirst()
                        .orElseThrow(() -> new EntityNotFoundException("User not found in travel"));
            }
            TravelSpecialCategory foundSpecial = travel.getTravelSpecialCategories().stream().filter(tsc -> tsc.getId().equals(assignSpecialCategoryRequest.getSpecialCategory().getTravelSpecialCategoryId()))
                    .findFirst()
                    .orElseThrow(() -> new EntityNotFoundException("User not found in travel"));
            team.getTeamSpecialCategories().add(
                    linkSpecialToTeam(team, foundUser, foundSpecial));
        });
        return teamRepository.save(team);
    }

    public TeamUser linkUserToTeam(Team team, TravelUser user, boolean captain) {
             return TeamUser.builder()
                .travelUser(user)
                .team(team)
                .captain(captain)
                .id(new TeamUserId(team.getId(), user.getId()))
                .build();
    }

    public TeamSpecialCategory linkSpecialToTeam(Team team, TravelUser user, TravelSpecialCategory specialCategory) {
        return TeamSpecialCategory.builder()
                .team(team)
                .travelSpecialCategory(specialCategory)
                .travelUser(user)
                .build();
    }

    /**
     * Validate team can be created/modified (only before travel start date)
     */
    private void validateTeamModificationAllowed(Travel travel) {
        LocalDate today = LocalDate.now();
        if (!today.isBefore(travel.getStartDate())) {
            throw new IllegalStateException("Cannot create/modify team: travel has already started");
        }
    }

    /**
     * Validate team composition rules:
     * - Minimum travelers: (totalTravelers - 1) / 2 (rounded down), minimum 3
     * - Maximum 1 captain per team
     */
    private void validateTeamComposition(Travel travel, CreateTeamRequest request) {
        // Count total travelers in the travel
        long totalTravelers = travel.getTravelUsers().stream()
                .filter(tu -> tu.getRole() == TravelUserRole.TRAVELER)
                .count();

        // Calculate minimum required travelers: (n - 1) / 2, minimum 3
        int minTravelers = Math.max(3, (int) ((totalTravelers - 1) / 2));

        // Validate minimum travelers
        if (request.getUsers().size() < minTravelers) {
            throw new IllegalStateException(
                    String.format("Team must have at least %d travelers (total travelers: %d)",
                            minTravelers, totalTravelers));
        }

        // Validate only 1 captain
        long captainCount = request.getUsers().stream()
                .filter(u -> u.isCaptain())
                .count();

        if (captainCount != 1) {
            throw new IllegalStateException("Team must have exactly 1 captain");
        }
    }
}
