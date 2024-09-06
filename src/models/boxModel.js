import conn from "../config/connectionDB.js";

const tableBox = /*sql*/`
    CREATE TABLE IF NOT EXISTS pokemon(
        box_id VARCHAR(60) PRIMARY KEY,
        nomeBox VARCHAR(255) NOT NULL,
        preco VARCHAR(255) NOT NULL,
        cartaCromada VARCHAR(50) NOT NULL,
        QuantidadeCartas VARCHAR(255) NOT NULL,
        AnoProducao VARCHAR(255) NOT NULL,
        imagem VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
`

conn.query(tableBox, (err, results, fields) => {
    if(err){
        return console.error(err);
    }
    console.log("Tabela [boxPoke] criada com sucesso!");
});