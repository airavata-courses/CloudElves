pipeline {
    agent any

    options {
        // This is required if you want to clean before build
        skipDefaultCheckout(true)
    }
    environment {
        imagename = "cloudelves/ingestor"
        dockerImage = ''
    }
    stages {
        stage('Cleanup') {
            steps {
                // Clean before build
                cleanWs()
            }
        }
        stage('Checkout') {
            steps {
                echo "Checking out 'ci/ingestor' branch"
                git branch: 'HW3/ingestor-mera',
                url: 'https://github.com/airavata-courses/CloudElves.git',
                credentialsId: 'MyGitHub'
            }
        }
          stage('Local Build') {
            // Installing application dependencies.
            steps {
                echo "Building ${env.JOB_NAME}...."
                sh 'pwd'
                sh 'pip3 install -r requirements.txt'
            }
        }

        stage('Unit Test') {
            // Testing the application.
            steps {
                echo 'Application Testing'
                sh 'pwd'
                // sh 'python3 test_merra_service.py'
                sh 'python3 test_nexrad_service.py'
            }
        }

        stage ('Build docker image') {
            // Build docker image.
            environment {
                EARTHDATA_SECRET = credentials('earthdata_secret')
            }
            steps {
                script {
                    sh 'pwd'
                    dockerImage = docker.build("${imagename}:${env.BUILD_ID}", "--build-arg 'EARTHDATA_SECRET=${EARTHDATA_SECRET}' -f Dockerfile .")
                }
            }
        }
         stage('Publish to DockerHub') {
            environment {
                registryCredential = 'dockerHub'
            }
            steps{
                script {
                    docker.withRegistry( '', registryCredential ) {
                        dockerImage.push("$BUILD_NUMBER")
                        dockerImage.push('latest')
                    }
                }
            }
        }
        stage('Remove unused docker image') {
            steps{
                sh "docker rmi $imagename:$BUILD_NUMBER"
                sh "docker rmi $imagename:latest"

            }
        }
        stage('Checkout ansible deployments branch') {
            steps {
                echo "Checking out 'ansible deployments' branch"
                sh 'git checkout ansible-k8s-deployments'
            }
        }
        stage('Deploy to Jetstreams') {
            environment {
                SSH_PRIVATE_KEY = credentials('ssh_key_ansible_to_k8s')
            }
            steps {
                sh 'pwd'
                script{
                    sh "ansible-playbook -i /etc/ansible-host-inventory playbooks/ingestor-playbook.yml --extra-vars \"version=$BUILD_NUMBER\" --private-key=$SSH_PRIVATE_KEY"
                }
            }
        }

    }
}