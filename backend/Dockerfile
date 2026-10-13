# Multi-stage Dockerfile for backend service
FROM maven:3.9-eclipse-temurin-17-alpine AS build
WORKDIR /app

# Copy pom and sources (works when build context is backend)
COPY pom.xml .
COPY src ./src

# Build JAR
RUN mvn clean package -DskipTests

# Runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT} -jar app.jar"]
