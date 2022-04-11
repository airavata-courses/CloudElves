export KUBECONFIG=config
alias k="kubectl --insecure-skip-tls-verify"

echo "creating namespace elves"
k create namespace elves

echo "deploying postgres"
k apply -f postgres.yml -n elves

echo "deploying rabbitmq"
k apply -f rabbitmq.yml -n elves

echo "deploying redis"
k apply -f redis.yml -n elves