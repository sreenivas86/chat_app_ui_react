#!/bin/bash

# This script automates build docker image and push into docker hub

# check docker is exist
if ! command -v docker >/dev/null 2>&1
then
    echo "Docker is not installed"
    exit 1;
fi

# check Docker daemon is running 
if ! systemctl is-active docker --quiet
then
    echo "Docker installed but Daemon is not running"
    exit 1;
fi

echo "Docker is running"

# read the arguments
while [ "$#" -gt 0 ]
do
    case "$1" in 
        --username)
            [ -z "$2" ] && echo " --username needs value" && exit 1
            USERNAME="$2"
            shift 2
            ;;
        --password)
            [ -z "$2" ] && echo " --password needs value" && exit 1
            PASSWORD="$2"
            shift 2
            ;;
        --image)
            [ -z "$2" ] && echo "--image needs value" && exit 1
            IMAGE="$2"
            shift 2
            ;;
        --tag)
            [ -z "$2" ] && echo "--tag needs value" && exit 1
            TAG="$2"
            shift 2
            ;;
        --dockerfile)
            [ -z "$2" ] && echo "--dockerfile needs value" && exit 1
            DFILE="$2"
            shift 2
            ;;
        --context)
            [ -z "$2" ] && echo "--context needs value" && exit 1
            CONTEXT="$2"
            shift 2
            ;;
        *)
            echo "Invalid flag $1"
            exit 1
            ;;
    esac 
done

# Required check - FIXED variable name
if [ -z "$USERNAME" ] || [ -z "$PASSWORD" ] || [ -z "$IMAGE" ] || [ -z "$DFILE" ] || [ -z "$CONTEXT" ]; then
    echo "Missing required arguments"
    echo "Required: --username, --password, --image, --dockerfile, --context"
    exit 1
fi

# Default tag
TAG=${TAG:-latest}

echo "Username: $USERNAME"
echo "Image: $IMAGE:$TAG"  # Removed the 'f' at the end

# add a variable for Imagename
IMAGE_NAME="$USERNAME/$IMAGE:$TAG"



# remove existing dockerhub login
CONFIG="$HOME/.docker/config.json"
if [ -f "$CONFIG" ]; then
    if grep -q '"auths"' "$CONFIG"; then
        docker logout && echo "Removed existing credentials successfully"
    fi
fi

# connect to docker hub
echo "Logging into Docker Hub..."
docker login -u "$USERNAME" --password-stdin <<< "$PASSWORD"

if [ $? -eq 0 ]; then
    echo "Docker hub connected successfully"
else
    echo "Docker login failed"
    exit 1
fi


# Build docker image from Dockerfile
echo "Building Docker image..."
docker build \
    -t "$IMAGE_NAME" \
    -f "$DFILE" \
    "$CONTEXT"
    
if [ $? -eq 0 ]; then
    echo "$IMAGE_NAME has been created successfully"
else
    echo "Docker build failed"
    exit 1
fi

# push your image to docker hub
echo "Pushing image to Docker Hub..."
docker push "$IMAGE_NAME"

if [ $? -eq 0 ]; then
    echo "$IMAGE_NAME is successfully uploaded!"
else
    echo "Docker push failed"
    exit 1
fi

# Disconnect Docker-hub
docker logout && echo "Docker hub disconnected successfully"
