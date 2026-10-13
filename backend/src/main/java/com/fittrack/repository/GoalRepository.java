package com.fittrack.repository;

import com.fittrack.model.Goal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GoalRepository extends JpaRepository<Goal, Long> {

    List<Goal> findAllByOrderByIdDesc();

    List<Goal> findByStatusIgnoreCaseOrderByIdDesc(String status);

    long countByStatusIgnoreCase(String status);
}
