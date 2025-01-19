#!/bin/bash
# Update the package index
sudo apt-get update -y

# Install required dependencies for Docker
sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common git

# Install Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update -y
sudo apt-get install -y docker-ce docker-ce-cli containerd.io

# Start Docker and enable it to run on boot
sudo systemctl start docker
sudo systemctl enable docker

# Install Node.js and npm (using NodeSource)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone your GitHub repository
git clone https://github.com/Harmeet10000/Shiksha-Dost-Backend.git /home/ubuntu/project

# Change directory to the project folder
cd /home/ubuntu/project

# Install npm packages
sudo npm install
