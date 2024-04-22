FROM node:18.16.0 as build-stage
WORKDIR /app
# # 这是淘宝镜像仓库
RUN npm cache clean --force
RUN npm config set registry https://registry.npmmirror.com/
# RUN npm config set registry http://registry.npm.taobao.org/

# # 这是自建的npm镜像仓库
# # RUN npm config set registry http://172.16.20.30:4873
RUN npm install vite -g
RUN npm install pnpm@8.1.0 -g
COPY . .
RUN npm install
RUN sed -i '8312i\MockXMLHttpRequest.prototype.upload = xhr.upload;' node_modules/mockjs/dist/mock.js
RUN npm run build:pro


# production stage
FROM nginx
COPY scripts/nginx/api_proxy.conf /etc/nginx/conf.d/api_proxy.conf
COPY --from=build-stage /app/dist-pro /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
