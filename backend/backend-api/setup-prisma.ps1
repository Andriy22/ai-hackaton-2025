# Setup script for Prisma with Azure PostgreSQL

# Set environment variables
$env:DATABASE_URL = "postgresql://hackatondbadmin:bnuYPHmbRWUp!@hackatonpostgressserver.postgres.database.azure.com:5432/postgres?schema=public"

# Create .env file without quotes around the value
"DATABASE_URL=postgresql://hackatondbadmin:bnuYPHmbRWUp!@hackatonpostgressserver.postgres.database.azure.com:5432/postgres?schema=public" | Out-File -FilePath .env -Encoding utf8

Write-Host "Environment variables set and .env file created."

# Generate Prisma client
Write-Host "Generating Prisma client..."
npx prisma generate

# Create migration
Write-Host "Creating database migration..."
npx prisma migrate dev --name init

Write-Host "Setup complete!"
