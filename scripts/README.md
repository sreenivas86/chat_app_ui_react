

## Script Name

`yq-editor.sh`

This script updates the **container image** in a Kubernetes YAML file for resources with:

```yaml
kind: Deployment
```

It uses `yq` to modify the file directly.

---

## Make Script Executable

```bash
chmod +x yq-editor.sh
```

---

## How to Use

```bash
./yq-editor.sh --file <yaml-file> --image <docker-image>
```

---

## Required Arguments

| Argument  | Description                  |
| --------- | ---------------------------- |
| `--file`  | Path to Kubernetes YAML file |
| `--image` | New Docker image with tag    |

---

## Example Usage

### Example 1

```bash
./yq-editor.sh --file deployment.yaml --image nginx:1.25
```

### Example 2

```bash
./yq-editor.sh --file k8s/app.yaml --image myrepo/app:v2
```

---

## Script Name

`docker.sh`

This script automates the following Docker tasks:

* Verify Docker is installed
* Check Docker daemon is running
* Login to Docker Hub
* Build Docker image
* Push image to Docker Hub
* Logout from Docker Hub

---

## Make Script Executable

```bash
chmod +x docker.sh
```

---

## How to Use

```bash
./docker.sh \
  --username <dockerhub-username> \
  --password <dockerhub-password-or-token> \
  --image <image-name> \
  --tag <tag-name> \
  --dockerfile <dockerfile-path> \
  --context <build-context>
```

---

## Required Arguments

| Argument       | Description                        |
| -------------- | ---------------------------------- |
| `--username`   | Docker Hub username                |
| `--password`   | Docker Hub password / access token |
| `--image`      | Docker image name                  |
| `--dockerfile` | Path to Dockerfile                 |
| `--context`    | Build context directory            |

---

## Optional Arguments

| Argument | Description | Default  |
| -------- | ----------- | -------- |
| `--tag`  | Image tag   | `latest` |

---

## Example Usage

### Example 1

```bash
./docker.sh \
  --username sree471 \
  --password "your_token_here" \
  --image chatty \
  --tag v1 \
  --dockerfile ./backend/Dockerfile \
  --context ./backend
```

### Example 2

```bash
./docker.sh \
  --username myuser \
  --password "token123" \
  --image myapp \
  --dockerfile ./Dockerfile \
  --context .
```

(Uses default tag: `latest`)

---

