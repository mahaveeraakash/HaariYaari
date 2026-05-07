
FROM selenium/standalone-chrome:latest

# Set the working directory inside the container
WORKDIR /app

# Copy package files first to leverage Docker caching
COPY package*.json ./

# Install project dependencies (including selenium-webdriver)
RUN npm install

# Copy the rest of your application code
COPY . .

# Set environment variables for Headless Chrome execution in the container
ENV CHROME_BIN=/usr/bin/google-chrome
ENV NODE_ENV=production

# The default command runs your 15 automated tests
CMD ["node", "testScript.js"]