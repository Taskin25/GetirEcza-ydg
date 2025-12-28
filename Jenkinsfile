pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Docker var mı?') {
      steps {
        bat 'docker --version'
        bat 'docker compose version'
      }
    }
  }
}
