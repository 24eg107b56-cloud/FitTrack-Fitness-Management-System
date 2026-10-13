package com.fittrack.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Entity
@Table(name = "weight_records")
public class WeightRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Weight in kg is required")
    @Column(nullable = false)
    private Double weightKg;

    @NotNull(message = "Height in cm is required")
    @Column(nullable = false)
    private Double heightCm;

    private Double bmi;

    @Column(length = 50)
    private String bmiCategory; // Underweight, Normal weight, Overweight, Obese

    @NotNull(message = "Record date is required")
    @Column(nullable = false)
    private LocalDate recordDate;

    @Column(length = 500)
    private String notes;

    public WeightRecord() {
    }

    public WeightRecord(Long id, Double weightKg, Double heightCm, Double bmi, String bmiCategory,
                        LocalDate recordDate, String notes) {
        this.id = id;
        this.weightKg = weightKg;
        this.heightCm = heightCm;
        this.bmi = bmi;
        this.bmiCategory = bmiCategory;
        this.recordDate = recordDate;
        this.notes = notes;
    }

    @PrePersist
    @PreUpdate
    public void calculateBmiValues() {
        if (weightKg != null && heightCm != null && heightCm > 0) {
            double heightInMeters = heightCm / 100.0;
            double calculatedBmi = weightKg / (heightInMeters * heightInMeters);
            this.bmi = Math.round(calculatedBmi * 10.0) / 10.0; // round to 1 decimal place

            if (this.bmi < 18.5) {
                this.bmiCategory = "Underweight";
            } else if (this.bmi < 25.0) {
                this.bmiCategory = "Normal weight";
            } else if (this.bmi < 30.0) {
                this.bmiCategory = "Overweight";
            } else {
                this.bmiCategory = "Obese";
            }
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getWeightKg() {
        return weightKg;
    }

    public void setWeightKg(Double weightKg) {
        this.weightKg = weightKg;
    }

    public Double getHeightCm() {
        return heightCm;
    }

    public void setHeightCm(Double heightCm) {
        this.heightCm = heightCm;
    }

    public Double getBmi() {
        return bmi;
    }

    public void setBmi(Double bmi) {
        this.bmi = bmi;
    }

    public String getBmiCategory() {
        return bmiCategory;
    }

    public void setBmiCategory(String bmiCategory) {
        this.bmiCategory = bmiCategory;
    }

    public LocalDate getRecordDate() {
        return recordDate;
    }

    public void setRecordDate(LocalDate recordDate) {
        this.recordDate = recordDate;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
