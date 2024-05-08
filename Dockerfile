# Use an official Node.js runtime as a base image
FROM node:18

# Set the working directory to the ACG directory
WORKDIR /usr/src/app/ACG

# Copy package.json and package-lock.json to the working directory
COPY ACG/package.json ACG/package-lock.json ./

# Install dependencies
RUN npm install --no-audit

# Copy all application files to the working directory
COPY ACG ./

# Expose the application port (adjust according to your Vite config)
EXPOSE 5173

# Start the application using Vite preview
CMD ["npm", "run", "preview"]





