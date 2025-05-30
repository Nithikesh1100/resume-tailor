#!/bin/bash

echo "🛑 Stopping applications..."

# Stop backend
if [ -f backend.pid ]; then
    BACKEND_PID=$(cat backend.pid)
    kill $BACKEND_PID 2>/dev/null
    rm backend.pid
    echo "Backend stopped"
fi

# Stop frontend
if [ -f frontend.pid ]; then
    FRONTEND_PID=$(cat frontend.pid)
    kill $FRONTEND_PID 2>/dev/null
    rm frontend.pid
    echo "Frontend stopped"
fi

echo "✅ All applications stopped"