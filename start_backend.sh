docker network create elves-network
docker pull postgres
docker pull rabbitmq:3.9-management-alpine
docker pull madhavankr/elves-registry:latest
docker pull madhavankr/elves-ingestor:latest
docker pull madhavankr/elves-gateway:latest
docker pull ayush3103/forecast-http:latest
docker run --rm -d --net elves-network -p 5001:5432 -e POSTGRES_PASSWORD=cloudelves --name postgres postgres
docker run --rm -d --net elves-network -p 15672:15672 -p 5672:5672 --name rmq rabbitmq:3.9-management-alpine
docker run --rm -d --net elves-network -p 8080:8080 -e db.host=postgres -e db.port=5432 -e rmq.host=rmq --name registry madhavankr/elves-registry:latest
docker run --rm -d --net elves-network -p 8000:8000 -e rmq_host=rmq --name ingestor madhavankr/elves-ingestor:latest
docker run --rm -d --net elves-network -p 8082:8082 -e forecaster.host=forecast -e spring.rabbitmq.host=rmq -e spring.rabbitmq.username=guest -e spring.rabbitmq.password=guest --name gateway madhavankr/elves-gateway:latest
docker run --rm -d --net elves-network -p 8001:8001 --name forecast madhavankr/elves-forecast:latest
