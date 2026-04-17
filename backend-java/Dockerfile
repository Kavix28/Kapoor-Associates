FROM maven:3.9.6-eclipse-temurin-17-alpine AS build
WORKDIR /app
COPY backend-java/pom.xml .
RUN mvn dependency:go-offline -B
COPY backend-java/src ./src
RUN mvn clean package -DskipTests -B

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
CMD ["sh", "-c", "java -Dspring.profiles.active=prod -Dserver.port=$PORT -jar app.jar"]