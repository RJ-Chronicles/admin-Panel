require("dotenv").config();

const{Pool} = require("pg");
const isProduction = process.env.NODE_ENV === "production";

const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

const pool = new Pool({
    connectionString: isProduction ? process.env.DATABASE_URL :connectionString
});

module.exports = {pool}


/*
const{Client} = require('pg');

const client = new Client({
    host :"localhost",
    port : 5432,
    user :"postgres",
    password: "root",
    database: "Go_Local"
});

client.connect(err => {
    if (err) {
      console.error('connection error', err.stack)
    } else {
      console.log('connected')
    }
  })

client.query(`select * from admin`, (err,result) =>{
    if(!err){
        console.log(result.rows);

    }else{
        throw err;
    }
    client.end();
})*/