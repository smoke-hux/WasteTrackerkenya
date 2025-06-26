import { pool } from '../server/db';

async function migrateSchema() {
  const client = await pool.connect();
  
  try {
    console.log('Starting schema migration...');
    
    // Check if email column exists
    const emailColumnExists = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='users' AND column_name='email'
    `);
    
    if (emailColumnExists.rows.length === 0) {
      console.log('Adding email column...');
      
      // Add email column
      await client.query('ALTER TABLE users ADD COLUMN email text');
      
      // Copy username to email (temporary)
      await client.query('UPDATE users SET email = username WHERE email IS NULL');
      
      // Make email not null and unique
      await client.query('ALTER TABLE users ALTER COLUMN email SET NOT NULL');
      await client.query('ALTER TABLE users ADD CONSTRAINT users_email_unique UNIQUE(email)');
      
      console.log('✅ Email column added');
    } else {
      console.log('Email column already exists');
    }
    
    // Check if new columns exist and add them
    const newColumns = [
      { name: 'is_active', type: 'boolean DEFAULT true' },
      { name: 'last_login_at', type: 'timestamp' },
      { name: 'updated_at', type: 'timestamp DEFAULT now()' }
    ];
    
    for (const column of newColumns) {
      const columnExists = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='users' AND column_name='${column.name}'
      `);
      
      if (columnExists.rows.length === 0) {
        console.log(`Adding ${column.name} column...`);
        await client.query(`ALTER TABLE users ADD COLUMN ${column.name} ${column.type}`);
        console.log(`✅ ${column.name} column added`);
      }
    }
    
    console.log('✅ Schema migration completed');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    client.release();
  }
}

migrateSchema();