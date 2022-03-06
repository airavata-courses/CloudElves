#!/bin/sh

ip=$(minikube ip)

# create elves namespace
kubectl create namespace elves

# add bitnami repository to helm
helm repo add bitnami https://charts.bitnami.com/bitnami

# install rabbitmq service
# helm install mu-rabbit bitnami/rabbitmq --namespace elves
kubectl apply -f rabbmitmq.yml -n elves

# install postgres service
helm install postgres bitnami/postgresql --namespace elves

# deploy registry service
kubectl apply -f registry-v2.yml

# expose registry as a Nodeport
kubectl apply -f registry-service.yml

# deploy gateway service
kubectl apply -f gateway.yml

# expose gateway as a Nodeport
kubectl apply -f gateway-service.yml

# deploy ingestor service
kubectl apply -f ingestor-v2.yml

# deploy forecast service
kubectl apply -f forecast.yml

# expose forecast as a Nodeport
kubectl apply -f forecast-service.yml

echo "gateway can be accessed at http://$ip:30005. check health at http://$ip:30005/actuator/health"