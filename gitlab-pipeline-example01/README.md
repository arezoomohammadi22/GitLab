
# Complex GitLab CI/CD Setup for Node.js Application

This guide explains a more advanced setup for using GitLab CI/CD to build, test, and deploy a Node.js application to the GitLab Container Registry. This includes adding routes, logging, and testing to the Node.js app, and configuring the CI/CD pipeline with a CI/CD token for registry access.

## Prerequisites

- **GitLab Project**: A GitLab project with the Container Registry enabled.
- **Docker Installed Locally**: For testing and running the application in a Docker container.

---

## Application Structure

- **app.js**: The main application file with multiple routes and logging.
- **test/test.js**: A basic test to ensure the app runs correctly.
- **package.json**: Includes dependencies like Express and Morgan for routing and logging.
- **Dockerfile**: Configured to accept environment variables for `NODE_ENV` and `PORT`.
- **.gitlab-ci.yml**: Defines the CI/CD pipeline to build, test, and push the Docker image to the GitLab Container Registry.

---

## Setting Up GitLab CI/CD Pipeline

### 1. Add `.gitlab-ci.yml` to Your Project

This `.gitlab-ci.yml` file defines three stages: `build`, `test`, and `push`. The `CI_JOB_TOKEN` is used for secure access to the GitLab Container Registry.

```yaml
stages:
  - build
  - test
  - push

variables:
  REGISTRY_IMAGE: "${CI_REGISTRY_IMAGE}:${CI_COMMIT_REF_SLUG}"

# Build Job
build:
  stage: build
  script:
    - docker build -t $REGISTRY_IMAGE --build-arg NODE_ENV=production --build-arg PORT=3000 .
  only:
    - main

# Test Job
test:
  stage: test
  image: node:14
  script:
    - npm install
    - npm test
  only:
    - main

# Push Job
push:
  stage: push
  script:
    - docker login -u "gitlab-ci-token" -p "$CI_JOB_TOKEN" $CI_REGISTRY
    - docker push $REGISTRY_IMAGE
  only:
    - main
```

### 2. Environment Variables

- `CI_JOB_TOKEN`: GitLab CI/CD provides this token automatically in each pipeline, so no additional configuration is needed to access the Container Registry.
- `CI_REGISTRY_IMAGE` and `CI_COMMIT_REF_SLUG`: Built-in GitLab variables used to define the image path and tag based on the project registry and branch name.

---

## Running the Application Locally

To run the application locally:

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the Application**:
   ```bash
   npm start
   ```

3. **Run Tests**:
   ```bash
   npm test
   ```

---

## Docker Commands for Local Testing

To build and run the application locally in Docker:

1. **Build the Docker Image**:
   ```bash
   docker build -t gitlab_ci_cd_demo_complex .
   ```

2. **Run the Docker Container**:
   ```bash
   docker run -p 3000:3000 gitlab_ci_cd_demo_complex
   ```

Visit `http://localhost:3000` in your browser to see the app in action.

---

## Pipeline Overview

- **build**: Builds the Docker image.
- **test**: Runs the tests in a Node.js environment.
- **push**: Pushes the Docker image to the GitLab Container Registry using `CI_JOB_TOKEN` for authentication.

After this setup, each commit to the `main` branch will trigger a pipeline that builds, tests, and pushes the Docker image to your GitLab Container Registry.

---

For more information on CI/CD in GitLab, visit the [GitLab CI/CD Documentation](https://docs.gitlab.com/ee/ci/).
