# 🛡️ DEVOPS DEPLOYMENT & INFRASTRUCTURE GUIDE

## Current Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Production Ready                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Frontend (Vite React)          Backend (Node.js/Express)      │
│  Port: 5173/3000                Port: 4000                     │
│         ↓                              ↓                        │
│  ┌──────────────┐                ┌────────────────┐            │
│  │ Dashboard    │◄──────API────►│  API Server    │            │
│  │ (Vite)       │ http://        │ (Express.js)   │            │
│  └──────────────┘                │                │            │
│                                  │  Middleware:   │            │
│                                  │  - Auth        │            │
│                                  │  - Validation  │            │
│                                  │  - Uploads     │            │
│                                  └────────┬───────┘            │
│                                           ↓                    │
│                                  ┌──────────────────┐           │
│                                  │   MongoDB       │           │
│                                  │   Cloud Atlas   │           │
│                                  └──────────────────┘           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## ☁️ HOSTING RECOMMENDATIONS

### Backend Deployment Options

| Platform         | Cost/mo   | Pros                             | Cons                  | Link                          |
| ---------------- | --------- | -------------------------------- | --------------------- | ----------------------------- |
| **Heroku**       | $7-50     | Easy deployment, Git integration | Limited free tier     | https://www.heroku.com/       |
| **Railway**      | $5-100    | Simple, modern, cheaper          | Smaller community     | https://railway.app/          |
| **Render**       | $7+       | Good free tier, auto-deploy      | Limited resources     | https://render.com/           |
| **DigitalOcean** | $5-20/mo  | Full control, droplets           | More setup needed     | https://www.digitalocean.com/ |
| **AWS EC2**      | $3.50+/mo | Scalable, reliable               | Complex setup         | https://aws.amazon.com/ec2/   |
| **Azure**        | Free-$100 | Enterprise support               | Overkill for startups | https://azure.microsoft.com/  |

**Recommendation for this project**: **Railway.app** ($5-20/mo) - simplicity + cost-effective

---

## 🐳 DOCKER CONTAINERIZATION

### Step 1: Create Dockerfile

Create `Backend/Dockerfile`:

```dockerfile
# Multi-stage build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:18-alpine
WORKDIR /app

# Install dumb-init (prevents zombie processes)
RUN apk add --no-cache dumb-init

# Copy from builder
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs

EXPOSE 4000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/home', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "index.js"]
```

### Step 2: Create .dockerignore

Create `Backend/.dockerignore`:

```
node_modules
npm-debug.log
.env
.git
.gitignore
README.md
.env.example
.DS_Store
```

### Step 3: Build and Run Docker Image

```bash
# Build
docker build -t food-services-backend:1.0 Backend/

# Run locally
docker run -p 4000:4000 \
  -e MONGO_URL="mongodb+srv://..." \
  -e WHATISYOURWORK="your_secret" \
  food-services-backend:1.0

# Or with docker-compose
docker-compose up
```

**Reference**: https://docs.docker.com/

---

## 🐳 DOCKER COMPOSE SETUP

Create `docker-compose.yml` (root directory):

```yaml
version: "3.8"

services:
  backend:
    build:
      context: ./Backend
      dockerfile: Dockerfile
    container_name: food-services-backend
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=development
      - MONGO_URL=${MONGO_URL}
      - WHATISYOURWORK=${WHATISYOURWORK}
      - PORT=4000
    volumes:
      - ./Backend:/app
      - /app/node_modules
    restart: unless-stopped
    networks:
      - food-network
    depends_on:
      - mongo

  frontend:
    build:
      context: ./dashboard
      dockerfile: Dockerfile
    container_name: food-services-dashboard
    ports:
      - "5173:5173"
    environment:
      - VITE_API_URL=http://backend:4000
    volumes:
      - ./dashboard/src:/app/src
    networks:
      - food-network
    depends_on:
      - backend

  mongo:
    image: mongo:6.0-alpine
    container_name: food-services-db
    environment:
      - MONGO_INITDB_ROOT_USERNAME=${MONGO_USER}
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_PASSWORD}
    volumes:
      - mongo-data:/data/db
    ports:
      - "27017:27017"
    networks:
      - food-network
    restart: unless-stopped

volumes:
  mongo-data:

networks:
  food-network:
    driver: bridge
```

Create `frontend/Dockerfile`:

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Reference**: https://docs.docker.com/compose/

---

## 🚀 CI/CD PIPELINE (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Build & Deploy

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      mongodb:
        image: mongo:6.0-alpine
        options: >-
          --health-cmd mongosh
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 27017:27017

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"
          cache-dependency-path: Backend/package-lock.json

      - name: Install dependencies
        working-directory: ./Backend
        run: npm ci

      - name: Run linter
        working-directory: ./Backend
        run: npm run lint || true

      - name: Check for security vulnerabilities
        working-directory: ./Backend
        run: npm audit --production || true

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'

    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Railway
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
        run: |
          npm install -g @railway/cli
          railway up --service backend

      - name: Deploy Dashboard to Vercel
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
        run: |
          npm install -g vercel
          vercel deploy --prod --token $VERCEL_TOKEN --cwd ./dashboard

      - name: Slack Notification
        if: always()
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": "Deployment Status: ${{ job.status }}",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*Food Services* - Build ${{ job.status }}\n${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}"
                  }
                }
              ]
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

