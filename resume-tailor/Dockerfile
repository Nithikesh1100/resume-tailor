# Use Java 17 base image
FROM eclipse-temurin:17-jdk as builder

WORKDIR /app

# Copy Maven wrapper and project files
COPY . .

# Give mvnw execute permission
RUN chmod +x ./mvnw

# Build the project
RUN ./mvnw clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jdk

WORKDIR /app

# Copy jar from builder
COPY --from=builder /app/target/*.jar app.jar

# Run the app
ENTRYPOINT ["java", "-jar", "app.jar"]
