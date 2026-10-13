package com.fittrack.controller;

import com.fittrack.dto.BmiCalculationRequest;
import com.fittrack.dto.BmiCalculationResponse;
import com.fittrack.model.WeightRecord;
import com.fittrack.service.WeightRecordService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/weights")
@CrossOrigin(origins = "*")
public class WeightRecordController {

    private final WeightRecordService weightRecordService;

    @Autowired
    public WeightRecordController(WeightRecordService weightRecordService) {
        this.weightRecordService = weightRecordService;
    }

    @GetMapping
    public ResponseEntity<List<WeightRecord>> getAllWeights() {
        return ResponseEntity.ok(weightRecordService.getAllWeightRecords());
    }

    @GetMapping("/latest")
    public ResponseEntity<WeightRecord> getLatestWeight() {
        return weightRecordService.getLatestWeightRecord()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    @GetMapping("/recent")
    public ResponseEntity<List<WeightRecord>> getRecentWeights() {
        return ResponseEntity.ok(weightRecordService.getRecentWeightRecords());
    }

    @PostMapping
    public ResponseEntity<WeightRecord> recordWeight(@Valid @RequestBody WeightRecord weightRecord) {
        WeightRecord saved = weightRecordService.saveWeightRecord(weightRecord);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PostMapping("/calculate-bmi")
    public ResponseEntity<BmiCalculationResponse> calculateBmiQuick(@Valid @RequestBody BmiCalculationRequest request) {
        BmiCalculationResponse response = weightRecordService.calculateBmi(request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWeight(@PathVariable Long id) {
        weightRecordService.deleteWeightRecord(id);
        return ResponseEntity.noContent().build();
    }
}
