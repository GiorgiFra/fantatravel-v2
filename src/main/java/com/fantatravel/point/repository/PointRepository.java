package com.fantatravel.point.repository;

import com.fantatravel.point.model.Point;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PointRepository extends JpaRepository<Point, Long> {

    int deleteByTravelRule_IdAndDay(Long travelRuleId, LocalDate day);

    Optional<Point> findByTravelRule_IdAndTravelUser_IdAndDay(Long travelRuleId, Long travelUserId, LocalDate day);

    List<Point> findByTravelRule_Id(Long travelRuleId);

    // Check if rule was already assigned to user (any day)
    Optional<Point> findByTravelRule_IdAndTravelUser_Id(Long travelRuleId, Long travelUserId);

    // se ti serve per eliminare un punto specifico
    int deleteByTravelRule_IdAndTravelUser_IdAndDay(Long travelRuleId, Long travelUserId, LocalDate day);

}
