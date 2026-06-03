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
Create a `.env` file in root directory with your own values.

```sh
DATABASE_USERNAME=username
DATABASE_PASSWORD=password
DATABASE_NAME=name
# Prisma datasource url (See: prisma.config.ts)
DATABASE_URL="postgresql://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@${DATABASE_URL}/${DATABASE_NAME}?schema=public"
# Nuxt Auth Utils session password
NUXT_SESSION_PASSWORD=password-with-at-least-32-characters
# Sqids custom alphabet (Optional)
NUXT_SQIDS_ALPHABET="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

NUXT_PUBLIC_APP_URL=http://localhost:3000
```

## Database
### Postgres
Run docker compose to start `Postgres DB` and `Adminer` in containers.

```sh
docker compose up -d
```

Connect to the DB with this url:

```
postgresql://user:password@localhost:5432/urlshortener?schema=public
```

Or use the `Adminer` GUI.

```
http://localhost:8080

System: PostgresSQL
Server: db
Username: user
Password: password
Database: urlshortner
```

# Start Dev Server
Run commands

```sh
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
