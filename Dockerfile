FROM node:18

RUN sed -i 's|http://deb.debian.org/debian|https://mirrors.cloud.tencent.com/debian|g' /etc/apt/sources.list.d/debian.sources && \
    apt-get clean && \
    apt-get update && \
    apt-get install -y git openssh-client

WORKDIR /app

COPY package.json yarn.lock .yarnrc ./

RUN yarn config set registry https://registry.npmmirror.com

RUN useradd -u 1001 -ms /bin/bash appuser && chown -R appuser:appuser /app

USER appuser

COPY . .

# 暴露端口
EXPOSE 3030

# 启动 webhook.js
CMD ["node", "webhook.js"]
