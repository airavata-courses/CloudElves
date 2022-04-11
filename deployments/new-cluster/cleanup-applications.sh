export KUBECONFIG=config
alias k="kubectl --insecure-skip-tls-verify"

echo "deploying ingestor"
k delete -f ingestor-deployment.yml

echo "deploying registry"
k delete -f registry-deployment.yml

echo "deploying gateway"
k delete -f gateway-deployment.yml

echo "deploying ui"
k delete -f ui-deployment.yml