package com.fantatravel.destination.repository;

import com.fantatravel.destination.model.Destination;
import com.fantatravel.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DestinationRepository extends JpaRepository<Destination, Long> {
}
