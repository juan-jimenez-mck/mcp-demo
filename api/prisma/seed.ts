import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Clear existing data
  console.log('Clearing existing data...');
  await prisma.chatMessage.deleteMany();
  await prisma.chatSession.deleteMany();
  await prisma.accountInsight.deleteMany();
  await prisma.actionItem.deleteMany();
  await prisma.email.deleteMany();
  await prisma.promotion.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.orderingPattern.deleteMany();
  await prisma.account.deleteMany();
  await prisma.product.deleteMany();
  await prisma.subcategory.deleteMany();
  await prisma.category.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();
  await prisma.territory.deleteMany();

  // Create territories
  console.log('Creating territories...');
  const territories = await Promise.all([
    prisma.territory.create({
      data: {
        name: 'Northeast Region',
        description:
          'Covers New York, New Jersey, Connecticut, Massachusetts, and surrounding states',
      },
    }),
    prisma.territory.create({
      data: {
        name: 'Southeast Region',
        description:
          'Covers Florida, Georgia, North Carolina, South Carolina, and surrounding states',
      },
    }),
    prisma.territory.create({
      data: {
        name: 'Midwest Region',
        description:
          'Covers Illinois, Michigan, Ohio, Wisconsin, and surrounding states',
      },
    }),
    prisma.territory.create({
      data: {
        name: 'West Coast Region',
        description:
          'Covers California, Oregon, Washington, and surrounding states',
      },
    }),
  ]);

  // Create users
  console.log('Creating users...');
  const mainUser = await prisma.user.create({
    data: {
      firstName: 'Juan',
      lastName: 'Jimenez',
      email: 'juan.jimenez@company.com',
      role: Role.SALES_REP,
      territoryId: territories[0].id,
    },
  });

  const users = await Promise.all([
    prisma.user.create({
      data: {
        firstName: 'Mike',
        lastName: 'Rodriguez',
        email: 'mike.rodriguez@company.com',
        role: Role.SALES_REP,
        territoryId: territories[1].id,
      },
    }),
    prisma.user.create({
      data: {
        firstName: 'Emily',
        lastName: 'Chen',
        email: 'emily.chen@company.com',
        role: Role.SALES_REP,
        territoryId: territories[2].id,
      },
    }),
    prisma.user.create({
      data: {
        firstName: 'David',
        lastName: 'Kim',
        email: 'david.kim@company.com',
        role: Role.SALES_REP,
        territoryId: territories[3].id,
      },
    }),
    prisma.user.create({
      data: {
        firstName: 'Lisa',
        lastName: 'Thompson',
        email: 'lisa.thompson@company.com',
        role: Role.SALES_REP,
        territoryId: territories[0].id,
      },
    }),
    // Other roles
    prisma.user.create({
      data: {
        firstName: 'John',
        lastName: 'Anderson',
        email: 'john.anderson@company.com',
        role: Role.ACCOUNT_MANAGER,
      },
    }),
    prisma.user.create({
      data: {
        firstName: 'Maria',
        lastName: 'Lopez',
        email: 'maria.lopez@company.com',
        role: Role.TRADE_MARKETING,
      },
    }),
    prisma.user.create({
      data: {
        firstName: 'Robert',
        lastName: 'Smith',
        email: 'robert.smith@company.com',
        role: Role.FINANCE,
      },
    }),
    prisma.user.create({
      data: {
        firstName: 'Jennifer',
        lastName: 'Williams',
        email: 'jennifer.williams@company.com',
        role: Role.COLLECTIONS,
      },
    }),
    prisma.user.create({
      data: {
        firstName: 'Michael',
        lastName: 'Brown',
        email: 'michael.brown@company.com',
        role: Role.LOGISTICS,
      },
    }),
  ]);

  const salesReps = [mainUser, ...users].filter(
    (user) => user.role === Role.SALES_REP,
  );

  // Create contacts
  console.log('Creating contacts...');
  const contacts = await Promise.all([
    prisma.contact.create({
      data: {
        name: 'John Smith',
        email: 'john.smith@megamart.com',
        phone: '(555) 111-1111',
        company: 'MegaMart Retail Corp',
      },
    }),
    prisma.contact.create({
      data: {
        name: 'Maria Garcia',
        email: 'maria.garcia@bluestar.com',
        phone: '(555) 222-2222',
        company: 'BlueStar Stores',
      },
    }),
    prisma.contact.create({
      data: {
        name: 'Robert Lee',
        email: 'robert.lee@bulkbuy.com',
        phone: '(555) 333-3333',
        company: 'BulkBuy Wholesale',
      },
    }),
    prisma.contact.create({
      data: {
        name: 'Jennifer Davis',
        email: 'jennifer.davis@freshchoice.com',
        phone: '(555) 444-4444',
        company: 'FreshChoice Markets',
      },
    }),
    prisma.contact.create({
      data: {
        name: 'Michael Brown',
        email: 'michael.brown@goldenvale.com',
        phone: '(555) 555-5555',
        company: 'Golden Vale Grocers',
      },
    }),
    prisma.contact.create({
      data: {
        name: 'Amanda Wilson',
        email: 'amanda.wilson@cornerstone.com',
        phone: '(555) 666-6666',
        company: 'Cornerstone Supermarkets',
      },
    }),
    prisma.contact.create({
      data: {
        name: 'Christopher Moore',
        email: 'chris.moore@primepick.com',
        phone: '(555) 777-7777',
        company: 'PrimePick Food Markets',
      },
    }),
    prisma.contact.create({
      data: {
        name: 'Jessica Taylor',
        email: 'jessica.taylor@greenbay.com',
        phone: '(555) 888-8888',
        company: 'Green Bay Organics',
      },
    }),
    prisma.contact.create({
      data: {
        name: 'Daniel Anderson',
        email: 'daniel.anderson@hometown.com',
        phone: '(555) 999-9999',
        company: 'Hometown Grocery Co',
      },
    }),
    prisma.contact.create({
      data: {
        name: 'Lauren Martinez',
        email: 'lauren.martinez@onestore.com',
        phone: '(555) 000-0000',
        company: 'OneStore Supercenters',
      },
    }),
    prisma.contact.create({
      data: {
        name: 'Kevin Johnson',
        email: 'kevin.johnson@alphafood.com',
        phone: '(555) 101-1010',
        company: 'Alpha Food Services',
      },
    }),
    prisma.contact.create({
      data: {
        name: 'Nicole White',
        email: 'nicole.white@deltafoods.com',
        phone: '(555) 202-2020',
        company: 'Delta Food Distribution',
      },
    }),
    prisma.contact.create({
      data: {
        name: 'Ryan Clark',
        email: 'ryan.clark@omega.com',
        phone: '(555) 303-3030',
        company: 'Omega Supply Group',
      },
    }),
    prisma.contact.create({
      data: {
        name: 'Stephanie Lewis',
        email: 'stephanie.lewis@northeast.com',
        phone: '(555) 404-4040',
        company: 'Northeast Food Partners',
      },
    }),
    prisma.contact.create({
      data: {
        name: 'Brandon Hall',
        email: 'brandon.hall@familyfood.com',
        phone: '(555) 505-5050',
        company: 'Family Food Services',
      },
    }),
  ]);

  // Create addresses
  console.log('Creating addresses...');
  const addresses = await Promise.all([
    prisma.address.create({
      data: {
        street: '702 SW 8th St',
        city: 'Bentonville',
        state: 'AR',
        zipCode: '72716',
        country: 'USA',
      },
    }),
    prisma.address.create({
      data: {
        street: '1000 Nicollet Mall',
        city: 'Minneapolis',
        state: 'MN',
        zipCode: '55403',
        country: 'USA',
      },
    }),
    prisma.address.create({
      data: {
        street: '999 Lake Dr',
        city: 'Issaquah',
        state: 'WA',
        zipCode: '98027',
        country: 'USA',
      },
    }),
    prisma.address.create({
      data: {
        street: '1014 Vine St',
        city: 'Cincinnati',
        state: 'OH',
        zipCode: '45202',
        country: 'USA',
      },
    }),
    prisma.address.create({
      data: {
        street: '5918 Stoneridge Mall Rd',
        city: 'Pleasanton',
        state: 'CA',
        zipCode: '94588',
        country: 'USA',
      },
    }),
    prisma.address.create({
      data: {
        street: '3300 Publix Corporate Pkwy',
        city: 'Lakeland',
        state: 'FL',
        zipCode: '33811',
        country: 'USA',
      },
    }),
    prisma.address.create({
      data: {
        street: '1500 Brooks Ave',
        city: 'Rochester',
        state: 'NY',
        zipCode: '14624',
        country: 'USA',
      },
    }),
    prisma.address.create({
      data: {
        street: '550 Bowie St',
        city: 'Austin',
        state: 'TX',
        zipCode: '78703',
        country: 'USA',
      },
    }),
    prisma.address.create({
      data: {
        street: '646 S Main St',
        city: 'San Antonio',
        state: 'TX',
        zipCode: '78204',
        country: 'USA',
      },
    }),
    prisma.address.create({
      data: {
        street: '2929 Walker Ave NW',
        city: 'Grand Rapids',
        state: 'MI',
        zipCode: '49544',
        country: 'USA',
      },
    }),
    prisma.address.create({
      data: {
        street: '1390 Enclave Pkwy',
        city: 'Houston',
        state: 'TX',
        zipCode: '77077',
        country: 'USA',
      },
    }),
    prisma.address.create({
      data: {
        street: '9399 W Higgins Rd',
        city: 'Rosemont',
        state: 'IL',
        zipCode: '60018',
        country: 'USA',
      },
    }),
    prisma.address.create({
      data: {
        street: '12500 Jefferson Ave',
        city: 'Newport News',
        state: 'VA',
        zipCode: '23602',
        country: 'USA',
      },
    }),
    prisma.address.create({
      data: {
        street: '715 SW Morrison St',
        city: 'Portland',
        state: 'OR',
        zipCode: '97205',
        country: 'USA',
      },
    }),
    prisma.address.create({
      data: {
        street: '1300 Torrey Hills Dr',
        city: 'La Jolla',
        state: 'CA',
        zipCode: '92037',
        country: 'USA',
      },
    }),
  ]);

  // Create accounts
  console.log('Creating accounts...');
  const accounts = await Promise.all([
    prisma.account.create({
      data: {
        name: 'MegaMart Retail Corp',
        description: 'Retail - Supermarket Chain',
        industry: 'Retail',
        creditLimit: 5000000.0,
        notes:
          'Major retail partner with high volume orders. Key account for household products.',
        salesRepId: salesReps[0].id,
        contactId: contacts[0].id,
        addressId: addresses[0].id,
        territoryId: territories[0].id,
      },
    }),
    prisma.account.create({
      data: {
        name: 'BlueStar Stores',
        description: 'Retail - Department Store',
        industry: 'Retail',
        creditLimit: 3500000.0,
        notes:
          'Premium retail partner focusing on quality household and personal care products.',
        salesRepId: salesReps[1].id,
        contactId: contacts[1].id,
        addressId: addresses[1].id,
        territoryId: territories[1].id,
      },
    }),
    prisma.account.create({
      data: {
        name: 'BulkBuy Wholesale',
        description: 'Retail - Warehouse Club',
        industry: 'Retail',
        creditLimit: 4000000.0,
        notes:
          'Bulk purchasing partner with focus on family-size products and value packs.',
        salesRepId: salesReps[2].id,
        contactId: contacts[2].id,
        addressId: addresses[2].id,
        territoryId: territories[2].id,
      },
    }),
    prisma.account.create({
      data: {
        name: 'FreshChoice Markets',
        description: 'Retail - Grocery Chain',
        industry: 'Retail',
        creditLimit: 2800000.0,
        notes:
          'Regional grocery chain with strong private label partnership opportunities.',
        salesRepId: salesReps[3].id,
        contactId: contacts[3].id,
        addressId: addresses[3].id,
        territoryId: territories[3].id,
      },
    }),
    prisma.account.create({
      data: {
        name: 'Golden Vale Grocers',
        description: 'Retail - Grocery Chain',
        industry: 'Retail',
        creditLimit: 2200000.0,
        notes:
          'West coast grocery chain with focus on premium and organic product lines.',
        salesRepId: salesReps[0].id,
        contactId: contacts[4].id,
        addressId: addresses[4].id,
        territoryId: territories[0].id,
      },
    }),
    prisma.account.create({
      data: {
        name: 'Cornerstone Supermarkets',
        description: 'Retail - Regional Grocery',
        industry: 'Retail',
        creditLimit: 1800000.0,
        notes:
          'Southeast regional grocery chain known for quality and customer service.',
        salesRepId: salesReps[1].id,
        contactId: contacts[5].id,
        addressId: addresses[5].id,
        territoryId: territories[1].id,
      },
    }),
    prisma.account.create({
      data: {
        name: 'PrimePick Food Markets',
        description: 'Retail - Premium Grocery',
        industry: 'Retail',
        creditLimit: 1500000.0,
        notes:
          'Premium grocery chain with focus on quality and prepared foods.',
        salesRepId: salesReps[2].id,
        contactId: contacts[6].id,
        addressId: addresses[6].id,
        territoryId: territories[2].id,
      },
    }),
    prisma.account.create({
      data: {
        name: 'Green Bay Organics',
        description: 'Retail - Organic Grocery',
        industry: 'Retail',
        creditLimit: 2000000.0,
        notes:
          'Organic and natural products retailer with high-end consumer base.',
        salesRepId: salesReps[3].id,
        contactId: contacts[7].id,
        addressId: addresses[7].id,
        territoryId: territories[3].id,
      },
    }),
    prisma.account.create({
      data: {
        name: 'Hometown Grocery Co',
        description: 'Retail - Regional Chain',
        industry: 'Retail',
        creditLimit: 1600000.0,
        notes: 'Texas-based grocery chain with strong local market presence.',
        salesRepId: salesReps[0].id,
        contactId: contacts[8].id,
        addressId: addresses[8].id,
        territoryId: territories[0].id,
      },
    }),
    prisma.account.create({
      data: {
        name: 'OneStore Supercenters',
        description: 'Retail - Supercenter',
        industry: 'Retail',
        creditLimit: 1400000.0,
        notes:
          'Midwest supercenter chain combining grocery and general merchandise.',
        salesRepId: salesReps[1].id,
        contactId: contacts[9].id,
        addressId: addresses[9].id,
        territoryId: territories[1].id,
      },
    }),
    prisma.account.create({
      data: {
        name: 'Alpha Food Services',
        description: 'Food Service - Distribution',
        industry: 'Food Service',
        creditLimit: 6000000.0,
        notes:
          'Largest foodservice distributor serving restaurants, hotels, and institutions.',
        salesRepId: salesReps[2].id,
        contactId: contacts[10].id,
        addressId: addresses[10].id,
        territoryId: territories[2].id,
      },
    }),
    prisma.account.create({
      data: {
        name: 'Delta Food Distribution',
        description: 'Food Service - Distribution',
        industry: 'Food Service',
        creditLimit: 4500000.0,
        notes:
          'Major foodservice distributor with strong restaurant and hospitality focus.',
        salesRepId: salesReps[3].id,
        contactId: contacts[11].id,
        addressId: addresses[11].id,
        territoryId: territories[3].id,
      },
    }),
    prisma.account.create({
      data: {
        name: 'Omega Supply Group',
        description: 'Food Service - Distribution',
        industry: 'Food Service',
        creditLimit: 3000000.0,
        notes:
          'Specialty foodservice distributor with convenience store and vending focus.',
        salesRepId: salesReps[0].id,
        contactId: contacts[12].id,
        addressId: addresses[12].id,
        territoryId: territories[0].id,
      },
    }),
    prisma.account.create({
      data: {
        name: 'Northeast Food Partners',
        description: 'Food Service - Regional Distributor',
        industry: 'Food Service',
        creditLimit: 1200000.0,
        notes:
          'Regional foodservice distributor serving upper midwest restaurant market.',
        salesRepId: salesReps[1].id,
        contactId: contacts[13].id,
        addressId: addresses[13].id,
        territoryId: territories[1].id,
      },
    }),
    prisma.account.create({
      data: {
        name: 'Family Food Services',
        description: 'Food Service - Distribution',
        industry: 'Food Service',
        creditLimit: 2500000.0,
        notes:
          'Family-owned foodservice distributor with strong regional presence.',
        salesRepId: salesReps[2].id,
        contactId: contacts[14].id,
        addressId: addresses[14].id,
        territoryId: territories[2].id,
      },
    }),
  ]);

  // Create ordering patterns
  console.log('Creating ordering patterns...');
  await Promise.all([
    prisma.orderingPattern.create({
      data: {
        frequency: 'Weekly',
        averageOrderValue: 125000.0,
        preferredOrderDay: 'Tuesday',
        seasonality: 'Steady year-round',
        accountId: accounts[0].id,
      },
    }),
    prisma.orderingPattern.create({
      data: {
        frequency: 'Bi-weekly',
        averageOrderValue: 85000.0,
        preferredOrderDay: 'Monday',
        seasonality: 'Higher in Q4',
        accountId: accounts[1].id,
      },
    }),
    prisma.orderingPattern.create({
      data: {
        frequency: 'Weekly',
        averageOrderValue: 95000.0,
        preferredOrderDay: 'Wednesday',
        seasonality: 'Seasonal peaks in summer',
        accountId: accounts[2].id,
      },
    }),
    prisma.orderingPattern.create({
      data: {
        frequency: 'Bi-weekly',
        averageOrderValue: 68000.0,
        preferredOrderDay: 'Thursday',
        seasonality: 'Steady with holiday spikes',
        accountId: accounts[3].id,
      },
    }),
    prisma.orderingPattern.create({
      data: {
        frequency: 'Weekly',
        averageOrderValue: 52000.0,
        preferredOrderDay: 'Tuesday',
        seasonality: 'Higher in winter months',
        accountId: accounts[4].id,
      },
    }),
    prisma.orderingPattern.create({
      data: {
        frequency: 'Monthly',
        averageOrderValue: 45000.0,
        preferredOrderDay: 'Friday',
        seasonality: 'Consistent year-round',
        accountId: accounts[5].id,
      },
    }),
    prisma.orderingPattern.create({
      data: {
        frequency: 'Bi-weekly',
        averageOrderValue: 38000.0,
        preferredOrderDay: 'Monday',
        seasonality: 'Peak during back-to-school',
        accountId: accounts[6].id,
      },
    }),
    prisma.orderingPattern.create({
      data: {
        frequency: 'Weekly',
        averageOrderValue: 48000.0,
        preferredOrderDay: 'Wednesday',
        seasonality: 'Organic trends drive seasonality',
        accountId: accounts[7].id,
      },
    }),
    prisma.orderingPattern.create({
      data: {
        frequency: 'Bi-weekly',
        averageOrderValue: 42000.0,
        preferredOrderDay: 'Tuesday',
        seasonality: 'Texas market steady growth',
        accountId: accounts[8].id,
      },
    }),
    prisma.orderingPattern.create({
      data: {
        frequency: 'Monthly',
        averageOrderValue: 35000.0,
        preferredOrderDay: 'Thursday',
        seasonality: 'Midwest seasonal patterns',
        accountId: accounts[9].id,
      },
    }),
    prisma.orderingPattern.create({
      data: {
        frequency: 'Weekly',
        averageOrderValue: 155000.0,
        preferredOrderDay: 'Monday',
        seasonality: 'Restaurant industry peaks',
        accountId: accounts[10].id,
      },
    }),
    prisma.orderingPattern.create({
      data: {
        frequency: 'Bi-weekly',
        averageOrderValue: 98000.0,
        preferredOrderDay: 'Wednesday',
        seasonality: 'Hospitality seasonal trends',
        accountId: accounts[11].id,
      },
    }),
    prisma.orderingPattern.create({
      data: {
        frequency: 'Weekly',
        averageOrderValue: 75000.0,
        preferredOrderDay: 'Tuesday',
        seasonality: 'Convenience store steady demand',
        accountId: accounts[12].id,
      },
    }),
    prisma.orderingPattern.create({
      data: {
        frequency: 'Monthly',
        averageOrderValue: 32000.0,
        preferredOrderDay: 'Friday',
        seasonality: 'Regional restaurant market',
        accountId: accounts[13].id,
      },
    }),
    prisma.orderingPattern.create({
      data: {
        frequency: 'Bi-weekly',
        averageOrderValue: 62000.0,
        preferredOrderDay: 'Thursday',
        seasonality: 'Family dining consistent orders',
        accountId: accounts[14].id,
      },
    }),
  ]);

  // Create categories
  console.log('Creating categories...');
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Food',
        description: 'Food and beverage products',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Home',
        description: 'Home care and cleaning products',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Personal Care',
        description: 'Personal hygiene and care products',
      },
    }),
  ]);

  // Create subcategories
  console.log('Creating subcategories...');
  const subcategories = await Promise.all([
    // Food subcategories
    prisma.subcategory.create({
      data: {
        name: 'Sauces',
        description: 'Condiments and sauces',
        categoryId: categories[0].id,
      },
    }),
    prisma.subcategory.create({
      data: {
        name: 'Dairy',
        description: 'Dairy products',
        categoryId: categories[0].id,
      },
    }),
    prisma.subcategory.create({
      data: {
        name: 'Beverages',
        description: 'Coffee and drinks',
        categoryId: categories[0].id,
      },
    }),
    prisma.subcategory.create({
      data: {
        name: 'Breakfast',
        description: 'Cereal and breakfast items',
        categoryId: categories[0].id,
      },
    }),
    prisma.subcategory.create({
      data: {
        name: 'Cooking Basics',
        description: 'Cooking essentials',
        categoryId: categories[0].id,
      },
    }),
    // Home subcategories
    prisma.subcategory.create({
      data: {
        name: 'Cleaning',
        description: 'Cleaning products',
        categoryId: categories[1].id,
      },
    }),
    prisma.subcategory.create({
      data: {
        name: 'Laundry',
        description: 'Laundry care products',
        categoryId: categories[1].id,
      },
    }),
    prisma.subcategory.create({
      data: {
        name: 'Kitchen',
        description: 'Kitchen cleaning products',
        categoryId: categories[1].id,
      },
    }),
    // Personal Care subcategories
    prisma.subcategory.create({
      data: {
        name: 'Oral Care',
        description: 'Dental hygiene products',
        categoryId: categories[2].id,
      },
    }),
    prisma.subcategory.create({
      data: {
        name: 'Body Care',
        description: 'Body hygiene products',
        categoryId: categories[2].id,
      },
    }),
    prisma.subcategory.create({
      data: {
        name: 'Skin Care',
        description: 'Skin care products',
        categoryId: categories[2].id,
      },
    }),
  ]);

  // Create products (sample of key products)
  console.log('Creating products...');
  const products = await Promise.all([
    // Food - Sauces (8 products)
    prisma.product.create({
      data: {
        sku: 'SAU001',
        name: 'RedGold Ketchup',
        description: 'Classic tomato ketchup',
        size: '32',
        unit: 'oz',
        price: 3.99,
        cost: 2.5,
        categoryId: categories[0].id,
        subcategoryId: subcategories[0].id,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'SAU002',
        name: 'Golden Valley Mustard',
        description: 'Classic yellow mustard',
        size: '20',
        unit: 'oz',
        price: 2.49,
        cost: 1.75,
        categoryId: categories[0].id,
        subcategoryId: subcategories[0].id,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'SAU003',
        name: 'Fire Dragon Hot Sauce',
        description: 'Original red pepper sauce',
        size: '5',
        unit: 'oz',
        price: 4.99,
        cost: 3.25,
        categoryId: categories[0].id,
        subcategoryId: subcategories[0].id,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'SAU004',
        name: 'Creamy Dream Mayo',
        description: 'Real mayonnaise',
        size: '30',
        unit: 'oz',
        price: 5.49,
        cost: 3.75,
        categoryId: categories[0].id,
        subcategoryId: subcategories[0].id,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'SAU005',
        name: 'Prime Cut Steak Sauce',
        description: 'Original steak sauce',
        size: '10',
        unit: 'oz',
        price: 3.79,
        cost: 2.25,
        categoryId: categories[0].id,
        subcategoryId: subcategories[0].id,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'SAU006',
        name: 'Master Chef Worcestershire',
        description: 'Original Worcestershire sauce',
        size: '10',
        unit: 'oz',
        price: 4.29,
        cost: 2.85,
        categoryId: categories[0].id,
        subcategoryId: subcategories[0].id,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'SAU007',
        name: 'Smoky Hills BBQ Sauce',
        description: 'Original barbecue sauce',
        size: '18',
        unit: 'oz',
        price: 2.99,
        cost: 1.95,
        categoryId: categories[0].id,
        subcategoryId: subcategories[0].id,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'SAU008',
        name: 'Spicy King Chili Sauce',
        description: 'Hot chili sauce',
        size: '17',
        unit: 'oz',
        price: 3.49,
        cost: 2.15,
        categoryId: categories[0].id,
        subcategoryId: subcategories[0].id,
      },
    }),
    // Food - Dairy (6 products)
    prisma.product.create({
      data: {
        sku: 'DAI001',
        name: 'Farm Fresh Butter',
        description: 'Salted sweet cream butter',
        size: '16',
        unit: 'oz',
        price: 4.99,
        cost: 3.25,
        categoryId: categories[0].id,
        subcategoryId: subcategories[1].id,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'DAI002',
        name: 'Alpine Creamery Butter',
        description: 'Unsalted European style butter',
        size: '16',
        unit: 'oz',
        price: 5.49,
        cost: 3.75,
        categoryId: categories[0].id,
        subcategoryId: subcategories[1].id,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'DAI003',
        name: 'Green Pasture Butter',
        description: 'Grass-fed butter',
        size: '8',
        unit: 'oz',
        price: 4.79,
        cost: 3.15,
        categoryId: categories[0].id,
        subcategoryId: subcategories[1].id,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'DAI004',
        name: 'Golden Spread',
        description: 'Vegetable oil spread',
        size: '15',
        unit: 'oz',
        price: 3.99,
        cost: 2.45,
        categoryId: categories[0].id,
        subcategoryId: subcategories[1].id,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'DAI005',
        name: 'Meadow Valley Spread',
        description: 'Original vegetable oil spread',
        size: '45',
        unit: 'oz',
        price: 4.29,
        cost: 2.75,
        categoryId: categories[0].id,
        subcategoryId: subcategories[1].id,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'DAI006',
        name: 'Healthy Choice Spread',
        description: 'Buttery spread with omega-3',
        size: '15',
        unit: 'oz',
        price: 4.99,
        cost: 3.25,
        categoryId: categories[0].id,
        subcategoryId: subcategories[1].id,
      },
    }),
    // Food - Beverages (8 products)
    prisma.product.create({
      data: {
        sku: 'BEV001',
        name: 'Morning Blend Coffee',
        description: 'Medium roast ground coffee',
        size: '30.5',
        unit: 'oz',
        price: 8.99,
        cost: 5.85,
        categoryId: categories[0].id,
        subcategoryId: subcategories[2].id,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'BEV002',
        name: 'Sunrise Roast Coffee',
        description: 'Original roast ground coffee',
        size: '30.6',
        unit: 'oz',
        price: 7.99,
        cost: 5.25,
        categoryId: categories[0].id,
        subcategoryId: subcategories[2].id,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'BEV003',
        name: 'Mountain Peak Coffee',
        description: 'Medium roast whole bean coffee',
        size: '12',
        unit: 'oz',
        price: 9.99,
        cost: 6.75,
        categoryId: categories[0].id,
        subcategoryId: subcategories[2].id,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'BEV004',
        name: 'Quick Brew Instant Coffee',
        description: 'Classic instant coffee',
        size: '8',
        unit: 'oz',
        price: 6.49,
        cost: 4.15,
        categoryId: categories[0].id,
        subcategoryId: subcategories[2].id,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'BEV005',
        name: 'City Roast Coffee',
        description: 'Medium roast ground coffee',
        size: '12',
        unit: 'oz',
        price: 8.49,
        cost: 5.55,
        categoryId: categories[0].id,
        subcategoryId: subcategories[2].id,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'BEV006',
        name: 'Highland Dark Roast',
        description: 'Dark roast K-cups',
        size: '24',
        unit: 'count',
        price: 12.99,
        cost: 8.75,
        categoryId: categories[0].id,
        subcategoryId: subcategories[2].id,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'BEV007',
        name: 'Royal Earl Grey Tea',
        description: 'Black tea with bergamot',
        size: '20',
        unit: 'bags',
        price: 4.99,
        cost: 3.25,
        categoryId: categories[0].id,
        subcategoryId: subcategories[2].id,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'BEV008',
        name: 'Classic Black Tea',
        description: 'Classic black tea bags',
        size: '100',
        unit: 'bags',
        price: 5.49,
        cost: 3.55,
        categoryId: categories[0].id,
        subcategoryId: subcategories[2].id,
      },
    }),
    // Food - Breakfast (8 products)
    prisma.product.create({
      data: {
        sku: 'BRK001',
        name: "Golden O's Cereal",
        description: 'Whole grain oat cereal',
        size: '18',
        unit: 'oz',
        price: 4.99,
        cost: 3.25,
        categoryId: categories[0].id,
        subcategoryId: subcategories[3].id,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'BRK002',
        name: 'Sugar Flakes',
        description: 'Sugar-frosted corn flakes',
        size: '24',
        unit: 'oz',
        price: 5.49,
        cost: 3.65,
        categoryId: categories[0].id,
        subcategoryId: subcategories[3].id,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'BRK003',
        name: 'Magic Stars Cereal',
        description: 'Frosted oats with marshmallows',
        size: '20.5',
        unit: 'oz',
        price: 5.99,
        cost: 3.95,
        categoryId: categories[0].id,
        subcategoryId: subcategories[3].id,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'BRK004',
        name: "Honey Nut O's",
        description: 'Sweetened whole grain oat cereal',
        size: '19.5',
        unit: 'oz',
        price: 5.29,
        cost: 3.45,
        categoryId: categories[0].id,
        subcategoryId: subcategories[3].id,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'BRK005',
        name: 'Choco Puffs',
        description: 'Chocolate flavored corn puffs',
        size: '18.1',
        unit: 'oz',
        price: 4.79,
        cost: 3.15,
        categoryId: categories[0].id,
        subcategoryId: subcategories[3].id,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'BRK006',
        name: 'Raisin Crunch',
        description: 'Bran flakes with raisins',
        size: '25.5',
        unit: 'oz',
        price: 5.99,
        cost: 3.95,
        categoryId: categories[0].id,
        subcategoryId: subcategories[3].id,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'BRK007',
        name: 'Country Oats',
        description: 'Old fashioned rolled oats',
        size: '42',
        unit: 'oz',
        price: 4.49,
        cost: 2.95,
        categoryId: categories[0].id,
        subcategoryId: subcategories[3].id,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'BRK008',
        name: 'Fluffy Stack Pancake Mix',
        description: 'Original pancake and waffle mix',
        size: '32',
        unit: 'oz',
        price: 3.99,
        cost: 2.65,
        categoryId: categories[0].id,
        subcategoryId: subcategories[3].id,
      },
    }),
    // Food - Cooking Basics (6 products)
    prisma.product.create({
      data: {
        sku: 'COO001',
        name: "Chef's Choice Chicken Bouillon",
        description: 'Chicken flavor bouillon cubes',
        size: '8',
        unit: 'cubes',
        price: 2.99,
        cost: 1.85,
        categoryId: categories[0].id,
        subcategoryId: subcategories[4].id,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'COO002',
        name: 'Savory Beef Bouillon',
        description: 'Beef flavor bouillon cubes',
        size: '8',
        unit: 'cubes',
        price: 2.99,
        cost: 1.85,
        categoryId: categories[0].id,
        subcategoryId: subcategories[4].id,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'COO003',
        name: 'Hearty Chicken Noodle Soup',
        description: 'Classic chicken noodle soup',
        size: '10.75',
        unit: 'oz',
        price: 1.49,
        cost: 0.95,
        categoryId: categories[0].id,
        subcategoryId: subcategories[4].id,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'COO004',
        name: 'Garden Tomato Soup',
        description: 'Creamy tomato soup',
        size: '19',
        unit: 'oz',
        price: 2.49,
        cost: 1.65,
        categoryId: categories[0].id,
        subcategoryId: subcategories[4].id,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'COO005',
        name: 'Farm Fresh Vegetable Soup',
        description: 'Mixed vegetable soup',
        size: '10.75',
        unit: 'oz',
        price: 1.49,
        cost: 0.95,
        categoryId: categories[0].id,
        subcategoryId: subcategories[4].id,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'COO006',
        name: 'Golden Onion Soup Mix',
        description: 'Dry onion soup and dip mix',
        size: '2',
        unit: 'oz',
        price: 1.99,
        cost: 1.25,
        categoryId: categories[0].id,
        subcategoryId: subcategories[4].id,
      },
    }),
    // Home - Cleaning (6 products)
    prisma.product.create({
      data: {
        sku: 'CLE001',
        name: 'Crystal Clear Dish Soap',
        description: 'Ultra dishwashing liquid',
        size: '19.4',
        unit: 'oz',
        price: 3.99,
        cost: 2.45,
        categoryId: categories[1].id,
        subcategoryId: subcategories[5].id,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'CLE002',
        name: 'Gentle Touch Dish Soap',
        description: 'Original dish liquid',
        size: '25',
        unit: 'oz',
        price: 2.99,
        cost: 1.85,
        categoryId: categories[1].id,
        subcategoryId: subcategories[5].id,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'CLE003',
        name: 'Super Clean Multi-Surface',
        description: 'All-purpose cleaner',
        size: '28',
        unit: 'oz',
        price: 4.49,
        cost: 2.95,
        categoryId: categories[1].id,
        subcategoryId: subcategories[5].id,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'CLE004',
        name: 'Sparkle Glass Cleaner',
        description: 'Original glass cleaner',
        size: '23',
        unit: 'oz',
        price: 3.79,
        cost: 2.35,
        categoryId: categories[1].id,
        subcategoryId: subcategories[5].id,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'CLE005',
        name: 'Fresh Guard Disinfectant Spray',
        description: 'Original disinfectant spray',
        size: '19',
        unit: 'oz',
        price: 5.99,
        cost: 3.95,
        categoryId: categories[1].id,
        subcategoryId: subcategories[5].id,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'CLE006',
        name: 'Forest Fresh Cleaner',
        description: 'Original multi-surface cleaner',
        size: '28',
        unit: 'oz',
        price: 3.49,
        cost: 2.15,
        categoryId: categories[1].id,
        subcategoryId: subcategories[5].id,
      },
    }),
    // Home - Laundry (4 products)
    prisma.product.create({
      data: {
        sku: 'LAU001',
        name: 'Ocean Breeze Liquid Detergent',
        description: 'Original scent liquid detergent',
        size: '50',
        unit: 'oz',
        price: 12.99,
        cost: 8.55,
        categoryId: categories[1].id,
        subcategoryId: subcategories[6].id,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'LAU002',
        name: 'Fresh Start Detergent',
        description: 'Original fresh scent',
        size: '75',
        unit: 'oz',
        price: 11.99,
        cost: 7.85,
        categoryId: categories[1].id,
        subcategoryId: subcategories[6].id,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'LAU003',
        name: 'Soft Touch Fabric Softener',
        description: 'Spring fresh fabric softener',
        size: '64',
        unit: 'oz',
        price: 4.99,
        cost: 3.25,
        categoryId: categories[1].id,
        subcategoryId: subcategories[6].id,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'LAU004',
        name: 'White Bright Bleach',
        description: 'Regular liquid bleach',
        size: '64',
        unit: 'oz',
        price: 3.49,
        cost: 2.15,
        categoryId: categories[1].id,
        subcategoryId: subcategories[6].id,
      },
    }),
    // Personal Care - Oral Care (6 products)
    prisma.product.create({
      data: {
        sku: 'ORA001',
        name: 'Bright Smile Toothpaste',
        description: 'Cavity protection toothpaste',
        size: '6.4',
        unit: 'oz',
        price: 3.99,
        cost: 2.45,
        categoryId: categories[2].id,
        subcategoryId: subcategories[8].id,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'ORA002',
        name: 'Pearl White Toothpaste',
        description: 'Advanced whitening toothpaste',
        size: '6',
        unit: 'oz',
        price: 4.49,
        cost: 2.95,
        categoryId: categories[2].id,
        subcategoryId: subcategories[8].id,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'ORA003',
        name: 'Gentle Care Toothpaste',
        description: 'Sensitive teeth toothpaste',
        size: '4',
        unit: 'oz',
        price: 5.99,
        cost: 3.95,
        categoryId: categories[2].id,
        subcategoryId: subcategories[8].id,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'ORA004',
        name: 'Fresh Mint Mouthwash',
        description: 'Cool mint antiseptic mouthwash',
        size: '16.9',
        unit: 'oz',
        price: 4.79,
        cost: 3.15,
        categoryId: categories[2].id,
        subcategoryId: subcategories[8].id,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'ORA005',
        name: 'Cavity Shield Mouthwash',
        description: 'Anticavity fluoride rinse',
        size: '18',
        unit: 'oz',
        price: 4.29,
        cost: 2.75,
        categoryId: categories[2].id,
        subcategoryId: subcategories[8].id,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'ORA006',
        name: 'Comfort Clean Toothbrush',
        description: 'Soft bristle toothbrush',
        size: '1',
        unit: 'count',
        price: 2.99,
        cost: 1.85,
        categoryId: categories[2].id,
        subcategoryId: subcategories[8].id,
      },
    }),
    // Personal Care - Body Care (6 products)
    prisma.product.create({
      data: {
        sku: 'BOD001',
        name: 'Classic Scent Deodorant',
        description: 'Original scent antiperspirant',
        size: '2.6',
        unit: 'oz',
        price: 4.99,
        cost: 3.25,
        categoryId: categories[2].id,
        subcategoryId: subcategories[9].id,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'BOD002',
        name: 'Gentle Care Deodorant',
        description: 'Original clean antiperspirant',
        size: '2.6',
        unit: 'oz',
        price: 4.49,
        cost: 2.95,
        categoryId: categories[2].id,
        subcategoryId: subcategories[9].id,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'BOD003',
        name: 'Invisible Shield Deodorant',
        description: 'Invisible solid antiperspirant',
        size: '2.6',
        unit: 'oz',
        price: 4.29,
        cost: 2.75,
        categoryId: categories[2].id,
        subcategoryId: subcategories[9].id,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'BOD004',
        name: 'Active Sport Body Spray',
        description: 'Fresh sport body spray',
        size: '4',
        unit: 'oz',
        price: 3.99,
        cost: 2.45,
        categoryId: categories[2].id,
        subcategoryId: subcategories[9].id,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'BOD005',
        name: 'Mountain Fresh Soap',
        description: 'Original bar soap',
        size: '3.75',
        unit: 'oz',
        price: 1.49,
        cost: 0.95,
        categoryId: categories[2].id,
        subcategoryId: subcategories[9].id,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'BOD006',
        name: 'Silky Smooth Beauty Bar',
        description: 'Original beauty bar',
        size: '4.75',
        unit: 'oz',
        price: 1.99,
        cost: 1.25,
        categoryId: categories[2].id,
        subcategoryId: subcategories[9].id,
      },
    }),
    // Personal Care - Skin Care (4 products)
    prisma.product.create({
      data: {
        sku: 'SKI001',
        name: 'Smooth Silk Body Lotion',
        description: 'Essentially enriched body lotion',
        size: '16.9',
        unit: 'oz',
        price: 6.99,
        cost: 4.55,
        categoryId: categories[2].id,
        subcategoryId: subcategories[10].id,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'SKI002',
        name: 'Healing Touch Petroleum Jelly',
        description: 'Original healing jelly',
        size: '13',
        unit: 'oz',
        price: 4.49,
        cost: 2.95,
        categoryId: categories[2].id,
        subcategoryId: subcategories[10].id,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'SKI003',
        name: 'Sun Shield Daily Protection',
        description: 'Face lotion with SPF 30',
        size: '4',
        unit: 'oz',
        price: 8.99,
        cost: 5.85,
        categoryId: categories[2].id,
        subcategoryId: subcategories[10].id,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'SKI004',
        name: "Nature's Touch Daily Moisturizer",
        description: 'Daily moisturizing lotion',
        size: '18',
        unit: 'oz',
        price: 7.99,
        cost: 5.25,
        categoryId: categories[2].id,
        subcategoryId: subcategories[10].id,
      },
    }),
  ]);

  console.log('Database seeding completed successfully!');
  console.log(`Created ${territories.length} territories`);
  console.log(`Created ${users.length} users`);
  console.log(`Created ${contacts.length} contacts`);
  console.log(`Created ${addresses.length} addresses`);
  console.log(`Created ${accounts.length} accounts`);
  console.log(`Created ${categories.length} categories`);
  console.log(`Created ${subcategories.length} subcategories`);
  console.log(`Created ${products.length} products`);
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
