pipeline {

  environment {
    PROJECT      = "contact-manager-265704"
    APP_NAME     = "contact-manager"
    FE_SVC_NAME = "${APP_NAME}-frontend"
    CLUSTER = "jenkins-cd"
    CLUSTER_ZONE = "us-east1-d"
    BE_IMAGE_TAG = "gcr.io/${PROJECT}/${APP_NAME}-frontend:${env.BRANCH_NAME}.${env.BUILD_NUMBER}"
    FE_IMAGE_TAG = "gcr.io/${PROJECT}/${APP_NAME}-backend:${env.BRANCH_NAME}.${env.BUILD_NUMBER}"
    JENKINS_CRED = "${PROJECT}"
  }

  agent {
    kubernetes {
      label 'sample-app'
      defaultContainer 'jnlp'
      yaml """
apiVersion: v1
kind: Pod
metadata:
labels:
  component: ci
spec:
  # Use service account that can deploy to all namespaces
  serviceAccountName: cd-jenkins
  containers:
  - name: gcloud
    image: gcr.io/cloud-builders/gcloud
    command:
    - cat
    tty: true
  - name: kubectl
    image: gcr.io/cloud-builders/kubectl
    command:
    - cat
    tty: true
"""
}
  }
  stages {
    
    stage('Build and push image with Container Builder') {
      steps {
        container('gcloud') {
            dir ('backend') {
                sh "PYTHONUNBUFFERED=1 gcloud builds submit -t ${BE_IMAGE_TAG}"
            }
            
            dir ('frontend') {
                sh "mv Dockerfile-prod Dockerfile"
                sh "PYTHONUNBUFFERED=1 gcloud builds submit -t ${FE_IMAGE_TAG}"
            }
        }
      }
    }

    stage('Deploy Production') {
      // Production branch
      //when { branch 'master' }
      steps{
        container('kubectl') {
        // Change deployed image in canary to the one we just built
          // sh("sed -i.bak 's#gcr.io/cloud-solutions-images/gceme:1.0.0#${IMAGE_TAG}#' ./k8s/production/*.yaml")
          sh("sed -i.bak 's#gcr.io/contact-manager-265704/contact-manager-backend:latest#${BE_IMAGE_TAG}#' ./k8s/production/*backend*.yaml")
          sh("sed -i.bak 's#gcr.io/contact-manager-265704/contact-manager-frontend:latest#${FE_IMAGE_TAG}#' ./k8s/production/*frontend*.yaml")

          step([$class: 'KubernetesEngineBuilder',namespace:'production', projectId: env.PROJECT, clusterName: env.CLUSTER, zone: env.CLUSTER_ZONE, manifestPattern: 'k8s/services', credentialsId: env.JENKINS_CRED, verifyDeployments: false])
          step([$class: 'KubernetesEngineBuilder',namespace:'production', projectId: env.PROJECT, clusterName: env.CLUSTER, zone: env.CLUSTER_ZONE, manifestPattern: 'k8s/production', credentialsId: env.JENKINS_CRED, verifyDeployments: true])
          sh("echo http://`kubectl --namespace=production get service/${FE_SVC_NAME} -o jsonpath='{.status.loadBalancer.ingress[0].ip}'` > ${FE_SVC_NAME}")
        }
      }
    }
  }
}
