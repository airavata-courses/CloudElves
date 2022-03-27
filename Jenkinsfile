pipeline {

    agent any

    options {
        // This is required if you want to clean before build.
        skipDefaultCheckout(true)
    }

    environment {
        DOCKERHUB_CREDENTIALS='dockerHub'
        imagename = "cloudelves/ingestor"
        dockerImage = ''
    }

    stages {
        stage ('Cleanup') {
            // Cleanup before build
            steps {
                cleanWs()
            }
        }

        stage ('Checkout') {
            // Checkout to git branch.
            steps {
                git branch: 'hw2/ingestor',
                url: 'https://github.com/airavata-courses/CloudElves',
                credentialsId: 'GitHub-Navkar'
            }
        }

        stage('Local Build') {
            // Installing application dependencies.
            steps {
                echo 'Building ${env.JOB_NAME}....'
                sh 'pwd'
                sh 'python3 -m pip install --user -r requirements.txt'
            }
        }

        stage('Unit Test') {
            // Testing the application.
            steps {
                echo 'Application Testing'
                sh 'pwd'
                sh 'python3 test.py'
            }
        }

        stage ('Docker Build') {
            // Build docker image.
            steps {
                sh 'pwd'
                script {
                    dockerImage = docker.build imagename
                }
            }
        }

        stage('Push to Dockerhub') {
            // Push to DockerHub.
            steps{
                script {
                    docker.withRegistry( '', DOCKERHUB_CREDENTIALS ) {
                        dockerImage.push("$BUILD_NUMBER")
                        dockerImage.push('latest')
                    }
                }
            }
        }
    }
}