import { Sequelize	 } from "sequelize";
import dotenv from 'dotenv';
dotenv.config({path:'.env'})

const db = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS ?? '',
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        define: {
            timestamps: true
        },
        pool: {
            max: 5, // 5 conexiones máximas por usuario
            min: 0,
            acquire: 30000, // Trata de elaborar una conexión en 30 segundos
            idle: 10000 // 10 segundos para que la conexión finalice si ya no hay interacción
        },
        //operatorsAliases: false
    }
);

export default db;