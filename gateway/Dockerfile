FROM openjdk:11
ARG JAR_FILE=target/gateway-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} app.jar
ENV registry.host registry
ENV registry.port 8080
ENV ingestor.host ingestor
ENV ingestor.port 8000
ENV forecaster.host forecaster
ENV forecaster.port 8001
EXPOSE 8082
ENTRYPOINT ["java","-jar","/app.jar"]