package com.fittrack.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Entity
@Table(name = "fitness_goals")
public class Goal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Goal title is required")
    @Column(nullable = false, length = 150)
    private String title;

    @Column(length = 50)
    private String goalType; // WEIGHT_LOSS, WEIGHT_GAIN, WORKOUT_COUNT, CARDIO_MINUTES, GENERAL

    @NotNull(message = "Target value is required")
    @Column(nullable = false)
    private Double targetValue;

    private Double startValue;

    private Double currentValue;

    @Column(length = 20)
    private String unit; // kg, workouts, mins, km

    private LocalDate targetDate;

    @Column(length = 30)
    private String status = "IN_PROGRESS"; // IN_PROGRESS, COMPLETED, ON_HOLD

    @Column(length = 500)
    private String notes;

    public Goal() {
    }

    public Goal(Long id, String title, String goalType, Double targetValue, Double startValue,
                Double currentValue, String unit, LocalDate targetDate, String status, String notes) {
        this.id = id;
        this.title = title;
        this.goalType = goalType;
        this.targetValue = targetValue;
        this.startValue = startValue;
        this.currentValue = currentValue;
        this.unit = unit;
        this.targetDate = targetDate;
        this.status = status;
        this.notes = notes;
    }

    public Integer getProgressPercentage() {
        if (targetValue == null || currentValue == null) {
            return 0;
        }

        // If explicitly completed
        if ("COMPLETED".equalsIgnoreCase(status)) {
            return 100;
        }

        // Weight loss logic: startValue > targetValue, progress increases as currentValue decreases
        if ("WEIGHT_LOSS".equalsIgnoreCase(goalType) && startValue != null && startValue > targetValue) {
            double totalDiff = startValue - targetValue;
            double achievedDiff = startValue - currentValue;
            int percentage = (int) Math.round((achievedDiff / totalDiff) * 100);
            return Math.max(0, Math.min(100, percentage));
        }

        // Standard logic: currentValue / targetValue * 100
        if (targetValue > 0) {
            int percentage = (int) Math.round((currentValue / targetValue) * 100);
            return Math.max(0, Math.min(100, percentage));
        }

        return 0;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getGoalType() {
        return goalType;
    }

    public void setGoalType(String goalType) {
        this.goalType = goalType;
    }

    public Double getTargetValue() {
        return targetValue;
    }

    public void setTargetValue(Double targetValue) {
        this.targetValue = targetValue;
    }

    public Double getStartValue() {
        return startValue;
    }

    public void setStartValue(Double startValue) {
        this.startValue = startValue;
    }

    public Double getCurrentValue() {
        return currentValue;
    }

    public void setCurrentValue(Double currentValue) {
        this.currentValue = currentValue;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public LocalDate getTargetDate() {
        return targetDate;
    }

    public void setTargetDate(LocalDate targetDate) {
        this.targetDate = targetDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
