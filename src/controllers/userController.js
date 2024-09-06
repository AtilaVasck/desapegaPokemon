import conn from "../config/connectionDB.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { response } from "express";
import jwt from "jsonwebtoken";
//helpers
import createUserToken from "../helpers/create-user-token.js";
import getToken from "../helpers/get-token.js";
import getUserByToken from "../helpers/get-user-by-token.js";

export const listProducts = async (request, response) =>{
    const boxId = request.params.id; //ID da box
    const userSql = /*sql*/`SELECT box_id, nomeBox, preco, cartaCromada, QuantidadeCartas, AnoProducao, imagem FROM pokemon WHERE ?? = ?`;
    const userSqlData = ['box_id', boxId];
    conn.query(userSql, userSqlData, async (err, data) => {
        if (err) {
            console.log(err);
            response.status(500).json({ error: 'Erro ao buscar box' });
            return;
        }
        if (data.length === 0) {
            response.status(404).json({ message: 'Box não encontrado' }); 
            return;
        } 
        const user = data[0];
        response.status(200).json(pokemon)
    });
};

export const registering = (request, response) => {
    const { nomeBox, preco, cartaCromada, QuantidadeCartas, AnoProducao } = request.body
    if (!nomeBox) {
        return response.status(400).json({ error: 'o campo nome da caixa é obrigatório' });
    }
    if (!preco) {
        return response.status(400).json({ error: 'o campo preço é obrigatório' });
    }
    if (!cartaCromada) {
        return response.status(400).json({ error: 'o campo carta cromada é obrigatório' });
    }
    if (!QuantidadeCartas) {
        return response.status(400).json({ error: 'O campo quantidades de cartas é obrigatório' });
    }
    if (!AnoProducao) {
        return response.status(400).json({ error: 'O campo ano de produção é obrigatório' });
    }

    try {
        const newBox = {
            id: uuidv4(),
            nomeBox,
            preco,
            cartaCromada,
            QuantidadeCartas,
            AnoProducao,
            imagem,
            userId: request.user.id
        };

        const sql = /*sql*/`INSERT INTO pokemon SET ?`;
        conn.query(sql, newBox, (err, result) => {
            if (err) {
                console.log(err);
                return response.status(500).json({ error: 'Erro ao cadastrar a box' });
            }
            response.status(201).json({ message: 'Box cadastrada com sucesso!', boxId: result.insertId });
        });
    } catch (error) {
        response.status(500).json({ error: 'Erro ao processar requisição' });
    }
};

export const register = (request, response) => {
    const { nome, email, telefone, senha, confirmaSenha } = request.body
    if (!nome) {
        return response.status(400).json({ error: 'o campo nome é obrigatório' });
    }
    if (!email) {
        return response.status(400).json({ error: 'o campo email é obrigatório' });
    }
    if (!telefone) {
        return response.status(400).json({ error: 'o campo telefone é obrigatório' });
    }
    if (!senha) {
        return response.status(400).json({ error: 'O campo senha é obrigatório' });
    }
    if (!confirmaSenha) {
        return response.status(404).json({ error: 'O campo confirmar senha é obrigatório' });
    }
    //verifucar se email é valido
    if (!email.includes("@")) {
        return response.status(409).json({ error: 'Digite um email válido com @' });
    }
    //senha === confirmaSenha
    if (senha !== confirmaSenha) {
        return response.status(409).json({ error: 'A senha e a confirmação de senha devem ser iguais' });
    }

    const checkSql = /*sql*/`SELECT * FROM users WHERE ?? = ?`
    const checkSqlData = ['email', email];
    conn.query(checkSql, checkSqlData, async (err, data) => {
        if (err) {
            console.log(err)
            return response.status(500).json({ error: 'Erro ao verificar se o email já existe' });
        }
        //2°
        if (data.length > 0) {
            return response.status(409).json({ error: 'Email já está em uso.' })
        }
        //Posso fazer o registro
        const salt = await bcrypt.genSalt(12)
        // console.log(salt)
        const senhaHash = await bcrypt.hash(senha, salt)
        // console.log("Senha digitada:", senha)
        // console.log("Senha criptografada:", senhaHash)

        //criar user
        const id = uuidv4();
        const user_img = "userDafault.png"

        const insertSql = /*sql*/`INSERT INTO users (??, ??, ??, ??, ??, ??)
    VALUES (?, ?, ?, ?, ?, ?)`
        const insertSqlData = ["user_id", "nome", "email", "telefone", "senha", "imagem",
            id, nome, email, telefone, senhaHash, user_img];

        conn.query(insertSql, insertSqlData, (err) => {
            if (err) {
                console.log(err)
                return response.status(500).json({ error: 'Erro ao cadastrar usuário' })
            }
        //1° criar token
        //2° passar o token para o front-end    
        const userSql = /*sql*/`SELECT * FROM users WHERE ?? = ?` 
        const userSqlData = ['user_id', id];
        conn.query(userSql, userSqlData, async (err, data) => {
            if (err) {
                console.log(err)
                return response.status(500).json({ error: 'Erro ao fazer login' })
            }
            const user = data[0]

            try{
                await createUserToken(user, request, response)
            } catch (error){ 
                console.log(error)
                response.status(500).json({ err: "Erro ao processar requisição"})
            }
        
        })
            // response.status(201).json({ message: "Usuário cadastrado" })
        })
    })
};

