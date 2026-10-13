package com.fittrack.service;

import com.fittrack.dto.BmiCalculationRequest;
import com.fittrack.dto.BmiCalculationResponse;
import com.fittrack.exception.ResourceNotFoundException;
import com.fittrack.model.WeightRecord;
import com.fittrack.repository.WeightRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WeightRecordService {

    private final WeightRecordRepository weightRecordRepository;

    @Autowired
    public WeightRecordService(WeightRecordRepository weightRecordRepository) {
        this.weightRecordRepository = weightRecordRepository;
    }

    public List<WeightRecord> getAllWeightRecords() {
        return weightRecordRepository.findAllByOrderByRecordDateDescIdDesc();
    }

    public List<WeightRecord> getRecentWeightRecords() {
        return weightRecordRepository.findTop7ByOrderByRecordDateDescIdDesc();
    }

    public Optional<WeightRecord> getLatestWeightRecord() {
        return weightRecordRepository.findFirstByOrderByRecordDateDescIdDesc();
    }

    public WeightRecord getWeightRecordById(Long id) {
        return weightRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Weight record not found with id: " + id));
    }

    public WeightRecord saveWeightRecord(WeightRecord weightRecord) {
        weightRecord.calculateBmiValues();
        return weightRecordRepository.save(weightRecord);
    }

    public void deleteWeightRecord(Long id) {
        WeightRecord record = getWeightRecordById(id);
        weightRecordRepository.delete(record);
    }

    public BmiCalculationResponse calculateBmi(BmiCalculationRequest request) {
        double heightInMeters = request.getHeightCm() / 100.0;
        double bmi = request.getWeightKg() / (heightInMeters * heightInMeters);
        bmi = Math.round(bmi * 10.0) / 10.0;

        String category;
        String recommendation;

        if (bmi < 18.5) {
            category = "Underweight";
            recommendation = "Focus on nutrient-dense meals and resistance training to build healthy muscle mass.";
        } else if (bmi < 25.0) {
            category = "Normal weight";
            recommendation = "Great job! Maintain your balanced nutrition and consistent exercise routine.";
        } else if (bmi < 30.0) {
            category = "Overweight";
            recommendation = "Incorporate a mix of cardiovascular exercises and moderate caloric deficit.";
        } else {
            category = "Obese";
            recommendation = "Consult a health professional and focus on low-impact cardio, gradual diet adjustments, and consistency.";
        }

        return new BmiCalculationResponse(request.getWeightKg(), request.getHeightCm(), bmi, category, recommendation);
    }
}
