# Use an official Node.js runtime as a base image
FROM node:18

# Set the working directory to the project root
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies with verbose logging
RUN npm install --legacy-peer-deps --no-audit --verbose

# Copy all application files to the working directory
COPY . .

# Build the TypeScript project (uncomment if using a build process)
# RUN npm run build

# Expose the application port (adjust according to your Vite config)
EXPOSE 5173

# Start the application using Vite preview
CMD ["npm", "run", "preview"]


