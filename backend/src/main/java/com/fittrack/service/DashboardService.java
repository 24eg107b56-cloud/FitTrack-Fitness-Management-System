package com.fittrack.service;

import com.fittrack.dto.DashboardStatsDTO;
import com.fittrack.model.WeightRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class DashboardService {

    private final WorkoutService workoutService;
    private final WeightRecordService weightRecordService;
    private final GoalService goalService;

    @Autowired
    public DashboardService(WorkoutService workoutService,
                            WeightRecordService weightRecordService,
                            GoalService goalService) {
        this.workoutService = workoutService;
        this.weightRecordService = weightRecordService;
        this.goalService = goalService;
    }

    public DashboardStatsDTO getDashboardStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();

        // Workouts
        stats.setTotalWorkouts(workoutService.getTotalCount());
        stats.setTotalDurationMinutes(workoutService.getTotalDurationMinutes());
        stats.setTotalCaloriesBurned(workoutService.getTotalCaloriesBurned());
        stats.setRecentWorkouts(workoutService.getRecentWorkouts());

        // Latest Weight & BMI
        Optional<WeightRecord> latestWeight = weightRecordService.getLatestWeightRecord();
        if (latestWeight.isPresent()) {
            WeightRecord record = latestWeight.get();
            stats.setCurrentWeight(record.getWeightKg());
            stats.setCurrentBmi(record.getBmi());
            stats.setBmiCategory(record.getBmiCategory());
        } else {
            stats.setCurrentWeight(null);
            stats.setCurrentBmi(null);
            stats.setBmiCategory("No Record");
        }

        stats.setRecentWeightRecords(weightRecordService.getRecentWeightRecords());

        // Goals
        stats.setActiveGoalsCount(goalService.countActiveGoals());
        stats.setCompletedGoalsCount(goalService.countCompletedGoals());
        stats.setActiveGoals(goalService.getGoalsByStatus("IN_PROGRESS"));

        return stats;
    }
}
