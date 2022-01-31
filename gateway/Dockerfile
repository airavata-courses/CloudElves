FROM openjdk:11
ARG JAR_FILE=target/gateway-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java","-jar","/app.jar"]