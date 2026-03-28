# Use Node.js 22 (lightweight)
FROM node:22-alpine

# Create app directory
WORKDIR /app
# create uploads/chat inside /app directory for binary data 
RUN mkdir -p uploads/chat

# Copy package files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install 

# Copy remaining app files
COPY . .

# Set default environment variables
ENV PORT=5000

# Expose port (documentation purpose)
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
