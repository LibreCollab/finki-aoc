FROM node:20-slim AS build
WORKDIR /app
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci
COPY . .
RUN node ace build

FROM node:20-slim AS production

RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

RUN addgroup --system --gid 1001 app \
    && adduser --system --uid 1001 --ingroup app app

ENV NODE_ENV=production
ENV PORT=3333
ENV HOST=0.0.0.0

COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev

COPY --from=build /app/build ./build
COPY start.sh ./start.sh

RUN mkdir -p /app/tmp \
    && sed -i 's/\r$//' ./start.sh \
    && chmod +x ./start.sh \
    && chown -R app:app /app

USER app

EXPOSE 3333
CMD ["sh", "./start.sh"]
