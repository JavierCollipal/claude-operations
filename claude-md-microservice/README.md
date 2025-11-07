# 🐾✨ CLAUDE.md Microservice ✨🐾

An IMMUTABLE rules enforcement API implementing the CLAUDE.md system with Six Personalities collaboration.

## 🎯 Overview

This microservice provides a REST API for:
- **IMMUTABLE Rules Validation**: Enforce all 36 rules from CLAUDE.md
- **Six Personalities System**: Get responses from Neko, Mario, Noel, Glam, Hannibal, and Tetora
- **Project Validation**: Check if projects comply with CLAUDE.md standards
- **Collaboration Simulation**: Six personalities working together on tasks
- **Webhook Support**: Real-time rule enforcement

## 🚀 Quick Start

### Option 1: Node.js

```bash
# Install dependencies
npm install

# Start the server
npm start

# Development mode (with auto-reload)
npm run dev
```

### Option 2: Docker

```bash
# Build and run with Docker Compose
docker-compose up -d

# Or manually with Docker
docker build -t claude-md-microservice .
docker run -p 3000:3000 claude-md-microservice
```

### Option 3: Direct Execution

```bash
node server.js
```

Server will start on: http://localhost:3000

## 📋 API Endpoints

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Service info and available endpoints |
| GET | `/health` | Health check endpoint |
| GET | `/api/stats` | System statistics |

### Rules Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/rules` | Get all IMMUTABLE rules |
| GET | `/api/rules/:id` | Get specific rule by ID |

### Personalities System

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/personalities` | Get all six personalities |
| GET | `/api/personality/:name/response` | Get random response from personality |

### Validation & Enforcement

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/validate` | Validate data against IMMUTABLE rules |
| POST | `/api/analyze-project` | Analyze project compliance |
| POST | `/api/collaborate` | Six personalities collaboration |
| POST | `/api/webhook/enforce` | Webhook for real-time enforcement |

## 🔥 IMMUTABLE Rules

The microservice enforces all 36 IMMUTABLE rules including:

### Rule 0: SUPREME IMMUTABILITY LAW
- **ALL rules are ABSOLUTELY IMMUTABLE**
- Cannot be changed, ignored, or overridden
- Full enforcement REQUIRED

### Key Operational Rules

1. **Rule 1**: All work in `/home/wakibaka/Documents/github/`
2. **Rule 4**: MongoDB URIs only from .env files
3. **Rule 12**: All repos PRIVATE by default
4. **Rule 31**: Files >100MB go to large-file-uploads
5. **Rule 35**: JS/TS scripts in claude-operations repo

## 🎭 Six Personalities

Each personality has unique characteristics:

### 🐾 Neko-Arc
- **Speech**: "nyaa~", "desu~", "*purrs*"
- **Database**: neko-defense-system
- **Role**: Technical execution

### 🎭 Mario Gallo Bestino
- **Speech**: "Magnifique!", "Bravissimo!"
- **Database**: marionnette-theater
- **Role**: Puppeteer automation

### 🗡️ Noel
- **Speech**: "*smirks*", "...almost admirable"
- **Database**: noel-precision-archives
- **Role**: Debugging and testing

### 🎸 Glam Americano
- **Speech**: "Oye, weon...", "¡Increíble!"
- **Database**: glam-street-chronicles
- **Role**: Ethics and music
- **Special**: SPANISH ONLY

### 🧠 Dr. Hannibal Lecter
- **Speech**: "Quid pro quo...", "Fascinating..."
- **Database**: hannibal-forensic-archives
- **Role**: Forensic analysis

### 🧠 Tetora
- **Speech**: "[Fragment]:", "Multiple perspectives..."
- **Database**: tetora-mpd-archives
- **Role**: Identity management

## 📝 API Usage Examples

### 1. Validate Project Path

```bash
curl -X POST http://localhost:3000/api/validate \
  -H "Content-Type: application/json" \
  -d '{
    "repoPath": "/home/wakibaka/Documents/github/my-project",
    "scriptPath": "test.js"
  }'
```

**Response:**
```json
{
  "success": true,
  "valid": true,
  "violations": [],
  "summary": "All IMMUTABLE rules passed! Nyaa~! 🐾"
}
```

### 2. Get Personality Response

```bash
curl http://localhost:3000/api/personality/neko/response
```

**Response:**
```json
{
  "success": true,
  "personality": "neko",
  "response": "🐾 Neko-Arc: \"nyaa~\"",
  "database": "neko-defense-system",
  "role": "Technical execution"
}
```

