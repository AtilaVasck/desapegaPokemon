import conn from "../config/connectionDB.js";

const tableUser = /*sql*/`
   CREATE TABLE IF NOT EXISTS users(
      user_id VARCHAR(60) PRIMARY KEY,
      nome VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      telefone VARCHAR(50) NOT NULL,
      senha VARCHAR(255) NOT NULL,
      imagem VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   )
`

conn.query(tableUser, (err, results, fields) => {
   if(err){
      return console.error(err);
   }
   console.log("Tabela [usuarios] criada com sucesso!");
});