export const login = (request, response) => {
    const { email, senha } = request.body;
    if (!email) {
        return response.status(409).json({ error: 'O campo email é obrigatório' })
    }
    if (!senha) {
        return response.status(409).json({ error: 'O campo senha é obrigatório' })
    }

    const checkEmailSql = /*sql*/`SELECT * FROM users WHERE ?? = ?`
    const checkEmailSqlData = ['email', email];
    conn.query(checkEmailSql, checkEmailSqlData,  async (err, data) => {
        if (err) {
            console.log(err)
            return response.status(500).json({ error: 'Erro ao fazer login' })
        }
        if (data.length === 0) {
            return response.status(401).json({ error: 'Email não está cadastrado' })
        }
        const user = data[0]
        console.log(user.senha)

        //comparar senha
        const comparaSenha = await bcrypt.compare(senha, user.senha)
        console.log("compara senha", comparaSenha)//boolean

        if(!comparaSenha){
            return response.status(401).json({ error: 'Senha inválida' })
        }

        //1 criar um token
        try{
            await createUserToken(user, request, response)
        } catch (error) {
            console.log(error)
            response.status(500).json({ err: "Erro ao processar informações"})
        }
        response.status(200).json( {message: "Você está logado."} )
    })

};

// checkUser -> verificar os users logados na aplicação
export const checkUser = async (request, response) => {
    let userAtual;
    if(request.headers.authorization){
        //extrair o token -> barear TOKEN
        const token = getToken(request)
        console.log(token)
        //descriptografar o token jwt.decode
        const decoded = jwt.decode(token, "SENHASUPERSEGURA")
        console.log(decoded)

        const userId = decoded.id
        const selectSql = /*sql*/`SELECT nome, email, telefone, imagem FROM users WHERE ?? = ?`
        const selectSqlData = ['user_id', userId];
        conn.query(selectSql, selectSqlData, async (err, data) => {
        if(err){
            console.log(err)
            return response.status(500).json({ error: 'Erro ao verificar usuário' })
        }
        userAtual = data[0]
        response.status(200).json(userAtual)
        })
    }else{
        userAtual = null
        response.status(200).json(userAtual)
    }
}
// getUserById -> verificar user
export const getUserById = async (request, response) => {
    const userId = request.params.id; //ID do usuário
        const userSql = /*sql*/`SELECT usuario_id, nome, email, telefone, imagem FROM usuarios WHERE ?? = ?`;
        const userSqlData = ['user_id', userId];
        
        conn.query(userSql, userSqlData, async (err, data) => {
            if (err) {
                console.log(err);
                response.status(500).json({ error: 'Erro ao buscar usuário' });
                return;
            }
            if (data.length === 0) {
                response.status(404).json({ message: 'Usuário não encontrado' }); 
                return;
            } 
            const user = data[0];
            response.status(200).json(usuario)
        });
    }
// editUser -> controlador protegido, contém imagem de user
export const editUser = async (request, response) => {
    const {id} = request.params

    try {
        const token = getToken(request);
        const user = await getUserByToken(token);

    } catch (error) {
        
    }
}