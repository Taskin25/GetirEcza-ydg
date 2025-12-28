pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Docker Build & Up') {
      steps {
        bat 'docker compose down --remove-orphans'
        bat 'docker compose build'
        bat 'docker compose up -d'
      }
    }

    stage('Container Status') {
      steps {
        bat 'docker compose ps'
      }
    }
  }
}
