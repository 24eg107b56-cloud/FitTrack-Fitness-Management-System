package com.fittrack.service;

import com.fittrack.exception.ResourceNotFoundException;
import com.fittrack.model.Workout;
import com.fittrack.repository.WorkoutRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class WorkoutService {

    private final WorkoutRepository workoutRepository;

    @Autowired
    public WorkoutService(WorkoutRepository workoutRepository) {
        this.workoutRepository = workoutRepository;
    }

    public List<Workout> getAllWorkouts() {
        return workoutRepository.findAllByOrderByWorkoutDateDescIdDesc();
    }

    public Workout getWorkoutById(Long id) {
        return workoutRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Workout not found with id: " + id));
    }

    public List<Workout> getRecentWorkouts() {
        return workoutRepository.findTop5ByOrderByWorkoutDateDescIdDesc();
    }

    public List<Workout> getWorkoutsByCategory(String category) {
        return workoutRepository.findByCategoryIgnoreCaseOrderByWorkoutDateDesc(category);
    }

    public List<Workout> getWorkoutsBetweenDates(LocalDate start, LocalDate end) {
        return workoutRepository.findByWorkoutDateBetweenOrderByWorkoutDateDesc(start, end);
    }

    public Workout createWorkout(Workout workout) {
        // Auto-estimate calories if not supplied
        if (workout.getCaloriesBurned() == null && workout.getDurationMinutes() != null) {
            // Rough estimate: ~7.5 calories burned per active exercise minute
            workout.setCaloriesBurned(Math.round(workout.getDurationMinutes() * 7.5 * 10.0) / 10.0);
        }
        return workoutRepository.save(workout);
    }

    public Workout updateWorkout(Long id, Workout updated) {
        Workout existing = getWorkoutById(id);
        existing.setExerciseName(updated.getExerciseName());
        existing.setCategory(updated.getCategory());
        existing.setSets(updated.getSets());
        existing.setRepetitions(updated.getRepetitions());
        existing.setWeightKg(updated.getWeightKg());
        existing.setDurationMinutes(updated.getDurationMinutes());
        existing.setCaloriesBurned(updated.getCaloriesBurned());
        existing.setWorkoutDate(updated.getWorkoutDate());
        existing.setNotes(updated.getNotes());

        if (existing.getCaloriesBurned() == null && existing.getDurationMinutes() != null) {
            existing.setCaloriesBurned(Math.round(existing.getDurationMinutes() * 7.5 * 10.0) / 10.0);
        }

        return workoutRepository.save(existing);
    }

    public void deleteWorkout(Long id) {
        Workout existing = getWorkoutById(id);
        workoutRepository.delete(existing);
    }

    public long getTotalCount() {
        return workoutRepository.count();
    }

    public int getTotalDurationMinutes() {
        Integer duration = workoutRepository.getTotalDurationMinutes();
        return duration != null ? duration : 0;
    }

    public double getTotalCaloriesBurned() {
        Double calories = workoutRepository.getTotalCaloriesBurned();
        return calories != null ? Math.round(calories * 10.0) / 10.0 : 0.0;
    }
}
