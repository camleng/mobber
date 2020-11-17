FROM node AS build
WORKDIR /app
COPY package.json .
RUN yarn install
COPY . .
RUN yarn build

FROM node:slim
WORKDIR /app
COPY --from=build /app/package.json .
COPY --from=build /app/build prod
COPY --from=build /app/server.js .
COPY --from=build /app/server server
COPY --from=build /app/node_modules node_modules
#COPY --from=build /app/.env .
#COPY --from=build /app/certs certs

CMD NODE_ENV=production bash -c "node server.js"