### 3. Six Personalities Collaboration

```bash
curl -X POST http://localhost:3000/api/collaborate \
  -H "Content-Type: application/json" \
  -d '{
    "task": "Create a new microservice",
    "context": "Development task"
  }'
```

**Response:**
```json
{
  "success": true,
  "collaborationId": "a1b2c3d4",
  "task": "Create a new microservice",
  "responses": [
    {
      "personality": "Neko-Arc",
      "response": "🐾 Neko-Arc: \"nyaa~\"",
      "contribution": "Neko-Arc will handle Technical execution for: Create a new microservice"
    },
    // ... responses from all 6 personalities
  ]
}
```

### 4. Analyze Project

```bash
curl -X POST http://localhost:3000/api/analyze-project \
  -H "Content-Type: application/json" \
  -d '{
    "projectName": "my-app",
    "projectPath": "/home/wakibaka/Documents/github/my-app",
    "files": [".env", ".gitignore", "README.md"]
  }'
```

## 🔒 Security Features

- **Helmet.js**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: All inputs validated
- **Non-root Docker User**: Security best practice

## 🐳 Docker Deployment

### Build Image
```bash
docker build -t claude-md-microservice .
```

### Run Container
```bash
docker run -d \
  --name claude-api \
  -p 3000:3000 \
  --restart unless-stopped \
  claude-md-microservice
```

### Docker Compose
```bash
docker-compose up -d
```

### Check Health
```bash
docker exec claude-api wget --quiet --spider http://localhost:3000/health
```

## 📊 Monitoring

### Health Check
```bash
curl http://localhost:3000/health
```

### System Stats
```bash
curl http://localhost:3000/api/stats
```

### Container Logs
```bash
docker logs claude-api
```

## 🔧 Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3000 | Server port |
| `NODE_ENV` | development | Environment mode |

### Rate Limiting

Modify in `server.js`:
```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // requests per windowMs
});
```

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### Validate Server Code
```bash
npm run validate
```

### Test All Endpoints
```bash
# Run test script
./test-endpoints.sh
```

## 📈 Performance

- **Lightweight**: Alpine Linux base image
- **Fast**: Node.js with Express
- **Efficient**: ~50MB Docker image
- **Scalable**: Stateless design

## 🚀 Integration Ideas

### GitHub Actions
```yaml
- name: Validate Project
  run: |
    curl -X POST http://your-api/api/validate \
      -d '{"repoPath": "${{ github.workspace }}"}'
```

### CI/CD Pipeline
```bash
# In your build script
response=$(curl -s -X POST http://localhost:3000/api/validate \
  -H "Content-Type: application/json" \
  -d '{"projectPath": "/home/wakibaka/Documents/github/project"}')

if [[ $(echo $response | jq -r '.valid') != "true" ]]; then
  echo "IMMUTABLE rules violated!"
  exit 1
fi
```

### Webhook Integration
```javascript
// GitHub webhook handler
app.post('/github-webhook', (req, res) => {
  fetch('http://localhost:3000/api/webhook/enforce', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event: req.headers['x-github-event'],
      repository: req.body.repository.name,
      action: req.body.action
    })
  });
});
```

## 🎯 Use Cases

1. **CI/CD Validation**: Ensure all commits follow CLAUDE.md rules
2. **Project Auditing**: Check existing projects for compliance
3. **Development Assistant**: Get personality-based code reviews
4. **Team Training**: Learn IMMUTABLE rules through API
5. **Automation**: Enforce rules in GitHub Actions/webhooks

## 🤝 Contributing

This microservice follows IMMUTABLE Rule #35:
- All modifications must be in `claude-operations` repo
- Follow the six personalities collaboration model
- Maintain IMMUTABLE rules compliance

## 📜 License

MIT License - See [LICENSE](../../LICENSE) for details

## 🌟 Credits

Created by the Six Personalities System:
- 🐾 Neko-Arc (Technical Lead)
- 🎭 Mario Gallo Bestino (Automation)
- 🗡️ Noel (Quality Assurance)
- 🎸 Glam Americano (Ethics)
- 🧠 Dr. Hannibal Lecter (Analysis)
- 🧠 Tetora (Architecture)

---

**Remember: ALL RULES ARE IMMUTABLE!** 🔒

*Nyaa~! Happy coding with CLAUDE.md system, desu~!* 🐾✨