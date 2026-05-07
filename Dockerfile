# 1. Start with a tiny version of Node 20
FROM node:20-slim

# 2. Install ONLY Chromium and the Chromedriver (no heavy UI tools)
RUN apt-get update && apt-get install -y \
    chromium \
    chromium-driver \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# 3. Set up the working directory
WORKDIR /app

# 4. Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# 5. Copy your application code
COPY . .

# 6. Set environment variable so Selenium knows to use the Chromium binary
ENV CHROME_BIN=/usr/bin/chromium

# 7. Run the tests
CMD ["node", "testScript.js"]