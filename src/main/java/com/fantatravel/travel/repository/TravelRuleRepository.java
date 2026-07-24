package com.fantatravel.travel.repository;

import com.fantatravel.travel.model.Travel;
import com.fantatravel.travel.model.TravelRule;
import com.fantatravel.travel.model.TravelUserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TravelRuleRepository extends JpaRepository<TravelRule, Long> {
    int deleteAllByTravel_Id(Long id);
}
