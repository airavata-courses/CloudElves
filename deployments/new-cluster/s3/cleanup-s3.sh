export KUBECONFIG=../config
alias k="kubectl --insecure-skip-tls-verify"
k delete -f configmap-s3server.yml -n elves
k delete -f deploy-s3server-pv.yml
k delete -f svc-nodeport.yml -n elves
k delete -f pvc-s3server.yml -n elves
k delete -f pv-s3server.yml -n elves
k delete -f pvc2-s3server.yml -n elves
k delete -f pv2-s3server.yml -n elves
