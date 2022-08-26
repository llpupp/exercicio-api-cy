pipeline {
    agent any

    stages {
        stage('Clonar o repositório') {
            steps {
                git branch: 'main', url: 'https://github.com/llpupp/exercicio-api-cy.git'
            }
        }
        stage('Instalar dependências') {
            steps {
                bat 'npm install'
            }
        }    
        stage('Execução dos testes') {
            steps {
                bat 'npm run cy:run'
            }
        }
        
        stage('Gerar Report') {
            steps {
                bat 'npm run cy:report'
            }
        }    
    }
}