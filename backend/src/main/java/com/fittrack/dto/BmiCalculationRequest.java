package com.fittrack.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class BmiCalculationRequest {

    @NotNull(message = "Weight is required")
    @Positive(message = "Weight must be positive")
    private Double weightKg;

    @NotNull(message = "Height is required")
    @Positive(message = "Height must be positive")
    private Double heightCm;

    public BmiCalculationRequest() {
    }

    public BmiCalculationRequest(Double weightKg, Double heightCm) {
        this.weightKg = weightKg;
        this.heightCm = heightCm;
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
}
