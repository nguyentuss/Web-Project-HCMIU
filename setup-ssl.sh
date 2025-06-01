#!/bin/bash

echo "🔒 Setting up SSL with Let's Encrypt..."

# Install certbot if not already installed
if ! command -v certbot &> /dev/null; then
    echo "Installing certbot..."
    sudo apt update
    sudo apt install certbot python3-certbot-nginx -y
fi

# Generate SSL certificate
echo "Generating SSL certificate for hcmiu-project-web.id.vn..."
sudo certbot --nginx -d hcmiu-project-web.id.vn

# Copy certificates to ssl directory
sudo cp /etc/letsencrypt/live/hcmiu-project-web.id.vn/fullchain.pem ./ssl/cert.pem
sudo cp /etc/letsencrypt/live/hcmiu-project-web.id.vn/privkey.pem ./ssl/key.pem

# Set proper permissions
sudo chown $USER:$USER ./ssl/*.pem
chmod 644 ./ssl/cert.pem
chmod 600 ./ssl/key.pem

echo "✅ SSL setup complete!"
