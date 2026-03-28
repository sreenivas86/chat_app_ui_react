#! /bin/bash

# This script automate build docker image and push into docker hub

# check docker is exist
if ! command -v docker >/dev/null 2>&1
then
    echo "Docker is not installed"
    exit 1;
fi
# check Docker deamon is running 
if ! systemctl is-active docker --quiet
then
    echo "Docker installed and Deamon is not running"
    exit 1;
fi

echo "Docker is running"

# read the arguments

#!/bin/bash

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
            [ -z "$2" ] && echo "--tag needs value" && exit 1
            DFILE="$2"
            shift 2
            ;;
        --context)
            [ -z "$2" ] && echo "--tag needs value" && exit 1
            CONTEXT="$2"
            shift 2
            ;;
        *)
            echo " Invalid flag $1"
            exit 1
            ;;
    esac 
done

# Required check
if [ -z "$USERNAME" ] || [ -z "$PASSWORD" ] || [ -z "$IMAGE" ] || [ -z "$DFile" ] || [ -z "$CONTEXT" ]; then
    echo " Missing required arguments"
    exit 1
fi

# Default tag
TAG=${TAG:-latest}

echo "Username: $USERNAME"
echo "Image: $IMAGE:$TAG"f
# add a variable for Imagename
IMAGE_NAME="$USERNAME/$IMAGE:$TAG"

# Build docker image from Dockerfile
docker build \
-t "$IMAGE_NAME" \
-f "$DFILE" \
"$CONTEXT" \
&& echo "$IMAGE_NAME has been created "

# remove existing dockerhub login
CONFIG="$HOME/.docker/config.json"
if [ -f "$CONFIG" ]; then
    if grep -q '"auths"' "$CONFIG"; then
        docker logout && removed existing credentials successfully
    fi
fi


# connect to docker hub

docker login \
-u "$USERNAME" \
--password-stdin <<< "$PASSWORD" \
&& echo " Docker hub connected successfully"

#push your image to docker hub

docker push "$IMAGE_NAME" \
&& echo "$IMAGE_NAME is successfully uploaded! "


