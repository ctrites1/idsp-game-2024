import mysql from "mysql2/promise";

const dbConfigDev = {
  host: "sql.freedb.tech",
  user: "freedb_db_dev",
  password: "%6zbG!Wcp@TMBPh",
  database: "freedb_acg-db",
  multipleStatements: false,
};

export const database = mysql.createPool(dbConfigDev);
