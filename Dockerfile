# Stage 1: dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
# kaniko has NO BuildKit `--mount=type=secret`, so the npm credential is COPY'd
# in instead of mounted. This is safe because this is NOT the final stage —
# kaniko publishes only the last stage, so /root/.npmrc never reaches the shipped
# image — and it is deleted in the same layer that uses it.
# ⚠️ If this stage is ever made the FINAL stage, the token ships. Check before
# reordering stages.
# ⚠️ .npmrc-ci is written by the `write-npmrc` / `write-npmrc-pr` steps in
# .woodpecker/build.yml, so it always exists in CI. A local `docker build` needs
# the file present too (`touch .npmrc-ci` if you only need public packages).
COPY .npmrc-ci /root/.npmrc
RUN npm ci --prefer-offline --no-audit --progress=false \
 && rm -f /root/.npmrc

# Stage 2: builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* values must be present at build time — Next.js inlines them
# into the client bundle during `next build`. Runtime env vars in Dokploy
# have no effect on the client bundle, so we pass them as Docker build args
# here. lib/env.ts (via @t3-oss/env-nextjs + Zod) validates every value at
# module load and throws on missing/malformed input.
ARG NEXT_PUBLIC_CAPTCHA_API_URL
ARG NEXT_PUBLIC_PULSE_SCRIPT_URL
ARG NEXT_PUBLIC_PULSE_API_URL
ARG NEXT_PUBLIC_WEBSITE_API_URL
ARG NEXT_PUBLIC_CDN_URL
ENV NEXT_PUBLIC_CAPTCHA_API_URL=${NEXT_PUBLIC_CAPTCHA_API_URL}
ENV NEXT_PUBLIC_PULSE_SCRIPT_URL=${NEXT_PUBLIC_PULSE_SCRIPT_URL}
ENV NEXT_PUBLIC_PULSE_API_URL=${NEXT_PUBLIC_PULSE_API_URL}
ENV NEXT_PUBLIC_WEBSITE_API_URL=${NEXT_PUBLIC_WEBSITE_API_URL}
ENV NEXT_PUBLIC_CDN_URL=${NEXT_PUBLIC_CDN_URL}
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# prebuild runs scripts/generate-learn-articles.ts + generate-blog-posts.ts via tsx,
# then next build
# 🔴 CAP V8's HEAP. Added 27-07-2026 alongside the 3Gi step ceiling.
#
# V8 sizes its old-space from TOTAL MACHINE MEMORY, not from the container's cgroup
# limit, so on standard.large (8 GiB) workers an UNCAPPED build self-selects roughly
# 4 GiB of old space and grows to fill whatever node it lands on. Bigger nodes make
# this flag MORE necessary, not less — that is the counter-intuitive part.
#
# ⚠️ CAPS OLD SPACE ONLY. RSS = old space + new space + code + native allocations,
# plus kaniko in the same pod, so RSS lands well above this number. Measured on the
# sibling pulse-frontend build: heap 1280 -> RSS 2229 MiB, and +384 MB of heap cost
# +647 MB of RSS (~1.7x, not 1.0x) — budget increases accordingly.
#
# ⚠️ COUPLED to the 3Gi ceiling in .woodpecker/build.yml and push.yml.
ENV NODE_OPTIONS=--max-old-space-size=1280

RUN npm run build

# Stage 3: runtime
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

ARG NEXT_PUBLIC_CDN_URL
ENV NEXT_PUBLIC_CDN_URL=${NEXT_PUBLIC_CDN_URL}

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy the Next.js standalone output
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
