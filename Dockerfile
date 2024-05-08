# Use an official Node.js runtime as a base image
FROM node:18

# Set the working directory to the project root
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all application files to the working directory
COPY . .

# Build the TypeScript project if necessary (uncomment if using a build process)
# RUN npm run build

# Expose the application port
EXPOSE 3000

# Start the application (change to "start" if using `npm run build`)
CMD ["npm", "run", "dev"]


