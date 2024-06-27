#!/bin/bash

# echo "Installing Node.js and npm if they are not installed..."
# which node || curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash - && sudo apt-get install -y nodejs

echo "Installing backend dependencies..."
cd ceilibandadder
npm install

echo "Installing frontend dependecies"
cd ../SeniorCeiliBand
npm install

cd ..