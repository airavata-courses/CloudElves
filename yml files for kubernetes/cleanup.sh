helm uninstall mu-rabbit -n elves
helm uninstall postgres -n elves

kubectl delete -f forecast.yml
kubectl delete -f forecast-service.yml

kubectl delete -f ingestor.yml

kubectl delete -f gateway.yml
kubectl delete -f gateway-service.yml

kubectl delete -f registry.yml
kubectl delete -f registry-service.yml

kubectl delete namespace elves
