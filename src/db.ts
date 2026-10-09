import 'dotenv/config';
import { Sequelize } from 'sequelize';

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL nao definida');

export const sequelize = new Sequelize(url, {
  dialect: 'postgres',
  define: {
    timestamps: false, // o schema nao tem created_at/updated_at
  },
});
