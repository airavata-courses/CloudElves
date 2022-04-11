export KUBECONFIG=config
alias k="kubectl --insecure-skip-tls-verify"

echo "deploying ingestor"
k apply -f ingestor-deployment.yml

echo "deploying registry"
k apply -f registry-deployment.yml

echo "deploying gateway"
k apply -f gateway-deployment.yml

echo "deploying ui"
k apply -f ui-deployment.yml