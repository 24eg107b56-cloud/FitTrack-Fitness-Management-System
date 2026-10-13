package com.fittrack.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Entity
@Table(name = "workouts")
public class Workout {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Exercise name is required")
    @Column(nullable = false, length = 100)
    private String exerciseName;

    @Column(length = 50)
    private String category; // Strength, Cardio, Flexibility, HIIT, etc.

    @NotNull(message = "Sets count is required")
    private Integer sets;

    @NotNull(message = "Repetitions count is required")
    private Integer repetitions;

    private Double weightKg; // Weight in kg lifted (optional)

    private Integer durationMinutes; // Duration in minutes

    private Double caloriesBurned; // Estimated calories burned

    @NotNull(message = "Workout date is required")
    @Column(nullable = false)
    private LocalDate workoutDate;

    @Column(length = 500)
    private String notes;

    public Workout() {
    }

    public Workout(Long id, String exerciseName, String category, Integer sets, Integer repetitions,
                   Double weightKg, Integer durationMinutes, Double caloriesBurned,
                   LocalDate workoutDate, String notes) {
        this.id = id;
        this.exerciseName = exerciseName;
        this.category = category;
        this.sets = sets;
        this.repetitions = repetitions;
        this.weightKg = weightKg;
        this.durationMinutes = durationMinutes;
        this.caloriesBurned = caloriesBurned;
        this.workoutDate = workoutDate;
        this.notes = notes;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getExerciseName() {
        return exerciseName;
    }

    public void setExerciseName(String exerciseName) {
        this.exerciseName = exerciseName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Integer getSets() {
        return sets;
    }

    public void setSets(Integer sets) {
        this.sets = sets;
    }

    public Integer getRepetitions() {
        return repetitions;
    }

    public void setRepetitions(Integer repetitions) {
        this.repetitions = repetitions;
    }

    public Double getWeightKg() {
        return weightKg;
    }

    public void setWeightKg(Double weightKg) {
        this.weightKg = weightKg;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public Double getCaloriesBurned() {
        return caloriesBurned;
    }

    public void setCaloriesBurned(Double caloriesBurned) {
        this.caloriesBurned = caloriesBurned;
    }

    public LocalDate getWorkoutDate() {
        return workoutDate;
    }

    public void setWorkoutDate(LocalDate workoutDate) {
        this.workoutDate = workoutDate;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
