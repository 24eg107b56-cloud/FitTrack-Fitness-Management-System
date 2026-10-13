package com.fittrack.dto;

import com.fittrack.model.Goal;
import com.fittrack.model.WeightRecord;
import com.fittrack.model.Workout;

import java.util.List;

public class DashboardStatsDTO {

    private long totalWorkouts;
    private int totalDurationMinutes;
    private double totalCaloriesBurned;

    private Double currentWeight;
    private Double currentBmi;
    private String bmiCategory;

    private long activeGoalsCount;
    private long completedGoalsCount;

    private List<Workout> recentWorkouts;
    private List<WeightRecord> recentWeightRecords;
    private List<Goal> activeGoals;

    public DashboardStatsDTO() {
    }

    public long getTotalWorkouts() {
        return totalWorkouts;
    }

    public void setTotalWorkouts(long totalWorkouts) {
        this.totalWorkouts = totalWorkouts;
    }

    public int getTotalDurationMinutes() {
        return totalDurationMinutes;
    }

    public void setTotalDurationMinutes(int totalDurationMinutes) {
        this.totalDurationMinutes = totalDurationMinutes;
    }

    public double getTotalCaloriesBurned() {
        return totalCaloriesBurned;
    }

    public void setTotalCaloriesBurned(double totalCaloriesBurned) {
        this.totalCaloriesBurned = totalCaloriesBurned;
    }

    public Double getCurrentWeight() {
        return currentWeight;
    }

    public void setCurrentWeight(Double currentWeight) {
        this.currentWeight = currentWeight;
    }

    public Double getCurrentBmi() {
        return currentBmi;
    }

    public void setCurrentBmi(Double currentBmi) {
        this.currentBmi = currentBmi;
    }

    public String getBmiCategory() {
        return bmiCategory;
    }

    public void setBmiCategory(String bmiCategory) {
        this.bmiCategory = bmiCategory;
    }

    public long getActiveGoalsCount() {
        return activeGoalsCount;
    }

    public void setActiveGoalsCount(long activeGoalsCount) {
        this.activeGoalsCount = activeGoalsCount;
    }

    public long getCompletedGoalsCount() {
        return completedGoalsCount;
    }

    public void setCompletedGoalsCount(long completedGoalsCount) {
        this.completedGoalsCount = completedGoalsCount;
    }

    public List<Workout> getRecentWorkouts() {
        return recentWorkouts;
    }

    public void setRecentWorkouts(List<Workout> recentWorkouts) {
        this.recentWorkouts = recentWorkouts;
    }

    public List<WeightRecord> getRecentWeightRecords() {
        return recentWeightRecords;
    }

    public void setRecentWeightRecords(List<WeightRecord> recentWeightRecords) {
        this.recentWeightRecords = recentWeightRecords;
    }

    public List<Goal> getActiveGoals() {
        return activeGoals;
    }

    public void setActiveGoals(List<Goal> activeGoals) {
        this.activeGoals = activeGoals;
    }
}
