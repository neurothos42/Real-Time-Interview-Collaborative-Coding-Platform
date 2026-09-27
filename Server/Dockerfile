# Stage 1: Build stage using Maven and Eclipse Temurin JDK 21
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copy project descriptor and source files
COPY pom.xml .
COPY src ./src

# Package the application JAR (skipping unit/integration tests for container build)
RUN mvn clean package -DskipTests

# Stage 2: Lightweight runtime stage using Eclipse Temurin JRE 21
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy the executable Spring Boot fat JAR from the builder stage
COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar app.jar

# Render supplies the PORT environment variable dynamically (e.g. 10000).
# application.properties configures server.port=${PORT:8080}.
ENV PORT=8080
EXPOSE 8080

# Run the Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]
