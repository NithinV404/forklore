#!/bin/bash

# Define URLs to test
FRONTEND_URL="http://127.0.0.1:8000"  # Adjust as needed
API_URL="http://127.0.0.1:5000"       # Adjust as needed

# Function to test URL availability
test_url() {
    local url=$1
    local name=$2
    echo "Testing $name at $url..."
    
    # Try to curl the URL with a 10-second timeout
    if curl -f -s -S --max-time 10 "$url" > /dev/null; then
        echo "✅ $name is accessible"
        return 0
    else
        echo "❌ $name is not accessible"
        return 1
    fi
}

# Initialize error counter
errors=0

# Test frontend
test_url "$FRONTEND_URL" "Frontend" || ((errors++))

# Test API
test_url "$API_URL" "API" || ((errors++))

# Final results
echo "=== Test Results ==="
if [ $errors -eq 0 ]; then
    echo "All tests passed successfully! 🎉"
    exit 0
else
    echo "Failed tests: $errors ❌"
    exit 1
fi