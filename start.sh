#!/bin/bash

echo "Starting the application..."
killall node
npx kill-port 4400 4500 4000 8080 8085
(cd ceilibandadder && npm start &) &
(cd SeniorCeiliBand && npm start &) &
wait
echo "Both servers are running..."

open "http://localhost:3000/" && open "http://localhost:3001"