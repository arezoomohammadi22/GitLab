
# Use an official Node.js image as a base
FROM node:14

# Set environment variables
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
ARG PORT=3000
ENV PORT $PORT

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app’s source code
COPY . .

# Expose the application port
EXPOSE $PORT

# Run the application
CMD ["npm", "start"]
