package com.fittrack;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class FitTrackApplication {

    public static void main(String[] args) {
        SpringApplication.run(FitTrackApplication.class, args);
        System.out.println("=================================================");
        System.out.println(" FitTrack Fitness Management System Backend Started");
        System.out.println(" API Base URL: http://localhost:8080/api");
        System.out.println("=================================================");
    }
}
