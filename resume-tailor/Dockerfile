# Use a JDK image
FROM eclipse-temurin:17-jdk AS builder
WORKDIR /app

# Copy Maven wrapper and project files
COPY . .
RUN ./mvnw clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jdk
WORKDIR /app

# Copy built JAR from builder
COPY --from=builder /app/target/*.jar app.jar

# Run the JAR
CMD ["java", "-jar", "app.jar"]
