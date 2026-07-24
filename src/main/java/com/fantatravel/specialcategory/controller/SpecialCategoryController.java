package com.fantatravel.specialcategory.controller;

import com.fantatravel.security.SecurityUtils;
import com.fantatravel.specialcategory.assembler.SpecialCategoryModelAssembler;
import com.fantatravel.specialcategory.representation.SpecialCategoryModel;
import com.fantatravel.specialcategory.service.SpecialCategoryService;
import com.fantatravel.team.assembler.TeamModelAssembler;
import com.fantatravel.team.dto.CreateTeamRequest;
import com.fantatravel.team.representation.TeamModel;
import com.fantatravel.team.service.TeamService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/special-category")
@RequiredArgsConstructor
public class SpecialCategoryController {

    private final SpecialCategoryService specialCategoryService;
    private final SpecialCategoryModelAssembler specialCategoryModelAssembler;


    @GetMapping
    public ResponseEntity<List<SpecialCategoryModel>> findAll() {
        return ResponseEntity.ok(specialCategoryModelAssembler.toModelList(
                specialCategoryService.findAll()
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SpecialCategoryModel> findById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(specialCategoryModelAssembler.toModel(
                specialCategoryService.findById(id)
        ));
    }
}
