### Installation

- `git clone <url> -b <branch-name>`
- `pnpm i`
- rename `env.example` to `.env` and configure application variables

---

### Development mode
- `pnpm dev`
  - app: `http://localhost:4444`
  - api: `http://localhost:7000`

### Docker
1. `docker build -f docker/development/Dockerfile -t wish-tree:latest .`
2. `docker build -f docker/development/Dockerfile.nginx -t wish-tree-ui:latest .`
3. `docker run -d -t -i -e DB_HOST='host.docker.internal' -p 7000:7000 --name wish-tree wish-tree:latest`
4. `docker run -d -t -i -p 4444:80 --link wish-tree --name wish-tree-ui wish-tree-ui:latest`
- output: `http://localhost:4444/`

### Docker compose
1. `docker-compose -f docker/development/docker-compose.yml up --build`
- output: `http://localhost:4444`
