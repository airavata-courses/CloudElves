export KUBECONFIG=../config
alias k="kubectl --insecure-skip-tls-verify"
k apply -f configmap-s3server.yml -n elves
k apply -f pv-s3server.yml -n elves
k apply -f pvc-s3server.yml -n elves
k apply -f pv2-s3server.yml -n elves
k apply -f pvc2-s3server.yml -n elves
k apply -f deploy-s3server-pv.yml --record -n elves
k apply -f svc-nodeport.yml -n elves