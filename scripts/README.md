# README.md

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

## Notes

* Only `Deployment` resources are updated.
* All containers inside Deployment get the new image.
* Other resources like Service, ConfigMap, Ingress are untouched.
