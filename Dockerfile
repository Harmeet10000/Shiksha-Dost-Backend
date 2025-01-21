# First stage: build
FROM node:22-alpine AS build

# Set working directory
WORKDIR /build

# Copy package.json and package-lock.json and install dependencies
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the project files
COPY . .

# Build the project (assuming it generates a 'dist' folder or similar)
RUN npm run build

# Second stage: runner
FROM node:22-alpine AS runner

# Set working directory
WORKDIR /ShikshaDost-Backend

# Copy necessary files from the build stage
COPY --from=build /build/node_modules /ShikshaDost-Backend/node_modules
COPY --from=build /build/package.json /ShikshaDost-Backend/package.json
COPY --from=build /build/package-lock.json /ShikshaDost-Backend/package-lock.json
COPY --from=build /build/dist /ShikshaDost-Backend/dist
COPY --from=build /build/src /ShikshaDost-Backend/src
# Run the application
CMD ["npm", "run", "dev:prod"]



