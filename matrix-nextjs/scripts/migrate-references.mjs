import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrate() {
  try {
    console.log('Starting migration...');

    // Check if slug column exists
    const columns = await prisma.$queryRaw`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'references' AND COLUMN_NAME = 'slug'
    `;

    if (!columns || columns.length === 0) {
      console.log('Adding slug column...');
      await prisma.$executeRawUnsafe(`
        ALTER TABLE \`references\`
        ADD COLUMN \`slug\` VARCHAR(200) AFTER \`company_name\`
      `);
    }

    // Update existing rows with slug from company_name
    console.log('Updating existing slugs...');
    await prisma.$executeRawUnsafe(`
      UPDATE \`references\`
      SET \`slug\` = LOWER(REPLACE(REPLACE(REPLACE(\`company_name\`, ' ', '-'), '.', ''), ',', ''))
      WHERE \`slug\` IS NULL OR \`slug\` = ''
    `);

    // Modify slug to NOT NULL and add unique index
    console.log('Making slug NOT NULL and unique...');
    await prisma.$executeRawUnsafe(`
      ALTER TABLE \`references\` MODIFY COLUMN \`slug\` VARCHAR(200) NOT NULL
    `);

    // Add unique index on slug (ignore if exists)
    try {
      await prisma.$executeRawUnsafe(`
        ALTER TABLE \`references\` ADD UNIQUE INDEX \`references_slug_key\` (\`slug\`)
      `);
    } catch (e) {
      console.log('Unique index might already exist, continuing...');
    }

    // Add gallery_mode column if not exists
    const galleryCol = await prisma.$queryRaw`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'references' AND COLUMN_NAME = 'gallery_mode'
    `;

    if (!galleryCol || galleryCol.length === 0) {
      console.log('Adding gallery_mode column...');
      await prisma.$executeRawUnsafe(`
        ALTER TABLE \`references\`
        ADD COLUMN \`gallery_mode\` VARCHAR(20) DEFAULT 'grid' AFTER \`is_active\`
      `);
    }

    // Add meta_title column if not exists
    const metaTitleCol = await prisma.$queryRaw`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'references' AND COLUMN_NAME = 'meta_title'
    `;

    if (!metaTitleCol || metaTitleCol.length === 0) {
      console.log('Adding meta_title column...');
      await prisma.$executeRawUnsafe(`
        ALTER TABLE \`references\`
        ADD COLUMN \`meta_title\` VARCHAR(70) AFTER \`gallery_mode\`
      `);
    }

    // Add meta_description column if not exists
    const metaDescCol = await prisma.$queryRaw`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'references' AND COLUMN_NAME = 'meta_description'
    `;

    if (!metaDescCol || metaDescCol.length === 0) {
      console.log('Adding meta_description column...');
      await prisma.$executeRawUnsafe(`
        ALTER TABLE \`references\`
        ADD COLUMN \`meta_description\` VARCHAR(160) AFTER \`meta_title\`
      `);
    }

    // Create reference_categories table
    console.log('Creating reference_categories table...');
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS \`reference_categories\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`name\` VARCHAR(100) NOT NULL,
        \`slug\` VARCHAR(100) NOT NULL,
        \`description\` TEXT,
        \`color\` VARCHAR(7),
        \`icon\` VARCHAR(50),
        \`sort_order\` INT DEFAULT 0,
        \`is_active\` BOOLEAN DEFAULT TRUE,
        \`meta_title\` VARCHAR(70),
        \`meta_description\` VARCHAR(160),
        \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`reference_categories_slug_key\` (\`slug\`)
      )
    `);

    // Create reference_to_categories junction table
    console.log('Creating reference_to_categories table...');
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS \`reference_to_categories\` (
        \`reference_id\` INT NOT NULL,
        \`category_id\` INT NOT NULL,
        PRIMARY KEY (\`reference_id\`, \`category_id\`),
        CONSTRAINT \`ref_to_cat_ref_fk\` FOREIGN KEY (\`reference_id\`) REFERENCES \`references\` (\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`ref_to_cat_cat_fk\` FOREIGN KEY (\`category_id\`) REFERENCES \`reference_categories\` (\`id\`) ON DELETE CASCADE
      )
    `);

    // Create reference_images table
    console.log('Creating reference_images table...');
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS \`reference_images\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`reference_id\` INT NOT NULL,
        \`path\` VARCHAR(500) NOT NULL,
        \`alt\` VARCHAR(255),
        \`caption\` TEXT,
        \`sort_order\` INT DEFAULT 0,
        \`width\` INT,
        \`height\` INT,
        \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        KEY \`reference_images_reference_id_idx\` (\`reference_id\`),
        CONSTRAINT \`ref_images_ref_fk\` FOREIGN KEY (\`reference_id\`) REFERENCES \`references\` (\`id\`) ON DELETE CASCADE
      )
    `);

    // Create contact_messages table
    console.log('Creating contact_messages table...');
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS \`contact_messages\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`first_name\` VARCHAR(50) NOT NULL,
        \`last_name\` VARCHAR(50) NOT NULL,
        \`email\` VARCHAR(254) NOT NULL,
        \`phone\` VARCHAR(20),
        \`message\` TEXT NOT NULL,
        \`is_read\` BOOLEAN DEFAULT FALSE,
        \`is_archived\` BOOLEAN DEFAULT FALSE,
        \`ip_address\` VARCHAR(45),
        \`user_agent\` VARCHAR(500),
        \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        KEY \`contact_messages_is_read_idx\` (\`is_read\`),
        KEY \`contact_messages_created_at_idx\` (\`created_at\`)
      )
    `);

    console.log('Migration completed successfully!');
  } catch (e) {
    console.error('Migration error:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

migrate();
