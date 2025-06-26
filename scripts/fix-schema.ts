import { pool } from '../server/db';

async function fixSchema() {
  const client = await pool.connect();
  
  try {
    console.log('Fixing schema by removing username column...');
    
    // Drop username column since we're using email now
    await client.query('ALTER TABLE users DROP COLUMN IF EXISTS username');
    
    console.log('✅ Username column removed');
    console.log('✅ Schema fix completed');
    
  } catch (error) {
    console.error('❌ Schema fix failed:', error);
  } finally {
    client.release();
  }
}

fixSchema();