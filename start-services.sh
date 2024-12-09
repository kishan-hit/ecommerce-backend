#!/bin/bash

echo "Starting RabbitMQ and Redis via Docker..."
docker-compose up -d || { echo "Failed to start RabbitMQ/Redis"; exit 1; }

echo "Starting Authentication Service..."
npm run auth-service > auth-service.log 2>&1 &
echo "Authentication Service logs: auth-service.log"
tail -f auth-service.log &
sleep 5  

echo "Starting Category Service..."
npm run category-service > category-service.log 2>&1 &
echo "Category Service logs: category-service.log"
tail -f category-service.log &
sleep 5

wait
