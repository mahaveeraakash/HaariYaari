def COLLABORATOR_EMAIL = "" // Global variable to store the dynamic email

pipeline {
    agent any

    environment {
        APP_NAME = "haariyaari-backend"
        // Replace with your actual email to receive copies of every build
        MY_EMAIL = "your-email@example.com" 
    }

    stages {
        stage('Cleanup & Pull') {
            steps {
                script {
                    echo "--- Initializing Environment & Fetching Code ---"
                    
                    // Fixes the 'dubious ownership' error for the Jenkins user
                    sh "git config --global --add safe.directory /home/ec2-user/HaariYaari"
                    
                    // Sync the repository
                    sh "sudo -u ec2-user bash -c 'cd /home/ec2-user/HaariYaari && git fetch --all && git reset --hard origin/main'"
                    
                    // Capture the email of the person who pushed the code
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
                // If tests fail, the pipeline stops here and the app stays DOWN
                sh "sudo -u ec2-user bash -c 'docker run --rm haariyaari-test'"
            }
        }

        stage('Deploy Application') {
            steps {
                echo "--- Tests Passed: Bringing Deployment UP ---"
                // This only runs if tests pass
                sh "sudo -u ec2-user bash -c 'cd /home/ec2-user/HaariYaari && pm2 restart server.js || pm2 start server.js --name ${APP_NAME}'"
            }
        }
    }

    post {
        always {
            script {
                // Determine recipients (Collaborator + You)
                def recipients = "${COLLABORATOR_EMAIL}"
                if (env.MY_EMAIL) { recipients += ", ${env.MY_EMAIL}" }

                if (COLLABORATOR_EMAIL != "") {
                    echo "Sending results to: ${recipients}"
                    mail to: "${recipients}",
                         subject: "HaariYaari Build #${env.BUILD_NUMBER} - Result: ${currentBuild.currentResult}",
                         body: """
Hello,

The Jenkins pipeline execution for HaariYaari is complete.

--- BUILD DETAILS ---
Status: ${currentBuild.currentResult}
Build Number: ${env.BUILD_NUMBER}
Triggered by: ${COLLABORATOR_EMAIL}
Console Log: ${env.BUILD_URL}console

The application has been deployed/restarted on the EC2 instance if the tests were successful.

Regards,
Jenkins Automation Server
"""
                }
            }
            // Cleanup to keep your 16GB disk healthy
            sh "docker system prune -f"
        }
    }
}
