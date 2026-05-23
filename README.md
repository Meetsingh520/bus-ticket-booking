# Bus Ticket Booking System

A full-stack, responsive Bus Ticket Booking web application built with React, Node.js, Express, and MongoDB.

## Features
- **User Authentication:** JWT based Auth (Login, Register).
- **Search:** Search buses by source, destination, and date.
- **Seat Selection:** Visual 2x2 seat selection UI.
- **Booking Flow:** Add passenger details and proceed to checkout.
- **Mock Payment:** Simulate payment processing.
- **User Dashboard:** View booking history and download tickets.
- **Admin Panel:** Manage routes, buses, and view overall platform analytics.
- **Responsive UI:** Modern glassmorphism design built with Tailwind CSS.

## Tech Stack
- **Frontend:** React (Vite), React Router, Context API, Tailwind CSS, Axios, Lucide React.
- **Backend:** Node.js, Express.js, Mongoose, JWT, bcryptjs.
- **Database:** MongoDB.

---

## Local Development Setup

### 1. Prerequisites
- Node.js (v16+)
- MongoDB (Local instance or MongoDB Atlas URI)

### 2. Backend Setup
1. Open terminal and navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_key
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Open a new terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:5173` in your browser.

---

## AWS EC2 Ubuntu Deployment Guide

To deploy this application on a production AWS EC2 Ubuntu instance, follow these steps.

### Step 1: Server Preparation
SSH into your EC2 instance and update packages:
```bash
sudo apt update && sudo apt upgrade -y
```

Install Node.js & npm (Using NodeSource):
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

Install PM2 globally to manage the Node.js backend:
```bash
sudo npm install -g pm2
```

Install Nginx:
```bash
sudo apt install -y nginx
```

### Step 2: Clone & Build the Application
Clone your repository (or copy files via SFTP) into `/var/www/bus-booking`.

#### Backend Setup
```bash
cd /var/www/bus-booking/server
npm install
```
Create `.env` inside `server` with your production variables:
```env
NODE_ENV=production
PORT=5000
MONGO_URI=your_production_mongo_uri
JWT_SECRET=your_production_secret
```

Start backend with PM2:
```bash
pm2 start server.js --name "bus-api"
pm2 save
pm2 startup
```

#### Frontend Setup
```bash
cd /var/www/bus-booking/client
npm install
```
Build the React application:
```bash
npm run build
```
This will generate a `dist` folder inside `client`.

### Step 3: Configure Nginx
Create an Nginx configuration file:
```bash
sudo nano /etc/nginx/sites-available/bus-booking
```

Add the following configuration:
```nginx
server {
    listen 80;
    server_name your_domain_or_ec2_ip;

    # Serve React App
    location / {
        root /var/www/bus-booking/client/dist;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to Node.js backend
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/bus-booking /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

Your application is now deployed!
