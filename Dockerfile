# FROM nginx
# RUN rm /etc/nginx/conf.d/default.conf
# COPY nginx/default.conf /etc/nginx/conf.d/default.conf
# COPY dist/ /usr/share/nginx/html/
# RUN rm /etc/nginx/conf.d/default.conf 删除目录下的default.conf文件

#===================================

FROM node:latest as builder 
WORKDIR /app
COPY package.json .
RUN npm config set registry https://registry.npmmirror.com/
RUN npm install
COPY . .
RUN npm run build

FROM nginx:latest
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist  /usr/share/nginx/html
#从之前命名为 builder 的阶段中复制 /app/dist 目录下的文件到最终镜像中的 Nginx 默认 HTML 目录中，用于提供静态文件服务。

CMD ["nginx", "-g", "daemon off;"]