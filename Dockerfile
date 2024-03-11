FROM node:21.7.0-alpine3.19 as build

WORKDIR /mariee

COPY ./ ./

RUN npm install --loglevel=error --audit=false

RUN npm run lint

RUN npm run build

FROM nginx:1.25.4-alpine3.18

WORKDIR /app

COPY --from=build /mariee/dist/mariee/browser ./

COPY --from=build /mariee/nginx.conf /etc/nginx/conf.d/default.conf

RUN rm -rf ./nginx.conf /usr/shared/nginx

ENV TZ=Asia/Shanghai

EXPOSE 80

CMD [ "nginx", "-g", "daemon off;" ]

# docker build -t mariee-web:latest .
