package com.fantatravel.travel.repository;

import com.fantatravel.travel.model.TravelUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TravelUserRepository extends JpaRepository<TravelUser, Long> {
}
