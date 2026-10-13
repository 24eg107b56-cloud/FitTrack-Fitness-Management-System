# ========================================================
# Multi-stage Dockerfile for FitTrack Full Stack App
# ========================================================

# Stage 1: Build backend JAR and bundle frontend
FROM maven:3.9-eclipse-temurin-17-alpine AS build
WORKDIR /app

# Copy backend pom and source code
COPY backend/pom.xml .
COPY backend/src ./src

# Bundle frontend static assets into Spring Boot resources
COPY frontend ./src/main/resources/static

# Build production JAR (skipping tests for quick build)
RUN mvn clean package -DskipTests

# Stage 2: Runtime image with lightweight JRE
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy built artifact
COPY --from=build /app/target/*.jar app.jar

# Render / Cloud environment port
ENV PORT=8080
EXPOSE 8080

# Launch application with dynamic PORT assignment
ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT} -jar app.jar"]
