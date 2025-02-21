# The Docker container is built using the Dockerfile in the project directory.
 docker build -t shikshadost-backend .

# Run the Docker container for the Shiksha Dost Backend
docker run -d \
  -p 8000:8000 \
  --name shikshadost-backend-container \
  --env-file .env.sample \
  shikshadost-backend:latest

# View the logs of the Docker container
docker logs -f shikshadost-backend-container

# tag the docker image - DockerHub
docker tag shikshadost-backend harmeet10000/shikshadost-backend:latest
# for AWS ECR tag your image so you can push the image to this repository:
docker tag shikshadost-backend:latest 050752605875.dkr.ecr.ap-south-1.amazonaws.com/shikshadost-backend:latest

# push the docker image to docker hub
docker push harmeet10000/shikshadost-backend:latest
# for AWS ECR push the image to this repository:
docker push 050752605875.dkr.ecr.ap-south-1.amazonaws.com/shikshadost-backend:latest