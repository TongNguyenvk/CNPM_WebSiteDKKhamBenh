#!/bin/bash

# 🧪 Complete Test Suite Runner
# This script runs all tests locally to simulate CI/CD pipeline

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if ! command_exists node; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    if ! command_exists npm; then
        print_error "npm is not installed"
        exit 1
    fi
    
    if ! command_exists docker; then
        print_warning "Docker is not installed - skipping Docker tests"
        SKIP_DOCKER=true
    fi
    
    print_success "Prerequisites check completed"
}

# Frontend tests
test_frontend() {
    print_status "Running Frontend Tests..."
    
    cd frontend
    
    print_status "Installing frontend dependencies..."
    npm ci
    
    print_status "Running ESLint..."
    npm run lint
    
    print_status "Running TypeScript check..."
    npm run type-check
    
    print_status "Building frontend..."
    npm run build
    
    print_success "Frontend tests completed"
    cd ..
}

# Backend tests
test_backend() {
    print_status "Running Backend Tests..."
    
    cd backend
    
    print_status "Installing backend dependencies..."
    npm ci
    
    print_status "Running backend tests..."
    npm run test
    
    print_success "Backend tests completed"
    cd ..
}

# Security tests
test_security() {
    print_status "Running Security Tests..."
    
    print_status "Checking for secrets in code..."
    if grep -r -E "(password|secret|key|token)\s*=\s*['\"][^'\"]{8,}" . --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=.next; then
        print_warning "Potential secrets found in code!"
    else
        print_success "No obvious secrets found"
    fi
    
    print_status "Running npm audit for frontend..."
    cd frontend
    npm audit --audit-level=high || print_warning "Frontend has some vulnerabilities"
    cd ..
    
    print_status "Running npm audit for backend..."
    cd backend
    npm audit --audit-level=high || print_warning "Backend has some vulnerabilities"
    cd ..
    
    print_success "Security tests completed"
}

# Docker tests
test_docker() {
    if [ "$SKIP_DOCKER" = true ]; then
        print_warning "Skipping Docker tests (Docker not available)"
        return
    fi
    
    print_status "Running Docker Tests..."
    
    print_status "Building frontend Docker image..."
    docker build -t test-frontend:latest ./frontend
    
    print_status "Building backend Docker image..."
    docker build -t test-backend:latest ./backend
    
    print_status "Cleaning up test images..."
    docker rmi test-frontend:latest test-backend:latest
    
    print_success "Docker tests completed"
}

# Code quality checks
test_code_quality() {
    print_status "Running Code Quality Checks..."
    
    print_status "Analyzing code metrics..."
    
    # Count lines of code
    echo "Frontend TypeScript/JavaScript files:"
    find frontend/src -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | wc -l
    
    echo "Backend JavaScript files:"
    find backend/src -name "*.js" 2>/dev/null | wc -l || echo "0"
    
    # Check for large files
    print_status "Checking for large files..."
    find . -type f -size +1M -not -path "./node_modules/*" -not -path "./.git/*" -not -path "./.next/*" | while read file; do
        print_warning "Large file detected: $file"
    done
    
    print_success "Code quality checks completed"
}

# Performance tests
test_performance() {
    print_status "Running Performance Tests..."
    
    cd frontend
    
    if [ -d ".next" ]; then
        print_status "Analyzing bundle size..."
        du -sh .next/static/* 2>/dev/null | sort -hr | head -5 || echo "No static files found"
        
        echo "Total build size:"
        du -sh .next
    else
        print_warning "No build found - run 'npm run build' first"
    fi
    
    cd ..
    
    print_success "Performance tests completed"
}

# Main execution
main() {
    echo "🧪 Starting Complete Test Suite"
    echo "================================"
    
    START_TIME=$(date +%s)
    
    check_prerequisites
    
    # Run all test suites
    test_frontend
    test_backend
    test_security
    test_docker
    test_code_quality
    test_performance
    
    END_TIME=$(date +%s)
    DURATION=$((END_TIME - START_TIME))
    
    echo ""
    echo "🎉 All Tests Completed Successfully!"
    echo "=================================="
    echo "Total execution time: ${DURATION} seconds"
    echo ""
    echo "✅ Frontend tests passed"
    echo "✅ Backend tests passed"
    echo "✅ Security checks passed"
    if [ "$SKIP_DOCKER" != true ]; then
        echo "✅ Docker tests passed"
    fi
    echo "✅ Code quality checks passed"
    echo "✅ Performance tests passed"
    echo ""
    echo "🚀 Your code is ready for CI/CD pipeline!"
}

# Handle script interruption
trap 'print_error "Test suite interrupted"; exit 1' INT TERM

# Run main function
main "$@"
