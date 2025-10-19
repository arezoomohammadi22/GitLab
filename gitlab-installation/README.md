
# GitLab Installation on Ubuntu 20.04

This guide provides step-by-step instructions for installing GitLab on an Ubuntu 20.04 server using both the Omnibus package and Docker containers with Docker Compose.

## Prerequisites

1. **Ubuntu 20.04 Server**: Ensure you have an Ubuntu 20.04 server instance.
2. **Sufficient Resources**: Minimum recommended resources for GitLab:
   - 4GB RAM
   - 2 CPU cores
3. **Root or Sudo Access**: Ensure you have root or sudo privileges on the server.

---

## Method 1: Installing GitLab Using Omnibus Package

<details>
<summary>Click to expand Omnibus Installation Instructions</summary>

### Step 1: Update the System

Before installing GitLab, update the package index and upgrade installed packages:

```bash
sudo apt update && sudo apt upgrade -y
```

### Step 2: Install Required Dependencies

Install necessary dependencies like `curl` if it's not already installed:

```bash
sudo apt install -y curl openssh-server ca-certificates
```

### Step 3: Install Postfix (Optional)

Postfix is recommended if you want GitLab to send email notifications. During installation, select “Internet Site” and enter your server’s domain name.

```bash
sudo apt install -y postfix
```

### Step 4: Add GitLab Repository and Install GitLab

1. **Add the GitLab Repository**:
   
   ```bash
   curl -sS https://packages.gitlab.com/install/repositories/gitlab/gitlab-ce/script.deb.sh | sudo bash
   ```

2. **Install GitLab**:

   Replace `https://gitlab.example.com` with your actual domain or server IP.

   ```bash
   sudo EXTERNAL_URL="https://gitlab.example.com" apt install -y gitlab-ce
   ```

### Step 5: Configure GitLab

After installation, configure GitLab by running the following command. This will set up GitLab and generate the necessary configuration files.

```bash
sudo gitlab-ctl reconfigure
```

### Step 6: Access GitLab

Once the configuration completes, open a web browser and navigate to your GitLab instance’s URL (e.g., `https://gitlab.example.com`).

</details>

---

## Method 2: Installing GitLab Using Docker and Docker Compose

If you prefer a containerized installation of GitLab, you can use Docker with Docker Compose.

### Step 1: Install Docker and Docker Compose

If Docker and Docker Compose aren’t installed, install them by running the following commands:

```bash
sudo apt update
sudo apt install -y docker.io docker-compose
sudo systemctl enable docker
sudo systemctl start docker
```

### Step 2: Create a Docker Compose File

Create a directory for the GitLab setup and navigate to it:

```bash
mkdir gitlab-docker && cd gitlab-docker
```

Create a `docker-compose.yml` file with the following configuration:

```yaml
version: "3.8"

services:
  gitlab:
    image: gitlab/gitlab-ce:latest
    container_name: gitlab
    restart: always
    hostname: "gitlab.example.com"
    environment:
      GITLAB_OMNIBUS_CONFIG: |
        external_url 'https://gitlab.sananetco.com'
        nginx['redirect_http_to_https'] = true
        letsencrypt['enable'] = false

        # ﻢﺴﯾﺭ SSL ﺩﺎﺨﻟ ﮎﺎﻨﺘﯿﻧﺭ
        nginx['ssl_certificate'] = "/etc/gitlab/ssl/fullchain.pem"
        nginx['ssl_certificate_key'] = "/etc/gitlab/ssl/private.pem"

    ports:
      - "80:80"
      - "443:443"
      - "2222:22"
    volumes:
      - ./config:/etc/gitlab
      - ./logs:/var/log/gitlab
      - ./data:/var/opt/gitlab
```

Replace `gitlab.example.com` with your desired GitLab URL or IP.

### Step 3: Add Custom Configuration in `gitlab.rb`

If you want to customize GitLab further, add configurations in `./config/gitlab.rb`. Here’s an example `gitlab.rb` for reference:

```ruby
external_url 'http://gitlab.example.com'
gitlab_rails['gitlab_shell_ssh_port'] = 2222
nginx['listen_port'] = 80
nginx['listen_https'] = false
```

After adding custom configurations, make sure to restart GitLab with Docker Compose.

### Step 4: Start GitLab with Docker Compose

Use Docker Compose to start GitLab:

```bash
sudo docker-compose up -d
```

### Step 5: Access GitLab

Once the containers are running, open a web browser and navigate to `http://gitlab.example.com` (or your specified server IP).

### Step 6: Initial Configuration

The initial root password can be found in `./config/initial_root_password`. To view it:

```bash
cat ./config/initial_root_password
```

---

## Useful Docker Compose Commands

- **Start GitLab**: `sudo docker-compose up -d`
- **Stop GitLab**: `sudo docker-compose down`
- **View Logs**: `sudo docker-compose logs -f`

---

This guide provides both package and container installation methods for GitLab on Ubuntu 20.04. For ongoing management, ensure regular backups and configurations.
