# Use an official Node.js runtime as a base image
FROM node:18

# Set the working directory
WORKDIR /ACG/src/Arena

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source code
COPY . .

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev"]
