# 🏃 Installing and Configuring GitLab Runner with Docker Compose (with Prometheus Metrics)

This guide walks you through installing **GitLab Runner** using **Docker Compose**, registering it with your self-hosted GitLab instance, and enabling Prometheus metrics for monitoring.

---

## 🧱 Directory Structure

```
gitlab-runner/
├── docker-compose.yml
├── config/
└── README.md
```

---

## ⚙️ 1. Prerequisites

Before you begin, ensure you have:

- 🐳 Docker & Docker Compose installed
- 🧾 A running GitLab instance (e.g., `https://gitlab.sananetco.com`)
- 🔑 A valid **Runner registration token**
  - You can find it in your GitLab UI:
    - Navigate to **Admin Area → CI/CD → Runners → Registration token**

---

## 🐳 2. Docker Compose Configuration

Create a file named **`docker-compose.yml`** with the following content:

```yaml
version: '3.8'

services:
  gitlab-runner:
    image: gitlab/gitlab-runner:latest
    container_name: gitlab-runner
    restart: always
    environment:
      - TZ=Asia/Tehran
    volumes:
      - ./config:/etc/gitlab-runner
      - /var/run/docker.sock:/var/run/docker.sock
    ports:
      # Expose Prometheus metrics endpoint
      - "9252:9252"
    command: >
      run
      --user=gitlab-runner
      --working-directory=/home/gitlab-runner
      --listen-address=:9252
```

---

## 🚀 3. Start the Runner

Start the container using:

```bash
docker compose up -d
```

Check that it’s running:

```bash
docker ps
```

---

## 🔐 4. Register the Runner

Use the following command to register your runner with GitLab:

```bash
docker exec -it gitlab-runner gitlab-runner register   --non-interactive   --url https://gitlab.sananetco.com/   --registration-token "zHitp6X7e7N23Czbzzmn"   --executor docker   --description "docker-runner"   --docker-image "alpine:latest"   --tag-list "docker,linux"   --run-untagged="true"   --locked="false"
```

---

## ✅ 5. Verify Registration

Check in your GitLab UI:  
Go to **Admin → CI/CD → Runners** and confirm your runner appears as **active** with tags `docker, linux`.

Alternatively, verify from inside the container:

```bash
docker exec -it gitlab-runner gitlab-runner list
```

---

## 📊 6. Enable and Verify Metrics

The runner exposes Prometheus metrics at port `9252`.  
Verify by visiting:

```
http://<runner-host>:9252/metrics
```

You should see metrics such as:

```
gitlab_runner_jobs_total
gitlab_runner_builds
gitlab_runner_job_duration_seconds
gitlab_runner_errors_total
```

---

## 📈 7. Add Runner Metrics to Prometheus

In your **Prometheus configuration (`prometheus.yml`)**, add:

```yaml
scrape_configs:
  - job_name: 'gitlab-runner'
    static_configs:
      - targets: ['gitlab-runner:9252']
```

Restart Prometheus:

```bash
docker restart prometheus
```

---

## 🎨 8. Visualize in Grafana

To visualize runner metrics, import this dashboard from Grafana:

- Dashboard Name: **GitLab Runner**
- Grafana ID: **9631**
- Link: [https://grafana.com/grafana/dashboards/9631-gitlab-runner/](https://grafana.com/grafana/dashboards/9631-gitlab-runner/)

Go to Grafana → **+ → Import**, enter ID **9631**, select your Prometheus datasource, and click **Import**.

---

## 🧰 9. Useful Commands

| Command | Description |
|----------|-------------|
| `docker compose up -d` | Start the GitLab Runner |
| `docker compose down` | Stop and remove the runner |
| `docker logs -f gitlab-runner` | Follow runner logs |
| `docker exec -it gitlab-runner bash` | Access container shell |
| `docker exec -it gitlab-runner gitlab-runner list` | List registered runners |
| `docker exec -it gitlab-runner gitlab-runner verify` | Verify runner connectivity |

---

## 🧠 10. Troubleshooting

### ⚠️ Runner not visible in GitLab
- Check your registration token and GitLab URL.
- Ensure the runner container can reach GitLab (`ping gitlab.sananetco.com`).

### ⚠️ Jobs stuck in pending
- Verify tags in `.gitlab-ci.yml` match runner tags (`docker`, `linux`).
- Confirm the runner is active in **GitLab → Admin → CI/CD → Runners**.

### ⚠️ Metrics not loading
- Ensure port `9252` is exposed and not blocked by firewall.

---

## 👨‍💻 Maintainer

Part of the **Prometheus Monitoring Repository**  
© 2025 – Sananetco DevOps Infrastructure
