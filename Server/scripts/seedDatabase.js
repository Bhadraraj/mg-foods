const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Category = require('../models/Category');
const Item = require('../models/Item');
const Party = require('../models/Party');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding...');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Item.deleteMany({});
    await Party.deleteMany({});

    console.log('Existing data cleared...');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@restaurant.com',
      password: 'admin123',
      role: 'admin',
      mobile: '9999999999',
      store: 'Main Store',
      billType: 'GST'
    });

    console.log('Admin user created...');

    // Create manager user
    const managerUser = await User.create({
      name: 'Manager User',
      email: 'manager@restaurant.com',
      password: 'manager123',
      role: 'manager',
      mobile: '9999999998',
      store: 'Main Store',
      billType: 'GST'
    });

    // Create cashier user
    const cashierUser = await User.create({
      name: 'Cashier User',
      email: 'cashier@restaurant.com',
      password: 'cashier123',
      role: 'cashier',
      mobile: '9999999997',
      store: 'Main Store',
      billType: 'GST'
    });

    console.log('Users created...');

    // Create categories
    const categories = await Category.create([
      {
        name: 'Beverages',
        description: 'Hot and cold beverages',
        status: 'active',
        createdBy: adminUser._id
      },
      {
        name: 'Main Course',
        description: 'Main course items',
        status: 'active',
        createdBy: adminUser._id
      },
      {
        name: 'Appetizers',
        description: 'Starters and appetizers',
        status: 'active',
        createdBy: adminUser._id
      },
      {
        name: 'Desserts',
        description: 'Sweet dishes and desserts',
        status: 'active',
        createdBy: adminUser._id
      }
    ]);

    console.log('Categories created...');

    // Create sample items
    const items = await Item.create([
      {
        name: 'Masala Tea',
        itemCode: 'TEA001',
        hsnCode: '2101',
        category: categories[0]._id,
        unit: 'piece',
        type: 'product',
        pricing: {
          sellingPrice: 25,
          purchasePrice: 15,
          mrp: 30
        },
        stock: {
          currentStock: 100,
          minStock: 20,
          maxStock: 200
        },
        tax: {
          taxPercentage: 5,
          taxType: 'exclusive'
        },
        status: 'active',
        createdBy: adminUser._id
      },
      {
        name: 'Chicken Biryani',
        itemCode: 'BIR001',
        hsnCode: '1006',
        category: categories[1]._id,
        unit: 'piece',
        type: 'product',
        pricing: {
          sellingPrice: 280,
          purchasePrice: 200,
          mrp: 300
        },
        stock: {
          currentStock: 50,
          minStock: 10,
          maxStock: 100
        },
        tax: {
          taxPercentage: 18,
          taxType: 'exclusive'
        },
        status: 'active',
        createdBy: adminUser._id
      },
      {
        name: 'Paneer Tikka',
        itemCode: 'APP001',
        hsnCode: '0406',
        category: categories[2]._id,
        unit: 'piece',
        type: 'product',
        pricing: {
          sellingPrice: 220,
          purchasePrice: 150,
          mrp: 250
        },
        stock: {
          currentStock: 30,
          minStock: 5,
          maxStock: 50
        },
        tax: {
          taxPercentage: 18,
          taxType: 'exclusive'
        },
        status: 'active',
        createdBy: adminUser._id
      },
      {
        name: 'Gulab Jamun',
        itemCode: 'DES001',
        hsnCode: '1905',
        category: categories[3]._id,
        unit: 'piece',
        type: 'product',
        pricing: {
          sellingPrice: 80,
          purchasePrice: 50,
          mrp: 100
        },
        stock: {
          currentStock: 40,
          minStock: 10,
          maxStock: 80
        },
        tax: {
          taxPercentage: 18,
          taxType: 'exclusive'
        },
        status: 'active',
        createdBy: adminUser._id
      }
    ]);

    console.log('Items created...');

    // Create sample parties
    const parties = await Party.create([
      {
        name: 'ABC Suppliers',
        type: 'vendor',
        contact: {
          mobile: '9876543210',
          email: 'abc@suppliers.com',
          address: {
            street: '123 Market Street',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001',
            country: 'India'
          }
        },
        business: {
          gstNumber: '27ABCDE1234F1Z5',
          businessType: 'company'
        },
        financial: {
          creditLimit: 100000,
          creditDays: 30
        },
        status: 'active',
        createdBy: adminUser._id
      },
      {
        name: 'John Doe',
        type: 'customer',
        contact: {
          mobile: '9876543211',
          email: 'john@example.com',
          address: {
            street: '456 Customer Lane',
            city: 'Delhi',
            state: 'Delhi',
            pincode: '110001',
            country: 'India'
          }
        },
        customerDetails: {
          rateType: 'retail',
          loyaltyPoints: 100
        },
        status: 'active',
        createdBy: adminUser._id
      },
      {
        name: 'Marketing Agency',
        type: 'referrer',
        contact: {
          mobile: '9876543212',
          email: 'marketing@agency.com',
          address: {
            street: '789 Business Park',
            city: 'Bangalore',
            state: 'Karnataka',
            pincode: '560001',
            country: 'India'
          }
        },
        referrerDetails: {
          commissionRate: 5,
          commissionPoints: 500,
          yearlyPoints: 2000
        },
        status: 'active',
        createdBy: adminUser._id
      }
    ]);

    console.log('Parties created...');

    console.log('✅ Database seeded successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('Admin: admin@restaurant.com / admin123');
    console.log('Manager: manager@restaurant.com / manager123');
    console.log('Cashier: cashier@restaurant.com / cashier123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

const runSeed = async () => {
  await connectDB();
  await seedData();
};

runSeed();