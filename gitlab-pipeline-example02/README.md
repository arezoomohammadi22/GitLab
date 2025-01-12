# GitLab CI/CD and Helm Example

This repository demonstrates how to set up a CI/CD pipeline with GitLab and Helm for deploying a Node.js application to Kubernetes.

## Features

- Dockerized Node.js application
- Kubernetes deployment using Helm charts
- CI/CD pipeline for build, test, and deployment

## File Structure

```
.
├── app/
│   ├── package.json
│   ├── package-lock.json
│   ├── server.js
├── charts/
│   └── web-app/
│       ├── Chart.yaml
│       ├── values.yaml
│       └── templates/
│           ├── deployment.yaml
│           ├── service.yaml
│           ├── ingress.yaml
├── .gitlab-ci.yml
├── Dockerfile
└── README.md
```

## Setup

1. Clone this repository.
2. Configure your Kubernetes cluster and Helm.
3. Replace `your-docker-registry` with your Docker registry in `values.yaml` and `.gitlab-ci.yml`.
4. Push changes to the `main` branch to trigger the CI/CD pipeline.

## CI/CD Pipeline

The pipeline includes the following stages:

1. **Build:** Builds and pushes the Docker image.
2. **Test:** Runs application tests.
3. **Package:** Packages the Helm chart.
4. **Deploy:** Deploys the application to Kubernetes.
5. **Notify:** Sends a deployment notification.

## Requirements

- GitLab CI/CD
- Docker
- Kubernetes
- Helm
