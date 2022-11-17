require('dotenv').config()

module.exports=
{
  "development": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASS,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST, 
    "port": process.env.DB_PORT,
    "dialect": process.env.DB_DIALECT
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "production": {
    "username": "postgres",
    "password": "1234",
    "database": "DB_FP_2_production",
    "host": "127.0.0.1",
    "dialect": "postgres"
  }
}
