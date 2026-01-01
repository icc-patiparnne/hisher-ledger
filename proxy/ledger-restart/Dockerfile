FROM node:20-alpine

WORKDIR /app

# Install docker CLI for restart capability
RUN apk add --no-cache docker-cli docker-compose

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3002

CMD ["npm", "start"]
