
# GitLab Container Registry Setup on Ubuntu 20.04

This guide details the steps to enable and configure the GitLab Container Registry on an Ubuntu 20.04 server with custom SSL certificates.

## Prerequisites

- GitLab installed on an Ubuntu 20.04 server.
- Custom SSL certificates available (`fullchain.pem` and `private.key`).
- Docker installed on the server (for testing the registry login).

## Step-by-Step Guide

### 1. Update GitLab Configuration

Open the GitLab configuration file:

```bash
sudo nano /etc/gitlab/gitlab.rb
```

Add or modify the following settings:

```ruby
registry['enable'] = true
registry['registry_http_addr'] = "127.0.0.1:5500"
registry_external_url 'https://registry.sananetco.com'

registry_nginx['enable'] = true
registry_nginx['ssl_certificate'] = "/root/nexus-registry/nexus/certs/fullchain.pem"
registry_nginx['ssl_certificate_key'] = "/root/nexus-registry/nexus/certs/private.key"
```

### 2. Reconfigure and Restart GitLab

After updating the configuration, apply the changes by running:

```bash
sudo gitlab-ctl reconfigure
sudo gitlab-ctl restart
```

### 3. Configure Docker to Trust the Registry Certificate

If your server uses a self-signed certificate, Docker may need to trust the certificate:

1. Create a directory for the registry's certificates:

   ```bash
   sudo mkdir -p /etc/docker/certs.d/registry.sananetco.com
   ```

2. Copy the GitLab registry certificate to Docker’s trusted certificates directory:

   ```bash
   sudo cp /root/nexus-registry/nexus/certs/fullchain.pem /etc/docker/certs.d/registry.sananetco.com/ca.crt
   ```

3. Restart Docker:

   ```bash
   sudo systemctl restart docker
   ```

### 4. Create a GitLab User for Registry Access

1. Log into GitLab as an admin.
2. Go to **Admin Area > Users** and create a new user.
3. Log in as the new user, then go to **Settings > Access Tokens** and create a personal access token with the scopes: `api`, `read_registry`, and `write_registry`. Save the token.

### 5. Test the Container Registry

1. Log in to the Container Registry using Docker:

   ```bash
   docker login registry.sananetco.com
   ```

   - **Username**: GitLab username
   - **Password**: Personal access token created earlier

2. Tag a local Docker image for testing (replace `your_group` and `your_project` with appropriate values):

   ```bash
   docker tag hello-world registry.sananetco.com/your_group/your_project/hello-world:latest
   ```

3. Push the image to the registry:

   ```bash
   docker push registry.sananetco.com/your_group/your_project/hello-world:latest
   ```

4. Pull the image back to verify:

   ```bash
   docker pull registry.sananetco.com/your_group/your_project/hello-world:latest
   ```

If all steps are successful, your GitLab Container Registry is up and running.
