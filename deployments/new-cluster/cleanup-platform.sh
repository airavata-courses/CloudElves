export KUBECONFIG=config
alias k="kubectl --insecure-skip-tls-verify"

echo "deleting postgres"
k delete -f postgres.yml

echo "deleting rabbitmq"
k delete -f rabbitmq.yml

echo "deleting redis"
k delete -f redis.yml