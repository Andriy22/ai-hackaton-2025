# Setup script for the NestJS Prisma project

# Set environment variables for database connection
$env:DATABASE_URL = "postgresql://hackatondbadmin:bnuYPHmbRWUp!@hackatonpostgressserver.postgres.database.azure.com:5432/postgres?schema=public"

# Create .env file with the database connection string
"DATABASE_URL=postgresql://hackatondbadmin:bnuYPHmbRWUp!@hackatonpostgressserver.postgres.database.azure.com:5432/postgres?schema=public" | Out-File -FilePath .env -Encoding utf8

Write-Host "Environment variables and .env file have been set up."

# Run Prisma migrations
Write-Host "Running Prisma migrations..."
npx prisma migrate dev --name init

# Seed the database with the default admin user
Write-Host "Seeding the database with default admin user..."
npm run prisma:seed

Write-Host "Setup complete! The database has been configured with the default admin user."
