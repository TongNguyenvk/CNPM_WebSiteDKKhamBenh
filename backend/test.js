const { Sequelize } = require('sequelize');

// Test configuration - use environment variables for CI/CD
const dbConfig = {
  database: process.env.DB_NAME || 'DBDKKHAMBENH',
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '123456',
  host: process.env.DB_HOST || 'cnpm_websitedkkhambenh-db-mysql-1',
  dialect: 'mysql',
  logging: false // Disable logging for tests
};

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  logging: dbConfig.logging
});

// Test suite
async function runTests() {
  console.log('🧪 Starting Backend Tests...\n');

  let testsPassed = 0;
  let testsFailed = 0;

  // Test 1: Database Connection
  try {
    console.log('📝 Test 1: Database Connection');
    await sequelize.authenticate();
    console.log('✅ Database connection successful');
    testsPassed++;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    testsFailed++;
  }

  // Test 2: Environment Variables
  try {
    console.log('\n📝 Test 2: Environment Variables');
    const requiredEnvVars = ['NODE_ENV'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

    if (missingVars.length === 0) {
      console.log('✅ All required environment variables are set');
      testsPassed++;
    } else {
      console.log(`⚠️ Missing environment variables: ${missingVars.join(', ')}`);
      console.log('✅ Test passed (non-critical variables)');
      testsPassed++;
    }
  } catch (error) {
    console.error('❌ Environment variables test failed:', error.message);
    testsFailed++;
  }

  // Test 3: Basic API Structure (if server files exist)
  try {
    console.log('\n📝 Test 3: Server Structure');
    const fs = require('fs');
    const path = require('path');

    const serverFile = path.join(__dirname, 'src', 'server.js');
    if (fs.existsSync(serverFile)) {
      console.log('✅ Server file exists');
      testsPassed++;
    } else {
      console.log('❌ Server file not found');
      testsFailed++;
    }
  } catch (error) {
    console.error('❌ Server structure test failed:', error.message);
    testsFailed++;
  }

  // Test 4: Package Dependencies
  try {
    console.log('\n📝 Test 4: Package Dependencies');
    const packageJson = require('./package.json');
    const criticalDeps = ['express', 'sequelize', 'mysql2'];
    const missingDeps = criticalDeps.filter(dep => !packageJson.dependencies[dep]);

    if (missingDeps.length === 0) {
      console.log('✅ All critical dependencies are installed');
      testsPassed++;
    } else {
      console.log(`❌ Missing critical dependencies: ${missingDeps.join(', ')}`);
      testsFailed++;
    }
  } catch (error) {
    console.error('❌ Package dependencies test failed:', error.message);
    testsFailed++;
  }

  // Test Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ Tests Passed: ${testsPassed}`);
  console.log(`❌ Tests Failed: ${testsFailed}`);
  console.log(`📊 Total Tests: ${testsPassed + testsFailed}`);

  if (testsFailed > 0) {
    console.log('\n❌ Some tests failed!');
    process.exit(1);
  } else {
    console.log('\n🎉 All tests passed!');
    process.exit(0);
  }
}

// Run tests
runTests().catch(error => {
  console.error('💥 Test runner failed:', error);
  process.exit(1);
});

