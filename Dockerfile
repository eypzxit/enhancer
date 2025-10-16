# Use a lightweight Node.js base image
FROM node:20-slim

# Set the working directory
WORKDIR /usr/src/app

# Copy only the package files first for optimized layer caching
COPY package.json ./

# Run npm install to get dependencies
RUN npm install --omit=dev

# Copy all remaining source code (server.js, scraper.js, index.html)
COPY . .

# Expose the application port
EXPOSE 3000

# Run the app using the start script
CMD [ "npm", "start" ]
