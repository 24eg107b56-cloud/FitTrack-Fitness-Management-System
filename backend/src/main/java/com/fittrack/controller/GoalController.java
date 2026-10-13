package com.fittrack.controller;

import com.fittrack.model.Goal;
import com.fittrack.service.GoalService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/goals")
@CrossOrigin(origins = "*")
public class GoalController {

    private final GoalService goalService;

    @Autowired
    public GoalController(GoalService goalService) {
        this.goalService = goalService;
    }

    @GetMapping
    public ResponseEntity<List<Goal>> getAllGoals(@RequestParam(required = false) String status) {
        if (status != null && !status.isBlank()) {
            return ResponseEntity.ok(goalService.getGoalsByStatus(status));
        }
        return ResponseEntity.ok(goalService.getAllGoals());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Goal> getGoalById(@PathVariable Long id) {
        return ResponseEntity.ok(goalService.getGoalById(id));
    }

    @PostMapping
    public ResponseEntity<Goal> createGoal(@Valid @RequestBody Goal goal) {
        Goal saved = goalService.createGoal(goal);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Goal> updateGoal(@PathVariable Long id, @Valid @RequestBody Goal goal) {
        Goal updated = goalService.updateGoal(id, goal);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/progress")
    public ResponseEntity<Goal> updateProgress(@PathVariable Long id, @RequestBody Map<String, Double> payload) {
        Double currentValue = payload.get("currentValue");
        if (currentValue == null) {
            return ResponseEntity.badRequest().build();
        }
        Goal updated = goalService.updateGoalProgress(id, currentValue);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Goal> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        if (status == null || status.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        Goal updated = goalService.updateGoalStatus(id, status);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGoal(@PathVariable Long id) {
        goalService.deleteGoal(id);
        return ResponseEntity.noContent().build();
    }
}
