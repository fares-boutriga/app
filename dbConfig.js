import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();
// Configure MySQL connection
let pool;
const connectMySQL = async () => {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
    console.log("MySQL connection pool created.");
  }
  return pool;
};

// Create tables in MySQL
const createTables = async (connection) => {
  const queries = [
    // Schema creation (optional if already exists)
    `CREATE DATABASE IF NOT EXISTS \`${process.env.MYSQL_DATABASE}\` DEFAULT CHARACTER SET utf8;`,
    `USE \`${process.env.MYSQL_DATABASE}\`;`,

    // Table: projet
    `CREATE TABLE IF NOT EXISTS projet (
      id INT NOT NULL AUTO_INCREMENT,
      nom VARCHAR(45) NULL,
      nom_client VARCHAR(255) NULL,
      tele VARCHAR(45) NULL,
      user_added INT NULL,
      date_added DATE NULL,
      user_edit INT NULL,
      date_updated DATE NULL,
      deleted TINYINT NOT NULL DEFAULT 0,
      deleted_by INT NULL,
      date_deleted DATE NULL,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB;`,

    // Table: responsable
    `CREATE TABLE IF NOT EXISTS responsable (
      id INT NOT NULL AUTO_INCREMENT,
      nom VARCHAR(45) NULL,
      tele VARCHAR(45) NULL,
      user_added INT NULL,
      date_added DATE NULL,
      user_edit INT NULL,
      date_updated DATE NULL,
      deleted TINYINT NOT NULL DEFAULT 0,
      deleted_by INT NULL,
      date_deleted DATE NULL,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB;`,

    // Table: projet_has_responsable
    `CREATE TABLE IF NOT EXISTS projet_has_responsable (
      projet_id INT NOT NULL,
      responsable_id INT NOT NULL,
      PRIMARY KEY (projet_id, responsable_id),
      INDEX fk_projet_has_responsable_responsable1_idx (responsable_id),
      INDEX fk_projet_has_responsable_projet_idx (projet_id),
      CONSTRAINT fk_projet_has_responsable_projet
        FOREIGN KEY (projet_id)
        REFERENCES projet (id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
      CONSTRAINT fk_projet_has_responsable_responsable1
        FOREIGN KEY (responsable_id)
        REFERENCES responsable (id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
    ) ENGINE=InnoDB;`,
  ];

  for (const query of queries) {
    try {
      await connection.execute(query);
      console.log("Executed query successfully.");
    } catch (err) {
      console.error("Error executing query:", err.message);
    }
  }
};

// Initialize MySQL and create tables
const initialize = async () => {
  const connection = await connectMySQL();
  await createTables(connection);
};

initialize();
export default  connectMySQL;
