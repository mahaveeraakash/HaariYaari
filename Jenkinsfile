def COLLABORATOR_EMAIL = "" // Global variable to store the dynamic email

pipeline {
    agent any

    environment {
        APP_NAME = "haariyaari-backend"
        MY_EMAIL = "aakashmahaveer@gmail.com" 
    }

    stages {
        stage('Cleanup & Pull') {
            steps {
                script {
                    echo "--- Initializing Environment & Fetching Code ---"
                    sh "git config --global --add safe.directory /home/ec2-user/HaariYaari"
                    sh "sudo -u ec2-user bash -c 'cd /home/ec2-user/HaariYaari && git fetch --all && git reset --hard origin/main'"
                    
                    // This line captures the collaborator's real email from the commit
                    COLLABORATOR_EMAIL = sh(script: "cd /home/ec2-user/HaariYaari && git log -1 --pretty=format:'%ae'", returnStdout: true).trim()
                    echo "Build triggered by collaborator: ${COLLABORATOR_EMAIL}"
                }
            }
        }

        stage('Docker Build (Test Environment)') {
            steps {
                echo "--- Building Ultra-Slim Chromium Image ---"
                sh "sudo -u ec2-user bash -c 'cd /home/ec2-user/HaariYaari && docker build -t haariyaari-test .'"
            }
        }

        stage('Run Containerized Tests') {
            steps {
                echo "--- Executing 15 Automated Selenium Tests ---"
                sh "sudo -u ec2-user bash -c 'docker run --rm haariyaari-test'"
            }
        }

        stage('Deploy Application') {
            steps {
                echo "--- Tests Passed: Bringing Deployment UP ---"
                sh "sudo -u ec2-user bash -c 'cd /home/ec2-user/HaariYaari && pm2 restart server.js || pm2 start server.js --name ${APP_NAME}'"
            }
        }
    }

    post {
        always {
            script {
                // DYNAMIC RECIPIENTS: Sends to the collaborator AND you
                def recipients = "${COLLABORATOR_EMAIL}, ${env.MY_EMAIL}"
                
                // Clean up the display name for the email body
                def displayName = COLLABORATOR_EMAIL.contains("noreply") ? "Mahaveer Aakash (via GitHub)" : COLLABORATOR_EMAIL

                echo "Attempting to send email to: ${recipients}"

                mail to: "${recipients}",
                     subject: "HaariYaari Build #${env.BUILD_NUMBER} - ${currentBuild.currentResult}",
                     body: """
Hello,

The Jenkins pipeline execution for HaariYaari is complete.

--- BUILD DETAILS ---
Status: ${currentBuild.currentResult}
Build Number: ${env.BUILD_NUMBER}
Triggered by: ${displayName}
View Full Logs Here: ${env.BUILD_URL}console

Note: If the tests passed, the application is now UP at http://3.93.240.67:5000

Regards,
Jenkins Automation Server
"""
            }
            sh "docker system prune -f"
        }
    }
}
