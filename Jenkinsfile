def COLLABORATOR_EMAIL = "" 

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
                    sh "git config --global --add safe.directory /home/ec2-user/HaariYaari"
                    sh "sudo -u ec2-user bash -c 'cd /home/ec2-user/HaariYaari && git fetch --all && git reset --hard origin/main'"
                    
                    // DYNAMIC: Capture the email from the actual commit that triggered this
                    COLLABORATOR_EMAIL = sh(script: "cd /home/ec2-user/HaariYaari && git log -1 --pretty=format:'%ae'", returnStdout: true).trim()
                }
            }
        }

        stage('Docker Build (Test Environment)') {
            steps {
                sh "sudo -u ec2-user bash -c 'cd /home/ec2-user/HaariYaari && docker build -t haariyaari-test .'"
            }
        }

        stage('Run Containerized Tests') {
            steps {
                sh "sudo -u ec2-user bash -c 'docker run --rm haariyaari-test'"
            }
        }

        stage('Deploy Application') {
            steps {
                sh "sudo -u ec2-user bash -c 'cd /home/ec2-user/HaariYaari && pm2 restart server.js || pm2 start server.js --name ${APP_NAME}'"
            }
        }
    }

    post {
        always {
            script {
                // RULE 1: Only proceed if the build was triggered by a GitHub Push
                def isGitHubTrigger = currentBuild.getBuildCauses().toString().contains('GitHubPushCause')

                if (isGitHubTrigger && COLLABORATOR_EMAIL != "") {
                    echo "GitHub commit detected from: ${COLLABORATOR_EMAIL}. Sending report..."
                    
                    mail to: "${COLLABORATOR_EMAIL}, ${env.MY_EMAIL}",
                         subject: "HaariYaari Build #${env.BUILD_NUMBER} - ${currentBuild.currentResult}",
                         body: """
Hello,

This is an automated result for the commit pushed to the HaariYaari repository.

BUILD DETAILS:
- Status: ${currentBuild.currentResult}
- Build Number: ${env.BUILD_NUMBER}
- Console Logs: ${env.BUILD_URL}console

The application has been updated on the server if the tests passed.

Regards,
Jenkins Automation Server
"""
                } else {
                    echo "Not a GitHub commit trigger. No email sent to collaborator."
                }
            }
            // Keep the 16GB disk clean
            sh "docker system prune -f"
        }
    }
}
