import conn from "../config/connectionDB.js";
import jwt from "jsonwebtoken"

const getUserByToken = async (token) => {
    return new Promise((resolve, reject) => {
        if (!token) {
            response.status(401).json({message:"Acesso ligado"});
            return;
        }
        const decoded = jwt.verify(token, "SENHASUPERSEGURA")
        const user_id = decoded.id
        const checkSql = /*sql*/`
        SELECT * FROM usuarios WHERE ?? = ?`
        const checkSqlData = ["usuario_id", user_id];
        conn.query(checkSql, checkSqlData, (err, data) => {
            if (err) {
                reject({status: 500, message: "Erro ao buscar usuario"});
            } else {
                resolve(data[0]);
            }
        });
    });
}

export default getUserByToken;