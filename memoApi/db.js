import pg from 'pg';
import dotenv from 'dotenv';    

dotenv.config();

const { Pool } = pg;    
const pool = new Pool({ 
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

pool.connect((err, client, release) => {
    if(err) {
        return console.log(err.message);
    }
    else{
        console.log("DB connected successfully");
        release(); 
    }
});


export default pool;