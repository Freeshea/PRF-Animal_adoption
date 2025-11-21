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
                sh 'npm ci'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test -- --watch=false --browsers=ChromeHeadless'
            }
        }

        stage('Build Angular') {
            steps {
                sh 'npm run build'
            }
        }
    }
}
