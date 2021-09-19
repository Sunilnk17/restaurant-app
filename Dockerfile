FROM node:lts-alpine

WORKDIR /usr/src/app

ARG YELP_ENDPOINT
ARG YELP_API_KEY

COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "tslint.json", "tsconfig.json", "./"]
COPY ./src ./src

ENV NODE_ENV development
ENV YELP_ENDPOINT $YELP_ENDPOINT
ENV YELP_API_KEY $YELP_API_KEY

RUN npm install
RUN npm run build

RUN rm -rf ./src
RUN rm -rf ./node_modules

RUN npm install --silent

EXPOSE 3000

CMD ["npm", "start"]
