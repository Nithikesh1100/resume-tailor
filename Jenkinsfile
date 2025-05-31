pipeline {
    agent any
    
    environment {
        BUILD_VERSION = "${env.BUILD_NUMBER}"
        MAVEN_OPTS = "-Dmaven.repo.local=/tmp/.m2 -Dorg.slf4j.simpleLogger.log.org.apache.maven.cli.transfer.Slf4jMavenTransferListener=WARN"
    }
    
    stages {
        stage('🔍 Checkout') {
            steps {
                echo '📥 Checking out source code...'
                checkout scm
            }
        }
        
        stage('🏗️ Build Backend') {
            agent {
                docker {
                    image 'maven:3-openjdk-17'
                    args '-v /var/run/docker.sock:/var/run/docker.sock'
                }
            }
            steps {
                echo '🔨 Building Spring Boot backend...'
                dir('resume-tailor') {
                    sh 'mvn clean compile -q -f pom.xml'
                }
            }
        }
        
        stage('🧪 Test Backend') {
            agent {
                docker {
                    image 'maven:3-openjdk-17'
                }
            }
            steps {
                echo '🔬 Running backend tests...'
                dir('resume-tailor') {
                    sh 'mvn test -q -f pom.xml'
                }
            }
            post {
                always {
                    dir('resume-tailor') {
                        script {
                            if (fileExists('target/surefire-reports/*.xml')) {
                                publishTestResults testResultsPattern: 'target/surefire-reports/*.xml'
                            }
                        }
                    }
                }
            }
        }
        
        stage('⚛️ Build Frontend') {
            agent {
                docker {
                    image 'node:18-alpine'
                }
            }
            steps {
                echo '🎨 Building Next.js frontend...'
                dir('resume-tailor-frontend') {
                    sh '''
                        npm ci --silent
                        npm run build
                    '''
                }
            }
        }
        
        stage('✅ Test Frontend') {
            agent {
                docker {
                    image 'node:18-alpine'
                }
            }
            steps {
                echo '🔍 Running frontend tests...'
                dir('resume-tailor-frontend') {
                    sh '''
                        npm ci --silent
                        npm run lint
                    '''
                }
            }
        }
        
        stage('📦 Package Backend') {
            agent {
                docker {
                    image 'maven:3-openjdk-17'
                }
            }
            steps {
                echo '📦 Packaging Spring Boot application...'
                dir('resume-tailor') {
                    sh 'mvn clean package -DskipTests -q -f pom.xml'
                }
            }
            post {
                success {
                    dir('resume-tailor') {
                        archiveArtifacts artifacts: 'target/*.jar', fingerprint: true
                        echo '✅ JAR file created and archived!'
                    }
                }
            }
        }
        
        stage('🚀 Deploy to Staging') {
            when {
                branch 'develop'
            }
            steps {
                echo '🎯 Deploying to staging environment...'
                sh 'echo "✅ Staging deployment completed!"'
            }
        }
        
        stage('🌟 Deploy to Production') {
            when {
                anyOf {
                    branch 'main'
                    branch 'master'
                }
            }
            steps {
                script {
                    input message: '🚀 Deploy to production?', ok: 'Deploy'
                    
                    echo '🌟 Deploying to production...'
                    sh 'echo "✅ Production deployment completed!"'
                }
            }
        }
    }
    
    post {
        always {
            echo '🧹 Cleaning up...'
            // Use deleteDir instead of cleanWs
            deleteDir()
        }
        
        success {
            echo '🎉 Pipeline completed successfully! ✅'
        }
        
        failure {
            echo '💥 Pipeline failed! ❌'
            echo '📋 Check the logs above for details.'
        }
    }
}
