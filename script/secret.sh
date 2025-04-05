#!/bin/bash

set -e

BASE_ENV_FILE=".env.example"
ENV_FILE=".env"

OS_TYPE=$(grep -w "ID" /etc/os-release 2>/dev/null | cut -d "=" -f 2 | tr -d '"' || echo "")
OS_VERSION=$(grep -w "VERSION_ID" /etc/os-release 2>/dev/null | cut -d "=" -f 2 | tr -d '"' || echo "")

if [[ "$OSTYPE" == "darwin"* ]]; then
  OS_TYPE="macos"
fi

echo " - Detecting OS type: $OS_TYPE"
echo " - Detecting OS version: $OS_VERSION"

# Generate secure values
TYPEORM_PASSWORD=$(openssl rand -hex 16)
APP_DEFAULT_PASS=$(openssl rand -hex 8)
APP_SECRET=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 32)

echo " - Generating secure values..."

# Set sed command based on OS
if [ "$OS_TYPE" = "macos" ]; then
  SED_CMD="sed -i ''"
else
  SED_CMD="sed -i"
fi

if [ -f "$BASE_ENV_FILE" ]; then
  # Check if .env already exists
  if [ -f "$ENV_FILE" ]; then
    echo " - Warning: $ENV_FILE already exists. Please remove it manually."
    exit 1
  fi

  cp "$BASE_ENV_FILE" "$ENV_FILE"
  echo " - Copy $BASE_ENV_FILE to $ENV_FILE"

  # Update values in .env file
  $SED_CMD "s|^TYPEORM_PASSWORD=.*|TYPEORM_PASSWORD='$TYPEORM_PASSWORD'|" "$ENV_FILE"
  $SED_CMD "s|^APP_DEFAULT_PASS=.*|APP_DEFAULT_PASS='$APP_DEFAULT_PASS'|" "$ENV_FILE"
  $SED_CMD "s|^APP_SECRET=.*|APP_SECRET='$APP_SECRET'|" "$ENV_FILE"
  $SED_CMD "s|^JWT_SECRET=.*|JWT_SECRET='$JWT_SECRET'|" "$ENV_FILE"

  echo " - Secrets have been generated and saved to $ENV_FILE file"
else
  echo " - Warning: $BASE_ENV_FILE does not exist. Cannot create environment file."
  exit 1
fi

echo -e "\nYour setup is ready to use!\n"
