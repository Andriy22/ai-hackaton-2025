# Setup script for the NestJS Prisma project with PostgreSQL on Azure

# Create the .env file with the correct connection string
$envContent = @"
DATABASE_URL="postgresql://hackatondbadmin:bnuYPHmbRWUp!@hackatonpostgressserver.postgres.database.azure.com:5432/postgres?schema=public"
"@

Set-Content -Path ".env" -Value $envContent -Force

Write-Host "Created .env file with the database connection string."

# Generate Prisma client
Write-Host "Generating Prisma client..."
npx prisma generate

# Create the database migration
Write-Host "Creating database migration..."
npx prisma migrate dev --name init

# Seed the database with the default admin user
Write-Host "Seeding the database with default admin user..."
npm run prisma:seed

Write-Host "Setup complete! The database has been configured with the default admin user."
