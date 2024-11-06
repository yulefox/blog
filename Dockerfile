FROM node:18

WORKDIR /app

COPY package.json yarn.lock .yarnrc ./

RUN yarn install

COPY . .

# 暴露端口
EXPOSE 3030

# 启动 webhook.js
CMD ["node", "webhook.js"]
