import mysql from 'mysql2/promise';
import { databaseConfig } from '../config/configuration.js';

export const pool = mysql.createPool({
  host: databaseConfig.host,
  user: databaseConfig.user,
  database: databaseConfig.database,
});

export const secretKey = 'imtxCanGetOffer';
