# Kubernetes Manifests

This folder contains Kubernetes YAML files used to deploy the chat application.

## Files

| File Name                 | Description                             |
| ------------------------- | --------------------------------------- |
| `Namespace.yml`           | Creates Kubernetes namespace            |
| `Secrets.yml`             | Stores sensitive values like JWT secret |
| `ConfigMaps.yml`          | Stores application configuration values |
| `StorageClass.yml`        | Defines storage class                   |
| `PersistVolumeClaim.yml`  | Requests persistent storage             |
| `Backend-Deployment.yml`  | Deploys backend application             |
| `Backend-Service.yml`     | Exposes backend service                 |
| `Frontend-deployment.yml` | Deploys frontend application            |
| `Frontend-Service.yml`    | Exposes frontend service                |

---

## Before Deployment (Update Required Values)

### 1. Update Secret Value

Edit `Secrets.yml` and change:

```yaml
stringData:
  JWT_SECRET: your_secure_secret_key
```

### 2. Update ConfigMap Values (if needed)

Edit `ConfigMaps.yml`:

```yaml
data:
  PORT: "5000"
  MONGO_URI: "mongodb://mongo-service:27017/chat_app"
  BACKEND_URI: "http://chat-app-backend-svc:5000"
```

Update these values based on your environment.

---

## Deploy All Manifests

```bash
kubectl apply -f .
```

---

## Apply Step by Step

```bash
kubectl apply -f Namespace.yml
kubectl apply -f Secrets.yml
kubectl apply -f ConfigMaps.yml
kubectl apply -f StorageClass.yml
kubectl apply -f PersistVolumeClaim.yml
kubectl apply -f Backend-Deployment.yml
kubectl apply -f Backend-Service.yml
kubectl apply -f Frontend-deployment.yml
kubectl apply -f Frontend-Service.yml
```

---

## Verify Deployment

```bash
kubectl get all -n chat-app-ns
```

---

## Notes

* Always change `JWT_SECRET` before production deployment.
* Verify `MONGO_URI` matches your MongoDB service name.
* Apply `Namespace.yml` first if deploying manually.
* Use `kubectl apply -f .` after updating values.
