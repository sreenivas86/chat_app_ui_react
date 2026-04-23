# Docker Build and Run Guide

## Build Docker Image

Run this command in the folder containing your `Dockerfile`:

```bash
docker build -t my-vite-app .
```

---

## Run Docker Container

```bash
docker run -d \
-p 8080:80 \
-e VITE_API_URL=http://localhost:5000 \
--name my-vite-container \
my-vite-app
```

---

## Access Application

Open in browser:

```text
http://localhost:8080
```
