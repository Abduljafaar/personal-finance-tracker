# ---------- Build Stage ----------
FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /app

# Copy all project files
COPY . .

# Build the Spring Boot application
RUN mvn clean package -DskipTests

# ---------- Runtime Stage ----------
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy the generated JAR from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose the application port
EXPOSE 8080

# Start the application
ENTRYPOINT ["java", "-jar", "app.jar"]