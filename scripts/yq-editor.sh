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
    echo "Usage: $0 --file <file> --image <image>"
    exit 1
fi

while [ "$#" -gt 0 ]; do
    case "$1" in
        --file)
            [ -z "$2" ] && echo "--file needs value!" && exit 1
            FILE_PATH="$2"
            shift 2
            ;;
        --image)
            [ -z "$2" ] && echo "--image needs value!" && exit 1
            IMAGE="$2"
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
if [ -z "$FILE_PATH" ] || [ -z "$IMAGE" ]; then
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
echo "Updating image to $IMAGE in $FILE_PATH..."

yq -i '
  select(.kind == "Deployment")
  .spec.template.spec.containers[].image = strenv(IMAGE)
' "$FILE_PATH"

echo " Update successfully....."
