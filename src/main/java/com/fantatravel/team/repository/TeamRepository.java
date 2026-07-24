package com.fantatravel.team.repository;

import com.fantatravel.team.model.Team;
import com.fantatravel.travel.model.Travel;
import com.fantatravel.travel.model.TravelUserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {
}
