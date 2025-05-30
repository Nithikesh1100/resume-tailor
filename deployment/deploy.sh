#!/bin/bash

echo "🚀 Starting deployment..."

# Build backend
echo "📦 Building backend..."
cd resume-tailor
mvn clean package -DskipTests
cd ..

# Build frontend  
echo "🎨 Building frontend..."
cd resume-tailor-frontend
npm ci
npm run build
cd ..

# Start applications
echo "🔄 Starting applications..."

# Start backend
echo "Starting backend on port 8080..."
cd resume-tailor
java -jar target/*.jar &
BACKEND_PID=$!
cd ..

# Start frontend
echo "Starting frontend on port 3000..."
cd resume-tailor-frontend
npm start &
FRONTEND_PID=$!
cd ..

echo "✅ Deployment complete!"
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo "Backend: http://localhost:8080"
echo "Frontend: http://localhost:3000"

# Save PIDs for later cleanup
echo $BACKEND_PID > backend.pid
echo $FRONTEND_PID > frontend.pid