# Pull the official base image
FROM node:16.13.2
# Set working directory
WORKDIR /forecast-ui

# Add `/forecast-ui/node_modules/.bin` to $PATH
ENV PATH node_modules/.bin:$PATH
ENV REACT_APP_client_ID "742716602571-9l9179dimeci47podos42edglmae8aes.apps.googleusercontent.com"

# Install app dependencies
COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

# Clone app files to image
COPY . .

RUN chown -R node /forecast-ui/node_modules
USER node

# Start app
CMD ["npm", "start"]
