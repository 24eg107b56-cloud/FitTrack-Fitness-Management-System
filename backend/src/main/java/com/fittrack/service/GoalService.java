package com.fittrack.service;

import com.fittrack.exception.ResourceNotFoundException;
import com.fittrack.model.Goal;
import com.fittrack.repository.GoalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GoalService {

    private final GoalRepository goalRepository;

    @Autowired
    public GoalService(GoalRepository goalRepository) {
        this.goalRepository = goalRepository;
    }

    public List<Goal> getAllGoals() {
        return goalRepository.findAllByOrderByIdDesc();
    }

    public List<Goal> getGoalsByStatus(String status) {
        return goalRepository.findByStatusIgnoreCaseOrderByIdDesc(status);
    }

    public Goal getGoalById(Long id) {
        return goalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found with id: " + id));
    }

    public Goal createGoal(Goal goal) {
        if (goal.getStatus() == null || goal.getStatus().isBlank()) {
            goal.setStatus("IN_PROGRESS");
        }
        return goalRepository.save(goal);
    }

    public Goal updateGoal(Long id, Goal updated) {
        Goal existing = getGoalById(id);
        existing.setTitle(updated.getTitle());
        existing.setGoalType(updated.getGoalType());
        existing.setTargetValue(updated.getTargetValue());
        existing.setStartValue(updated.getStartValue());
        existing.setCurrentValue(updated.getCurrentValue());
        existing.setUnit(updated.getUnit());
        existing.setTargetDate(updated.getTargetDate());
        existing.setStatus(updated.getStatus());
        existing.setNotes(updated.getNotes());
        return goalRepository.save(existing);
    }

    public Goal updateGoalProgress(Long id, Double currentValue) {
        Goal existing = getGoalById(id);
        existing.setCurrentValue(currentValue);
        if (existing.getProgressPercentage() >= 100) {
            existing.setStatus("COMPLETED");
        }
        return goalRepository.save(existing);
    }

    public Goal updateGoalStatus(Long id, String status) {
        Goal existing = getGoalById(id);
        existing.setStatus(status.toUpperCase());
        return goalRepository.save(existing);
    }

    public void deleteGoal(Long id) {
        Goal existing = getGoalById(id);
        goalRepository.delete(existing);
    }

    public long countActiveGoals() {
        return goalRepository.countByStatusIgnoreCase("IN_PROGRESS");
    }

    public long countCompletedGoals() {
        return goalRepository.countByStatusIgnoreCase("COMPLETED");
    }
}
