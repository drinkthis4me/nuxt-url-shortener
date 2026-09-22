# Nuxt Full-Stack URL Shortener
A high-performance, secure URL shortening service built with Nuxt, Prisma, and SQLite.

![Home page screenshot](doc/home_page.png)
![Sign-in page screenshot](doc/sign_in_page.png)
![Dashboard screenshot](doc/dashboard.png)

## Key Features
- Secure Redirects & Auth: Secure individual links with encrypted passwords.
- Link Management: Soft deletion. Bulk Operations.
- Performance & Reliability: Server middleware gatekeeper. Database-level projections.

# Setup
## Install dependencies

```bash
pnpm install
```

## Env
Create a `.env` file in root directory with your own values. (See: [.env.example](.env.example))

## Database
Create SQLite database file with Prisma push command:

```bash
pnpm prisma db push
```

## Start Dev Server

```bash
pnpm dev
```

# Production
Create `.env.production` and run docker compose.

```bash
docker compose up --build -d
```

# License
MIT