**Reference**: https://docs.github.com/en/actions

---

## 📊 MONITORING & ALERTING

### Option 1: New Relic (Enterprise)

```bash
npm install newrelic
```

Add to top of `index.js`:

```javascript
require("newrelic");
// ... rest of code
```

**Dashboard**: https://one.newrelic.com/

### Option 2: Datadog (Production-Grade)

```bash
npm install dd-trace
```

**Dashboard**: https://www.datadoghq.com/

### Option 3: Sentry (Error Tracking)

```bash
npm install @sentry/node @sentry/tracing
```

```javascript
const Sentry = require("@sentry/node");
Sentry.init({ dsn: "your_sentry_dsn" });
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
```

**Dashboard**: https://sentry.io/

---

## 🔐 SECURITY HARDENING

### SSL/TLS Certificate (Let's Encrypt)

```bash
# Using Certbot
certbot certonly --standalone -d yourdomain.com

# Then configure in nginx or load balancer
```

### Environment Secrets Management

```bash
# Don't commit .env file
echo ".env" >> .gitignore

# Use Railway/Heroku secrets instead
railway variables set MONGO_URL="..."
railway variables set WHATISYOURWORK="..."
```

### API Key Protection

Add to [index.js](Backend/index.js):

```javascript
const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: "Invalid API key" });
  }
  next();
};

// Apply to sensitive routes
app.use("/admin/", apiKeyMiddleware);
```

**Reference**: [OWASP Security Guide](https://owasp.org/www-project-top-ten/)

---

## 📈 SCALING STRATEGY

### Horizontal Scaling (Multiple Instances)

```yaml
# docker-compose with 3 backend instances
services:
  backend-1:
    build: ./Backend
    ports: "4001:4000"

  backend-2:
    build: ./Backend
    ports: "4002:4000"

  backend-3:
    build: ./Backend
    ports: "4003:4000"

  nginx:
    image: nginx:alpine
    ports: "4000:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - backend-1
      - backend-2
      - backend-3
```

### Database Scaling

- Use MongoDB Atlas with auto-scaling
- Enable sharding for large datasets
- Set up replication for high availability

**Reference**: https://www.mongodb.com/docs/manual/sharding/

---

## 🧪 LOAD TESTING

```bash
npm install -g artillery

# Create artillery-load-test.yml
```

```yaml
config:
  target: "http://localhost:4000"
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 120
      arrivalRate: 50
      name: "Sustained load"

scenarios:
  - name: "Vendor workflow"
    flow:
      - post:
          url: "/vendor/register"
          json:
            username: "testvendor{{ $randomNumber(1, 10000) }}"
            email: "test{{ $randomNumber(1, 10000) }}@example.com"
            password: "Secure123"
      - post:
          url: "/vendor/login"
          json:
            email: "test@example.com"
            password: "Secure123"
      - get:
          url: "/firm/all"
```

Run test:

```bash
artillery run artillery-load-test.yml
```

**Reference**: https://artillery.io/

---

## 📋 PRE-PRODUCTION DEPLOYMENT CHECKLIST

### Infrastructure

- [ ] SSL/TLS certificate installed
- [ ] Load balancer configured
- [ ] Database backups automated
- [ ] CDN configured for static files
- [ ] DDoS protection enabled
- [ ] WAF (Web Application Firewall) enabled

### Application

- [ ] Environment variables set (no hardcoded secrets)
- [ ] Error handling in place
- [ ] Logging configured
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] API versioning implemented

### Monitoring

- [ ] Uptime monitoring active
- [ ] Error tracking enabled
- [ ] Performance metrics collected
- [ ] Alerts configured
- [ ] Log aggregation setup

### Security

- [ ] Security audit completed
- [ ] Dependency vulnerabilities scanned
- [ ] OWASP Top 10 addressed
- [ ] Penetration testing done
- [ ] Compliance verified

### Testing

- [ ] Unit tests passed
- [ ] Integration tests passed
- [ ] Load testing completed
- [ ] Smoke tests automated
- [ ] Disaster recovery tested

---

## 🚀 DEPLOYMENT COMMANDS

### Railway Deployment

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Create project
railway init

# Deploy
railway up
```

### Heroku Deployment

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create food-services-backend

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

---

## 📞 EMERGENCY CONTACTS

| Issue           | Action                             | Link                  |
| --------------- | ---------------------------------- | --------------------- |
| Outage          | Check status page, restart service | Status page URL       |
| Database down   | Failover to replica                | MongoDB Atlas console |
| API errors      | Check Sentry/logs                  | Sentry dashboard      |
| High load       | Scale horizontally                 | Deployment platform   |
| Security breach | Revoke keys, check logs            | CloudTrail/Audit logs |

---

**Prepared by**: Senior DevOps Engineer  
**Last Updated**: 2026-01-19  
**Version**: 1.0  
**Status**: READY FOR DEPLOYMENT
