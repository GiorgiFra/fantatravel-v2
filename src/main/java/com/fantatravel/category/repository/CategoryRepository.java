package com.fantatravel.category.repository;

import com.fantatravel.category.model.Category;
import com.fantatravel.travel.model.Travel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
}
