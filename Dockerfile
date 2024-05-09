# Use an official Node.js runtime as a base image
FROM node:18

# Set the working directory to the ACG directory
WORKDIR /usr/src/app/ACG

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --no-audit

# Copy all application files to the working directory
COPY . .

# Build the Vite app
RUN npm run build

# Expose the port for the server
EXPOSE 3000

# Start the server
CMD ["npm", "run", "serve"]








