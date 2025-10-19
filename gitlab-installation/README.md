# 🦩 Installing GitLab CE using Docker Compose (with HTTPS Support)

This guide walks you through installing **GitLab Community Edition (CE)** using **Docker Compose**, including SSL configuration for secure HTTPS access.

---

## 🧱 Directory Structure

```
gitlab/
├── docker-compose.yml
├── config/
├── logs/
└── data/
```

---

## ⚙️ 1. Prerequisites

Before you begin, ensure you have:

- 🐳 Docker & Docker Compose installed
- 🧾 A valid **domain name** (e.g., `gitlab.sananetco.com`)
- 🔒 Valid SSL certificates (`fullchain.pem` and `private.pem`)
  - These should be placed in `./config/ssl/`
- ✅ Ports `80`, `443`, and `2222` open on your firewall

---

## 🐳 2. Create the Docker Compose File

Create a file named **`docker-compose.yml`** with the following content:

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

        # Path to SSL certificates inside the container
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

---

## 🔑 3. Prepare SSL Certificates

Place your SSL files here:

```
config/ssl/fullchain.pem
config/ssl/private.pem
```

Make sure the permissions are correct:

```bash
sudo chmod 600 config/ssl/private.pem
sudo chmod 644 config/ssl/fullchain.pem
```

---

## 🚀 4. Start GitLab

Start the GitLab service:

```bash
docker compose up -d
```

Check logs:

```bash
docker logs -f gitlab
```

The first startup may take **5–10 minutes**.

---

## 🌐 5. Access GitLab

Once the container is up, open your browser:

```
https://gitlab.sananetco.com
```

On the first login, GitLab will ask you to set a **root password**.

---

## 🧩 6. Backup & Data Directories

- `/etc/gitlab` → Configuration files  
- `/var/log/gitlab` → Logs  
- `/var/opt/gitlab` → Data (repositories, uploads, etc.)

To back up all data:

```bash
docker exec -t gitlab gitlab-backup create
```

---

## 🔄 7. Updating GitLab

To update to the latest GitLab CE version:

```bash
docker compose pull
docker compose down
docker compose up -d
```

GitLab will handle database migrations automatically.

---

## ⚙️ 8. Troubleshooting

### 🧱 GitLab not reachable on HTTPS
- Check that your DNS points to the server IP.
- Ensure ports 80 and 443 are not blocked by firewall.

### 🔒 SSL certificate not found
- Verify file paths inside container:
  ```bash
  docker exec -it gitlab ls /etc/gitlab/ssl/
  ```

### 🕒 Slow startup
- First initialization takes time; GitLab configures all internal services (PostgreSQL, Redis, etc.)

---

## 🧰 9. Useful Commands

| Command | Description |
|----------|-------------|
| `docker compose up -d` | Start GitLab |
| `docker compose down` | Stop GitLab |
| `docker logs -f gitlab` | View logs |
| `docker exec -it gitlab bash` | Access container shell |
| `docker compose restart` | Restart GitLab |

---

## 👨‍💻 Maintainer
© 2025 – Sananetco DevOps Infrastructure
