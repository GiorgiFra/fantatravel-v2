package com.fantatravel.travel.repository;

import com.fantatravel.travel.model.TravelRule;
import com.fantatravel.travel.model.TravelSpecialCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TravelSpecialCategoryRepository extends JpaRepository<TravelSpecialCategory, Long> {
    int deleteAllByTravel_Id(Long id);
}
