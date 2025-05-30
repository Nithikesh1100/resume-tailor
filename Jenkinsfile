pipeline {
    agent any
    
    environment {
        BUILD_VERSION = "${env.BUILD_NUMBER}"
        NODE_VERSION = '18'
        MAVEN_VERSION = '3.9.0'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }
        
        stage('Build Backend') {
            agent {
                docker {
                    image 'maven:3.9.0-openjdk-17'
                    args '-v /var/run/docker.sock:/var/run/docker.sock'
                }
            }
            steps {
                echo 'Building Spring Boot backend...'
                dir('resume-tailor') {
                    sh 'mvn clean compile'
                }
            }
        }
        
        stage('Test Backend') {
            agent {
                docker {
                    image 'maven:3.9.0-openjdk-17'
                }
            }
            steps {
                echo 'Running backend tests...'
                dir('resume-tailor') {
                    sh 'mvn test'
                }
            }
            post {
                always {
                    publishTestResults testResultsPattern: 'resume-tailor/target/surefire-reports/*.xml'
                }
            }
        }
        
        stage('Build Frontend') {
            agent {
                docker {
                    image 'node:18-alpine'
                }
            }
            steps {
                echo 'Building Next.js frontend...'
                dir('resume-tailor-frontend') {
                    sh '''
                        npm ci
                        npm run build
                    '''
                }
            }
        }
        
        stage('Test Frontend') {
            agent {
                docker {
                    image 'node:18-alpine'
                }
            }
            steps {
                echo 'Running frontend tests...'
                dir('resume-tailor-frontend') {
                    sh '''
                        npm ci
                        npm run lint
                    '''
                }
            }
        }
        
        stage('Package Backend') {
            agent {
                docker {
                    image 'maven:3.9.0-openjdk-17'
                }
            }
            steps {
                echo 'Packaging Spring Boot application...'
                dir('resume-tailor') {
                    sh 'mvn clean package -DskipTests'
                }
            }
            post {
                success {
                    archiveArtifacts artifacts: 'resume-tailor/target/*.jar', fingerprint: true
                }
            }
        }
        
        stage('Deploy to Staging') {
            when {
                branch 'develop'
            }
            steps {
                echo 'Deploying to staging environment...'
                sh '''
                    echo "Starting backend application..."
                    # You can add your deployment commands here
                '''
            }
        }
        
        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                script {
                    input message: 'Deploy to production?', ok: 'Deploy'
                    
                    echo 'Deploying to production...'
                    sh '''
                        echo "Starting production deployment..."
                        # Add your production deployment commands here
                    '''
                }
            }
        }
    }
    
    post {
        always {
            echo 'Cleaning up workspace...'
            cleanWs()
        }
        
        success {
            echo 'Pipeline completed successfully! ✅'
        }
        
        failure {
            echo 'Pipeline failed! ❌'
        }
    }
}