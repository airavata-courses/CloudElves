kubectl scale deployment.apps/registry --replicas=3 -n elves
kubectl scale deployment.apps/ingestor --replicas=3 -n elves
kubectl scale deployment.apps/gateway --replicas=3 -n elves