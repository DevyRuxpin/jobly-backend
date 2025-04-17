const { User, Company, Job, Application } = require('./models');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    // Create test user
    const hashedPassword = await bcrypt.hash('password', 10);
    const testUser = await User.create({
      username: 'testuser',
      password: hashedPassword,
      firstName: 'Test',
      lastName: 'User',
      email: 'test@test.com',
      isAdmin: false
    });

    // Create companies
    const companies = await Company.bulkCreate([
      {
        handle: 'apple',
        name: 'Apple',
        numEmployees: 100000,
        description: 'Technology company',
        logoUrl: 'https://logo.clearbit.com/apple.com'
      },
      {
        handle: 'google',
        name: 'Google',
        numEmployees: 150000,
        description: 'Search engine company',
        logoUrl: 'https://logo.clearbit.com/google.com'
      },
      {
        handle: 'microsoft',
        name: 'Microsoft',
        numEmployees: 120000,
        description: 'Software company',
        logoUrl: 'https://logo.clearbit.com/microsoft.com'
      }
    ]);

    // Create jobs
    const jobs = await Job.bulkCreate([
      {
        title: 'Software Engineer',
        salary: 120000,
        equity: 0.1,
        companyId: companies[0].id
      },
      {
        title: 'Product Manager',
        salary: 150000,
        equity: 0.2,
        companyId: companies[1].id
      },
      {
        title: 'Data Scientist',
        salary: 130000,
        equity: 0.15,
        companyId: companies[2].id
      }
    ]);

    // Create applications
    await Application.bulkCreate([
      {
        userId: testUser.id,
        jobId: jobs[0].id
      },
      {
        userId: testUser.id,
        jobId: jobs[1].id
      }
    ]);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed(); 