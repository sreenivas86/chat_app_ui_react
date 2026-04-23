# Backend Docker Build and Run Guide

## Build Docker Image

Run this command in the folder containing your `Dockerfile`:

```bash
docker build -t my-backend-app .
```

---

## Run Docker Container

```bash
docker run -d \
-p 5000:5000 \
-e JWT_SECRET=sresranivvanasi \
-e MONGO_URI=mongodb://sree:sree@localhost:27017/chat_app?authSource=admin \
-e PORT=5000 \
--name my-backend-container \
my-backend-app
```

---

## Access Backend

```text
http://localhost:5000
```
