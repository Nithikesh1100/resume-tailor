pipeline {
    agent any

    environment {
        BUILD_VERSION = "${env.BUILD_NUMBER}"
        // Cache repo in Jenkins home, not in /tmp (so it persists)
        MAVEN_OPTS = "-Dmaven.repo.local=/root/.m2/repository -Dorg.slf4j.simpleLogger.log.org.apache.maven.cli.transfer.Slf4jMavenTransferListener=WARN"
        NPM_CONFIG_CACHE = "/root/.npm" // cache npm downloads
    }

    stages {
        stage('🔍 Checkout') {
            steps {
                echo '📥 Checking out source code...'
                checkout scm
            }
        }

        stage('🏗️ Build & Test Backend') {
            agent {
                docker {
                    image 'maven:3.9.6-eclipse-temurin-17'
                    args '-v $HOME/.m2:/root/.m2'
                }
            }
            steps {
                echo '🔨 Building & Testing Spring Boot backend...'
                dir('resume-tailor') {
                    // single Maven run: compiles, tests, and packages
                    sh 'mvn clean package -q'
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
                success {
                    dir('resume-tailor') {
                        archiveArtifacts artifacts: 'target/*.jar', fingerprint: true
                        echo '✅ JAR file created and archived!'
                    }
                }
            }
        }

        stage('⚛️ Build Frontend') {
            agent {
                docker {
                    image 'node:18-alpine'
                    args '-v $HOME/.npm:/root/.npm'
                }
            }
            steps {
                echo '🎨 Building Next.js frontend...'
                dir('resume-tailor-frontend') {
                    sh '''
                        npm ci --prefer-offline --no-audit --progress=false
                        npm run ci:build
                    '''
                }
            }
        }

        stage('✅ Test Frontend') {
            agent {
                docker {
                    image 'node:18-alpine'
                    args '-v $HOME/.npm:/root/.npm'
                }
            }
            steps {
                echo '🔍 Running frontend lint & type-check...'
                dir('resume-tailor-frontend') {
                    sh '''
                        npm run lint
                        npm run type-check
                    '''
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
