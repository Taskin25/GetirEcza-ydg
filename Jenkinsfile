pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Test') {
            steps {
                echo 'Jenkinsfile bulundu ve pipeline çalıştı ✅'
            }
        }
    }
}
