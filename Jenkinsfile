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
                // 1. Identify the trigger email
                def commitEmail = COLLABORATOR_EMAIL.toLowerCase()
                
                // 2. Define your fixed email
                def myEmail = "aakashmahaveer@gmail.com"
                
                // 3. Logic: If it's a noreply address OR contains 'qasim', force his real email
                def professorEmail = "qasimalik@gmail.com"
                def finalRecipients = ""

                if (commitEmail.contains("qasim") || commitEmail.contains("noreply")) {
                    finalRecipients = "${professorEmail}, ${myEmail}"
                } else {
                    finalRecipients = "${commitEmail}, ${myEmail}"
                }

                echo "Resolved Recipients: ${finalRecipients}"

                mail to: "${finalRecipients}",
                     subject: "HaariYaari Build #${env.BUILD_NUMBER} - ${currentBuild.currentResult}",
                     body: """
Hello,

The Jenkins pipeline execution for HaariYaari is complete.

--- BUILD DETAILS ---
Status: ${currentBuild.currentResult}
Build Number: ${env.BUILD_NUMBER}
Triggered by: ${commitEmail}
View Full Logs Here: ${env.BUILD_URL}console

Note: If the tests passed, the application is now UP at http://3.93.240.67:PORT

Regards,
Jenkins Automation Server
"""
            }
            sh "docker system prune -f"
        }
    }
}
