pipeline {
    agent any

    tools {
        nodejs 'NodeJS20'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install dependencies') {
            steps {
                dir('client'){
                    sh 'npm ci'
                }
            }
        }

        stage('Run Tests') {
            steps {
                dir('client') {
                    sh 'npm test -- --watch=false --browsers=ChromeHeadless || true'
                }
            }
        }

        stage('Build Angular') {
            steps {
                dir('client') {
                    sh 'npm run build'
                }
            }
        }
    }
}
