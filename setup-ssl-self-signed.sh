#!/bin/bash

echo "🔒 Creating self-signed SSL certificate..."

# Generate self-signed certificate
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout ./ssl/key.pem \
    -out ./ssl/cert.pem \
    -subj "/C=VN/ST=Ho Chi Minh/L=Ho Chi Minh City/O=HCMIU/OU=Web Development/CN=hcmiu-project-web.id.vn"

# Set proper permissions
chmod 644 ./ssl/cert.pem
chmod 600 ./ssl/key.pem

echo "✅ Self-signed certificate created!"
echo "⚠️ Note: Browsers will show a security warning for self-signed certificates"
