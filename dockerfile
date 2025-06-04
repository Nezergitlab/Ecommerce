FROM node:18

WORKDIR /app

# Copy only package.json and package-lock.json first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the app (if it's a frontend or buildable app)
RUN npm run build

# Expose the app port (if you're using something like Express or Next.js)
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
