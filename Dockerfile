#Copy from maven to build
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /app

#Copy all code and dependencies
COPY pom.xml .
COPY src ./src

#Clean package and skip tests (tests are already ran in CI)
RUN mvn clean package -DskipTests
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar

#Expose port 8080 and file format
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
