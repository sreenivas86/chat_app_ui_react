#!/bin/bash

# exit on error
set -e

# -----------------------------
# Check yq installed or not
# -----------------------------
if ! command -v yq >/dev/null 2>&1; then
    echo "Installing yq..."
    sudo wget https://github.com/mikefarah/yq/releases/latest/download/yq_linux_amd64 -O /usr/local/bin/yq
    sudo chmod +x /usr/local/bin/yq
fi

# -----------------------------
# Read arguments
# -----------------------------
if [ "$#" -lt 2 ]; then
    echo "Usage: $0 --file <file> --uri <backend URL>"
    exit 1
fi

while [ "$#" -gt 0 ]; do
    case "$1" in
        --file)
            [ -z "$2" ] && echo "--file needs value!" && exit 1
            FILE_PATH="$2"
            shift 2
            ;;
        --uri)
            [ -z "$2" ] && echo "--uri needs value!" && exit 1
            BACKEND_URI="$2"
            shift 2
            ;;
        *)
            echo "Invalid flag: $1"
            exit 1
            ;;
    esac
done

# -----------------------------
# Validate input
# -----------------------------
if [ -z "$FILE_PATH" ] || [ -z "$BACKEND_URI" ]; then
    echo "Missing required arguments"
    exit 1
fi

if [ ! -f "$FILE_PATH" ]; then
    echo "File not found: $FILE_PATH"
    exit 1
fi

# -----------------------------
# Update Deployment image ONLY
# -----------------------------
echo "Updating BACKEND URL to $BACKEND_URI in $FILE_PATH..."

yq -i "
  select(.kind == \"ConfigMap\")
  .data.BACKEND_URI = \"$BACKEND_URI\"
" "$FILE_PATH"

echo " Update successfully....."


#command to find ip
#BACKEND_IP=$(kubectl get svc chat-app-backend-svc -n chat-app-ns -o jsonpath='{.status.loadBalancer.ingress[0].ip}') 