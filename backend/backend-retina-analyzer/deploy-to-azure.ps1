# PowerShell script to deploy the Retina Analyzer to Azure Web App

# Configuration - Update these values
$resourceGroup = "your-resource-group"
$appServicePlan = "your-app-service-plan"
$webAppName = "retina-analyzer"
$acrName = "your-acr-name"
$imageTag = "retina-analyzer:latest"

# Login to Azure (uncomment if needed)
# az login

# Build the Docker image
Write-Host "Building Docker image..." -ForegroundColor Green
docker build -t $imageTag .

# Tag the image for ACR
$acrLoginServer = "$acrName.azurecr.io"
$acrImage = "$acrLoginServer/$imageTag"
docker tag $imageTag $acrImage

# Login to ACR
Write-Host "Logging in to Azure Container Registry..." -ForegroundColor Green
az acr login --name $acrName

# Push the image to ACR
Write-Host "Pushing image to Azure Container Registry..." -ForegroundColor Green
docker push $acrImage

# Create the Web App if it doesn't exist
$webAppExists = az webapp show --name $webAppName --resource-group $resourceGroup 2>$null
if (-not $webAppExists) {
    Write-Host "Creating Web App..." -ForegroundColor Green
    az webapp create --resource-group $resourceGroup --plan $appServicePlan --name $webAppName --deployment-container-image-name $acrImage
} else {
    Write-Host "Web App already exists, updating configuration..." -ForegroundColor Green
}

# Configure the Web App to use the ACR image
Write-Host "Configuring Web App to use ACR image..." -ForegroundColor Green
az webapp config container set --name $webAppName --resource-group $resourceGroup --docker-custom-image-name $acrImage --docker-registry-server-url "https://$acrLoginServer"

# Configure environment variables from .env file
Write-Host "Setting environment variables..." -ForegroundColor Green
$envVars = Get-Content .env | Where-Object { $_ -match '^\s*[^#]' } | ForEach-Object {
    $key, $value = $_ -split '=', 2
    @{$key = $value}
}

# Convert environment variables to JSON format for az CLI
$envVarsJson = $envVars | ConvertTo-Json -Compress
$envVarsJson = $envVarsJson -replace '"', '\"'

# Set environment variables in the Web App
az webapp config appsettings set --resource-group $resourceGroup --name $webAppName --settings @$envVarsJson

# Restart the Web App
Write-Host "Restarting Web App..." -ForegroundColor Green
az webapp restart --name $webAppName --resource-group $resourceGroup

Write-Host "Deployment completed successfully!" -ForegroundColor Green
Write-Host "Your app should be available at: https://$webAppName.azurewebsites.net" -ForegroundColor Cyan
