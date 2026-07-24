package com.fantatravel.specialcategory.service;

import com.fantatravel.security.SecurityUtils;
import com.fantatravel.specialcategory.model.SpecialCategory;
import com.fantatravel.specialcategory.repository.SpecialCategoryRepository;
import com.fantatravel.team.dto.CreateTeamRequest;
import com.fantatravel.team.model.Team;
import com.fantatravel.team.model.TeamUser;
import com.fantatravel.team.model.TeamUserId;
import com.fantatravel.team.repository.TeamRepository;
import com.fantatravel.travel.model.Travel;
import com.fantatravel.travel.model.TravelUser;
import com.fantatravel.travel.service.TravelService;
import com.fantatravel.user.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class SpecialCategoryService {
    private final SpecialCategoryRepository specialCategoryRepository;

    public SpecialCategory findById(Long id) {
        return specialCategoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Travel not found with id: " + id));
    }

    public List<SpecialCategory> findAll() {
        return specialCategoryRepository.findAll();
    }

}
