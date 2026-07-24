package com.fantatravel.travel.repository;

import com.fantatravel.travel.model.Travel;
import com.fantatravel.travel.model.TravelUserRole;
import com.fantatravel.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TravelRepository extends JpaRepository<Travel, Long> {
    List<Travel> findByTravelUsers_User_IdAndTravelUsers_Role(Long id, TravelUserRole role);

    Optional<Travel> findByInviteToken(String inviteToken);
}
