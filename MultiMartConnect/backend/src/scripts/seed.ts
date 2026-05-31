import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/multimart-connect';

async function executeDatabaseSeedingPipeline() {
  try {
    console.log('⏳ Initializing connection to local database cluster...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Database connection established.');

    // 1. Flush Existing Testing State Collections
    const targetCollections = ['tenants', 'users', 'products', 'orders'];
    const activeCollections = await mongoose.connection.db.listCollections().toArray();
    
    for (const col of activeCollections) {
      if (targetCollections.includes(col.name)) {
        await mongoose.connection.db.dropCollection(col.name);
        console.log(`🧹 Dropped collection: ${col.name}`);
      }
    }

    // 2. Insert Mock Tenant Workspaces
    const TenantModel = mongoose.model('Tenant', new mongoose.Schema({}, { strict: false }));
    const tenants = await TenantModel.insertMany([
      { name: 'Nexus Retail Group', slug: 'nexus-retail', isActive: true, createdAt: new Date() },
      { name: 'Apex Alpha Brands', slug: 'apex-alpha', isActive: true, createdAt: new Date() },
      { name: 'Vanguard Systems', slug: 'vanguard-sys', isActive: false, createdAt: new Date() } // Administratively Suspended Demo Space
    ]);
    console.log(`🌱 Seeded ${tenants.length} Isolated Tenant Document Space Nodes.`);

    // 3. Insert Mock Presentation User Accounts
    const UserModel = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    const users = await UserModel.insertMany([
      { email: 'admin@multimart.com', role: 'SUPER_ADMIN', tenantId: null },
      { email: 'seller@nexus.com', role: 'SELLER', tenantId: tenants[0]._id },
      { email: 'buyer@gmail.com', role: 'CUSTOMER', tenantId: tenants[0]._id }
    ]);
    console.log(`🌱 Seeded ${users.length} Multi-Role Validation Personas.`);

    // 4. Insert Mock Product Inventories Scoped by Tenant
    const ProductModel = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
    await ProductModel.insertMany([
      { title: 'Quantum Core Alpha Laptop', price: 1299.99, category: 'Electronics', stock: 15, rating: 4.8, tenantId: tenants[0]._id },
      { title: 'Aero-Weave Ergonomic Lumbar Chair', price: 349.50, category: 'Furniture', stock: 20, rating: 4.6, tenantId: tenants[0]._id },
      { title: 'Titanium Tactical Minimalist Bottle', price: 45.00, category: 'Accessories', stock: 50, rating: 4.3, tenantId: tenants[0]._id },
      { title: 'Apex High-Flow Running Threads', price: 120.00, category: 'Apparel', stock: 85, rating: 4.5, tenantId: tenants[1]._id } // Scoped under Tenant 1 (Apex)
    ]);
    console.log('🌱 Seeded Product Inventory Scoped cleanly by Tenant Domain IDs.');
    console.log('===================================================');
    console.log('🎉 SYSTEM SEEDING SCRIPT COMPLETED EXCELLENTLY');
    console.log('===================================================');

    process.exit(0);
  } catch (error) {
    console.error('🛑 Seeding critical malfunction failure:', error);
    process.exit(1);
  }
}

executeDatabaseSeedingPipeline();