package com.fantatravel.category.controller;

import com.fantatravel.category.assembler.CategoryModelAssembler;
import com.fantatravel.category.representation.CategoryModel;
import com.fantatravel.category.service.CategoryService;
import com.fantatravel.travel.assembler.TravelModelAssembler;
import com.fantatravel.travel.dto.CreateTravelRequest;
import com.fantatravel.travel.representation.TravelModel;
import com.fantatravel.travel.service.TravelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;
    private final CategoryModelAssembler categoryModelAssembler;

    @GetMapping
    public ResponseEntity<List<CategoryModel>> findAll() {
        return ResponseEntity.ok(categoryModelAssembler.toModelList(categoryService.findAll()));
    }

}
