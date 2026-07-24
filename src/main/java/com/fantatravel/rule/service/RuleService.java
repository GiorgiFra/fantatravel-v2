package com.fantatravel.rule.service;

import com.fantatravel.category.model.Category;
import com.fantatravel.rule.model.Rule;
import com.fantatravel.rule.repository.RuleRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class RuleService {
    private final RuleRepository ruleRepository;

    public List<Rule> findAllByDestinationId(Long id) {
        return ruleRepository.findAllByDestinations_Id(id);
    }
    public List<Rule> findAllByIdIn(List<Long> ids) {
        return ruleRepository.findAllByIdIn(ids);
    }

    public List<Rule> saveAll(List<Rule> rules) {
        return ruleRepository.saveAll(rules);
    }
    public Rule save(Rule rule) {
        return ruleRepository.save(rule);
    }

    public Rule findById(Long id) {
        return ruleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Rule not found with id: " + id));
    }

}
