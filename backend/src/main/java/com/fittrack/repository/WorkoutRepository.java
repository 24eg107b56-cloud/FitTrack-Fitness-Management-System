package com.fittrack.repository;

import com.fittrack.model.Workout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface WorkoutRepository extends JpaRepository<Workout, Long> {

    List<Workout> findAllByOrderByWorkoutDateDescIdDesc();

    List<Workout> findTop5ByOrderByWorkoutDateDescIdDesc();

    List<Workout> findByCategoryIgnoreCaseOrderByWorkoutDateDesc(String category);

    List<Workout> findByWorkoutDateBetweenOrderByWorkoutDateDesc(LocalDate startDate, LocalDate endDate);

    @Query("SELECT COALESCE(SUM(w.durationMinutes), 0) FROM Workout w")
    Integer getTotalDurationMinutes();

    @Query("SELECT COALESCE(SUM(w.caloriesBurned), 0.0) FROM Workout w")
    Double getTotalCaloriesBurned();
}
