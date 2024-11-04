# 使用 Node.js 官方镜像
FROM node:18

# 创建工作目录
WORKDIR /app

# 拷贝 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install -g cnpm --registry=https://registry.npmmirror.com && \
    cnpm install express body-parser simple-git vuepress

# 拷贝项目源码
COPY . .

# 暴露端口
EXPOSE 3000

# 启动 webhook.js
CMD ["node", "webhook.js"]
