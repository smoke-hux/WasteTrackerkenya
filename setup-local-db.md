# Database Setup Options

## Option 1: Use Neon Database (Recommended - Free & Easy)

1. Go to [neon.tech](https://neon.tech)
2. Sign up for a free account
3. Create a new project called "yugi-waste-tracker"
4. Copy the connection string from the dashboard
5. Replace the DATABASE_URL in `.env.local` with your Neon connection string

Example Neon URL format:
```
DATABASE_URL=postgresql://username:password@ep-example.us-east-1.aws.neon.tech/yugi_db?sslmode=require
```

## Option 2: Local PostgreSQL Setup

### Install PostgreSQL on Ubuntu/Debian:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Create database and user:
```bash
sudo -u postgres psql
```

In PostgreSQL shell:
```sql
CREATE DATABASE yugi_db;
CREATE USER yugi_user WITH ENCRYPTED PASSWORD 'yugi_password';
GRANT ALL PRIVILEGES ON DATABASE yugi_db TO yugi_user;
\q
```

### Update .env.local:
```
DATABASE_URL=postgresql://yugi_user:yugi_password@localhost:5432/yugi_db
```

## Option 3: Docker PostgreSQL (Alternative)

```bash
docker run --name yugi-postgres -e POSTGRES_DB=yugi_db -e POSTGRES_USER=yugi_user -e POSTGRES_PASSWORD=yugi_password -p 5432:5432 -d postgres:15
```

Then use:
```
DATABASE_URL=postgresql://yugi_user:yugi_password@localhost:5432/yugi_db
```