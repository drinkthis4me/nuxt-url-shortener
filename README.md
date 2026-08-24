# Nuxt Full-Stack URL Shortener
A high-performance, secure URL shortening service built with Nuxt, Prisma, and PostgreSQL.

![Home page screenshot](doc/home_page.png)
![Sign-in page screenshot](doc/sign_in_page.png)
![Dashboard screenshot](doc/dashboard.png)

## Key Features
- Secure Redirects & Auth: Secure individual links with encrypted passwords.
- Link Management: Soft deletion. Bulk Operations.
- Performance & Reliability: Server middleware gatekeeper. Database-level projections.

# Setup
## Env
Create a `.env` file in root directory with your own values. (See: [.env.example](.env.example))

## Database
### Sqlite
Create database file with Prisma push command:

```bash
pnpx prisma push
```

# Start Dev Server
Run commands

```bash
pnpm install
pnpm dev
```

# Prisma
Server uses `Prisma ORM` to interact with DB.

### Generate
The prisma generate command generates assets (like Prisma Client) based on the generator and data model blocks defined in the `schema.prisma` file.

```bash
pnpx prisma generate
```

### Migration
Use the command to create a migration from changes in Prisma schema, apply it to the dev database, and trigger generators.

```bash
pnpx prisma migrate dev --name your_description
```

# Production
Create `.env.production` and run docker compose.

```bash
docker compose up --build -d
```

# License
MIT