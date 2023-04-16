import { Sequelize	 } from "sequelize";

const db = new Sequelize(
    'bienesraices_node_mvc',
    'root',
    'root',
    {
        host: 'localhost',
        port: 3306,
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