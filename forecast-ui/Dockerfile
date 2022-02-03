# Pull the official base image
FROM node:16.13.2
# Set working directory
WORKDIR /forecast-ui

# Add `/forecast-ui/node_modules/.bin` to $PATH
ENV PATH node_modules/.bin:$PATH

# Install app dependencies
COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

# Clone app files to image
COPY . .

# Start app
CMD ["npm", "start"]