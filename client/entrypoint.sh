#!/bin/sh
set -e

# Default values
DEFAULT_API_BASE_URL="http://localhost:5702/api"

# Use environment variables or defaults
API_BASE_URL="${VITE_API_BASE_URL:-$DEFAULT_API_BASE_URL}"

echo "Configuring React app with:"
echo "  API_BASE_URL: $API_BASE_URL"

# Create runtime configuration file
cat > /usr/share/nginx/html/config.js << EOF
window.APP_CONFIG = {
  API_BASE_URL: "$API_BASE_URL"
};
EOF

echo "Runtime configuration created successfully"

# Execute the original command
exec "$@" 