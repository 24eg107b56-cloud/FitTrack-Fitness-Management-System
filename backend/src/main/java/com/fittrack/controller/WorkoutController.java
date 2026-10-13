package com.fittrack.controller;

import com.fittrack.model.Workout;
import com.fittrack.service.WorkoutService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/workouts")
@CrossOrigin(origins = "*")
public class WorkoutController {

    private final WorkoutService workoutService;

    @Autowired
    public WorkoutController(WorkoutService workoutService) {
        this.workoutService = workoutService;
    }

    @GetMapping
    public ResponseEntity<List<Workout>> getAllWorkouts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        if (category != null && !category.isBlank()) {
            return ResponseEntity.ok(workoutService.getWorkoutsByCategory(category));
        }

        if (startDate != null && endDate != null) {
            return ResponseEntity.ok(workoutService.getWorkoutsBetweenDates(startDate, endDate));
        }

        return ResponseEntity.ok(workoutService.getAllWorkouts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Workout> getWorkoutById(@PathVariable Long id) {
        return ResponseEntity.ok(workoutService.getWorkoutById(id));
    }

    @GetMapping("/recent")
    public ResponseEntity<List<Workout>> getRecentWorkouts() {
        return ResponseEntity.ok(workoutService.getRecentWorkouts());
    }

    @PostMapping
    public ResponseEntity<Workout> createWorkout(@Valid @RequestBody Workout workout) {
        Workout saved = workoutService.createWorkout(workout);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Workout> updateWorkout(@PathVariable Long id, @Valid @RequestBody Workout workout) {
        Workout updated = workoutService.updateWorkout(id, workout);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkout(@PathVariable Long id) {
        workoutService.deleteWorkout(id);
        return ResponseEntity.noContent().build();
    }
}
