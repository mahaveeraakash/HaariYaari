FROM node:18-slim

# Install necessary utilities and dependencies
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    apt-transport-https \
    curl \
    unzip \
    --no-install-recommends

# Add Google Chrome's official GPG key and repository, then install Chrome
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/googlechrome-linux-keyring.gpg && \
    sh -c 'echo "deb [arch=amd64 signed-by=/usr/share/keyrings/googlechrome-linux-keyring.gpg] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
    apt-get update && \
    apt-get install -y google-chrome-stable \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Note: Modern Selenium WebDriver (v4.6.0+) uses "Selenium Manager" which automatically
# detects the installed Chrome version and downloads the perfectly matching ChromeDriver.
# However, if an older version of Selenium is used, you can uncomment the following block
# to manually install the compatible ChromeDriver using the latest testing endpoints:
# 
# RUN npx @puppeteer/browsers install chromedriver@latest --path /usr/local/bin

# Set environment variables for Headless Chrome execution
ENV CHROME_BIN=/usr/bin/google-chrome \
    DISPLAY=:99 \
    NODE_ENV=production

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker layer caching
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Set the default command to execute the testing script
CMD ["node", "testScript.js"]
