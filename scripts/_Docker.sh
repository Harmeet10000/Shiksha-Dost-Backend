# Description: This script is used to build and run the Docker container for the Shiksha Dost Backend.

# The Docker container is built using the Dockerfile in the project directory.
 docker build -t shiksha-dost-backend .

# Run the Docker container for the Shiksha Dost Backend
docker run -d \
  -p 8000:8000 \
  --name shiksha-dost-backend-container \
  --env-file .env.sample \
  shiksha-dost-backend

# View the logs of the Docker container
 docker logs -f shiksha-dost-backend-container