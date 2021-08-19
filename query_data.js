const { pool } = require("./dbConfig");

const fun = require('./dashboard_content');

const d = fun.result();
console.log("inside the query file.....................")
console.log(d);