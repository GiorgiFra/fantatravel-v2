package com.fantatravel.specialcategory.repository;

import com.fantatravel.specialcategory.model.SpecialCategory;
import com.fantatravel.team.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SpecialCategoryRepository extends JpaRepository<SpecialCategory, Long> {
}
