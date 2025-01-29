
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

# tag the docker image
docker tag shiksha-dost-backend harmeet10000/shiksha-dost-backend:latest

# push the docker image to docker hub
docker push harmeet10000/shiksha-dost-backend:latest
