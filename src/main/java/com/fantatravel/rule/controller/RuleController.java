package com.fantatravel.rule.controller;

import com.fantatravel.category.assembler.CategoryModelAssembler;
import com.fantatravel.category.representation.CategoryModel;
import com.fantatravel.category.service.CategoryService;
import com.fantatravel.rule.assembler.RuleModelAssembler;
import com.fantatravel.rule.representation.RuleModel;
import com.fantatravel.rule.service.RuleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/rules")
@RequiredArgsConstructor
public class RuleController {

    private final RuleService ruleService;
    private final RuleModelAssembler ruleModelAssembler;

    @GetMapping("/destination/{id}")
    public ResponseEntity<List<RuleModel>> findAllByDestination(@PathVariable("id") Long id) {
        return ResponseEntity.ok(ruleModelAssembler
                .toModelList(ruleService.findAllByDestinationId(id)));
    }

}
