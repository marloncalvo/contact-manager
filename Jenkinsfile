pipeline {
	
	environment {
		PROJECT      = "contact-manager-265704"
		APP_NAME     = "contact-manager"
		FE_SVC_NAME  = "${APP_NAME}-frontend"
		CLUSTER      = "jenkins-cd"
		CLUSTER_ZONE = "us-east1-d"
		IMAGE_TAG    = "gcr.io/${PROJECT}/${APP_NAME}:${env.BRANCH_NAME}.${env.BUILD_NUMBER}"
		JENKINS_CRED = "${PROJECT}"
	}

	agent {
		kubernetes {
			label 'contact-manager'
			defaultContainer 'jnlp'
			yaml """
apiVersion: v1
kind: Pod
metadata:
labels:
	component: ci
spec:
	serviceAccountName: cd-jenkins
	containers:
		- name: nodejs
		image: nodejs:12.14.1
		command:
			- cat
		tty: true
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
		/*
		stage('Test') {
			steps {
				container('nodejs') {
					sh """
						ln -s 'pwd' /nodejs/src/contact-manager
						cd /nodejs/src/contact-manager
						pushd frontend
						npm test
						popd
						pushd backend
						npm test
						popd
					"""
				}
			}
		}
		*/

		stage('Build and push image with Container Builder') {
			steps {
				container('gcloud') {
					sh "PYTHONUNBUFFERED=1 gcloud builds submit -t gcr.io/contact-manager-265704/contact-manager-frontend:latest"
					sh "PYTHONUNBUFFERED=1 gcloud builds submit -t gcr.io/contact-manager-265704/contact-manager-backend:latest"
				}
			}
		}

		stage('Deploy Production') {
			// when { branch 'master' }
			steps {
				container('kubectl') {
					step([$class: 'KubernetesEngineBuilder',namespace:'production', projectId: env.PROJECT, clusterName: env.CLUSTER, zone: env.CLUSTER_ZONE, manifestPattern: 'k8s/services', credentialsId: env.JENKINS_CRED, verifyDeployments: false])
					step([$class: 'KubernetesEngineBuilder',namespace:'production', projectId: env.PROJECT, clusterName: env.CLUSTER, zone: env.CLUSTER_ZONE, manifestPattern: 'k8s/production', credentialsId: env.JENKINS_CRED, verifyDeployments: true])
					sh("echo http://`kubectl --namespace=production get service/${FE_SVC_NAME} -o jsonpath='{.status.loadBalancer.ingress[0].ip}'` > ${FE_SVC_NAME}")
				}
			}
		}
	}
}