# Ticket-Api

First, install package:

```bash
pnpm install
# or
pnpm i
```

Second, run docker compose:

```bash
docker compose -f docker/docker-compose.yml up -d
```

Third, run prisma migrate & generate:

```bash
pnpm prisma migrate dev --name init              
pnpm prisma generate
```

Fourth, run start development server

```bash
pnpm run start:dev
```
