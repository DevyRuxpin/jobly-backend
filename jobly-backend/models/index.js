const { Sequelize } = require('sequelize');
require('dotenv').config();

// Get database URL from environment
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('DATABASE_URL is not defined in environment variables');
  process.exit(1);
}

// Configure Sequelize
const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  });

// Import models
const User = require('./user')(sequelize);
const Company = require('./company')(sequelize);
const Job = require('./job')(sequelize);
const Application = require('./application')(sequelize);

// Define associations
Company.hasMany(Job, {
  foreignKey: 'company_handle',
  sourceKey: 'handle'
});

Job.belongsTo(Company, {
  foreignKey: 'company_handle',
  targetKey: 'handle'
});

User.belongsToMany(Job, {
  through: Application,
  foreignKey: 'username',
  otherKey: 'job_id'
});

Job.belongsToMany(User, {
  through: Application,
  foreignKey: 'job_id',
  otherKey: 'username'
});

module.exports = {
  sequelize,
  User,
  Company,
  Job,
  Application
}; 