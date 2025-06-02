FROM oven/bun:1 AS base

WORKDIR /app

FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod/
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --production

# copy node modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# build app
ENV NODE_ENV=production
RUN bun run build

# copy production dependencies and source code into final image
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /app/dist .
COPY --from=prerelease /app/package.json .

# run the app
USER bun
EXPOSE 4173/tcp 4174/tcp 4175/tcp
ENTRYPOINT [ "bun", "run", "preview" ]

