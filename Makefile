.PHONY: dev prod format build start backend frontend

# Start both frontend and backend in development mode
dev: 
	@echo "Starting frontend and backend in development mode..."
	cd backend && pnpm run dev & cd frontend && pnpm run dev

# Start both frontend and backend in production mode
prod:
	@echo "Starting frontend and backend in production mode..."
	cd backend && pnpm run build && pnpm run start & cd frontend && pnpm run build && pnpm run start 

# Format both frontend and backend
format:
	@echo "Formatting frontend and backend..."
	cd backend && pnpm run format && cd frontend && pnpm run format

# Build both frontend and backend
build:
	@echo "Building frontend and backend..."
	cd backend && pnpm run build & cd frontend && pnpm run build

# Start both frontend and backend servers in production mode
start:
	@echo "Starting frontend and backend..."
	cd backend && pnpm run start & cd frontend && pnpm run start

# Start backend only
backend:
	cd backend && pnpm run dev

# Start frontend only
frontend:
	cd frontend && pnpm run dev
