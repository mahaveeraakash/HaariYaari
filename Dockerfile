FROM selenium/standalone-chrome:latest

WORKDIR /app

# Only copy package files first
COPY package*.json ./

# Install dependencies inside the container
RUN npm install

# Copy the rest of the code (ignoring what's in .dockerignore)
COPY . .

CMD ["node", "testScript.js"]