pipeline {
    agent any
    
    environment {
        BUILD_VERSION = "${env.BUILD_NUMBER}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }
        
        stage('Build Backend') {
            steps {
                echo 'Building Spring Boot backend...'
                dir('resume-tailor') {
                    sh 'mvn clean compile -f pom.xml'
                }
            }
        }
        
        stage('Test Backend') {
            steps {
                echo 'Running backend tests...'
                dir('resume-tailor') {
                    sh 'mvn test -f pom.xml'
                }
            }
            post {
                always {
                    dir('resume-tailor') {
                        publishTestResults testResultsPattern: 'target/surefire-reports/*.xml'
                    }
                }
            }
        }
        
        stage('Build Frontend') {
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
            steps {
                echo 'Packaging Spring Boot application...'
                dir('resume-tailor') {
                    sh 'mvn clean package -DskipTests -f pom.xml'
                }
            }
            post {
                success {
                    dir('resume-tailor') {
                        archiveArtifacts artifacts: 'target/*.jar', fingerprint: true
                    }
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
                    # Add your deployment commands here
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
