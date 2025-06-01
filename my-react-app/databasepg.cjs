const { Client } = require("pg");
const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "kiet",
    database: "quan_li_rung",
});
client.connect();
// client.query(`SELECT * FROM lamnghiep.doituong`, (err, res) => {
//     if (!err) {
//         console.log(res.rows);
//     } else {
//         console.log(err.message);
//     }
//     client.end;
// });
client.query(`SELECT * FROM nguongoc.rung`, (err, res) => {
    if (!err) {
        console.log(res.rows);
    } else {
        console.log(err.message);
    }
    client.end;
});
