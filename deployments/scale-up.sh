kubectl scale deployment.apps/registry --replicas=1 -n elves
kubectl scale deployment.apps/ingestor --replicas=1 -n elves
kubectl scale deployment.apps/gateway --replicas=1 -n elves
