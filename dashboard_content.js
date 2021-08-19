
const {Pool} = require('pg')
/*
const x =  function(){
    console.log("inside calling file")
    
    pool.query(
        `select * from admin`,
        (err,results) =>{
            if(err)
                throw err;
            if(results.rows.length> 0){
                const data1 = results.rows; 
                console.log(data1); 
                return data1;   
            }
        }
    );
}
module.exports=x;
*/
const result = async() =>{
;
    const pool = new Pool({
        host : 'localhost',
        port : '5432',
        user :'postgres',
        password :'root',
        database :'Go_Local',
        max : 20,
        connectionTimeoutMillis : 0,
        idleTimeoutMillis: 0
    });

    const results =  pool.query("select * from admin");
    const r = results.rows;
    console.table(results.rows)
  // console.log()
   //console.table(results.rows);
    return  "ehlll";
}

module.exports ={
    result : result
}

/*

*/
