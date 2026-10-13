package com.fittrack.dto;

public class BmiCalculationResponse {

    private Double weightKg;
    private Double heightCm;
    private Double bmi;
    private String category;
    private String healthRecommendation;

    public BmiCalculationResponse() {
    }

    public BmiCalculationResponse(Double weightKg, Double heightCm, Double bmi, String category, String healthRecommendation) {
        this.weightKg = weightKg;
        this.heightCm = heightCm;
        this.bmi = bmi;
        this.category = category;
        this.healthRecommendation = healthRecommendation;
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

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getHealthRecommendation() {
        return healthRecommendation;
    }

    public void setHealthRecommendation(String healthRecommendation) {
        this.healthRecommendation = healthRecommendation;
    }
}
