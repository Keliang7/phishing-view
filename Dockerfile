FROM node:18.16.0 as build-stage
WORKDIR /app
RUN npm cache clean --force
RUN npm config set registry https://registry.npmmirror.com/

# # 这是自建的npm镜像仓库
RUN npm install vite -g
RUN npm install pnpm@8.1.0 -g
COPY . .
RUN npm i
# RUN sed -i '8312i\MockXMLHttpRequest.prototype.upload = xhr.upload;' node_modules/mockjs/dist/mock.js
RUN npm run build:pro


# production stage
FROM nginx
COPY scripts/nginx/api_proxy.conf /etc/nginx/conf.d/api_proxy.conf
COPY --from=build-stage /app/dist-pro /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
