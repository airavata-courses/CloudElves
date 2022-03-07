# helm uninstall mu-rabbit -n elves
helm uninstall elves-postgres -n elves

kubectl delete -f rabbitmq.yml -n elves

kubectl delete -f forecast.yml
kubectl delete -f forecast-service.yml

hostPath=$(pwd)
hostPath="$hostPath/data"
cat ingestor-v2.yml | sed "s|{{hostPath}}|$hostPath|g"  | kubectl delete -f -
rm -rf $hostPath


kubectl delete -f gateway.yml
kubectl delete -f gateway-service.yml

kubectl delete -f registry.yml
kubectl delete -f registry-service.yml

kubectl delete namespace elves
