import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupDatabase() {
  console.log('🔄 Setting up MySQL database schema and seeds...');
  try {
    const mysqlModule = await import('mysql2/promise').catch(() => null);
    if (!mysqlModule) {
      console.error('❌ mysql2 is not installed. Run: npm install mysql2');
      process.exit(1);
    }

    const mysql = mysqlModule.default || mysqlModule;
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true
    });

    console.log('✅ Connected to MySQL server.');

    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    const seedSql = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');

    console.log('⚙️ Executing schema.sql...');
    await connection.query(schemaSql);
    console.log('✅ Tables created successfully.');

    console.log('🌱 Executing seed.sql...');
    await connection.query(seedSql);
    console.log('✅ Seed data inserted successfully.');

    await connection.end();
    console.log('🎉 MySQL setup completed successfully for database "exam_portal"!');
  } catch (err) {
    console.error('❌ Database setup failed:', err.message);
    process.exit(1);
  }
}

setupDatabase();
