#!/bin/bash
# Create shared network for containers
docker network create workout-app-network 2>/dev/null || echo "Network already exists"
