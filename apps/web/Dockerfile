# use the official Node.js image
# see all versions at https://hub.docker.com//_/node/tags
FROM node:24.13.1-bookworm AS base
WORKDIR /usr/src/app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY pnpm-workspace.yaml /temp/dev/
COPY package*json yarn.lock* package-lock.json* pnpm-lock.yaml* /temp/dev/
COPY ./apps/web/package*json /temp/dev/apps/web/
RUN cd /temp/dev && pnpm install --frozen-lockfile

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY pnpm-workspace.yaml /temp/prod/
COPY package*json yarn.lock* package-lock.json* pnpm-lock.yaml* /temp/prod/
COPY ./apps/web/package*json /temp/prod/apps/web/
ENV NODE_ENV=production
RUN cd /temp/prod && pnpm install --frozen-lockfile --prod

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY --from=install /temp/dev/apps/web/node_modules apps/web/node_modules
COPY . .

ENV NODE_ENV=production
RUN pnpm --filter "./apps/web" run build
RUN pwd
RUN ls -a

# copy production dependencies and source code into final image
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/apps/web/.output apps/web/.output
COPY --from=prerelease /usr/src/app/apps/web/package.json apps/web/package.json

# run the app
USER node
ARG PORT=3000
EXPOSE $PORT/tcp

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${PORT} || exit 1

ENTRYPOINT [ "node", "apps/web/.output/server/index.mjs" ]