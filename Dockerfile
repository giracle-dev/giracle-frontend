FROM oven/bun AS builder

WORKDIR /app

COPY . .
COPY package.json .
COPY bun.lockb .
COPY vite.config.ts .

RUN bun i

CMD ["bun", "run", "dev", "--host"]

EXPOSE 5173