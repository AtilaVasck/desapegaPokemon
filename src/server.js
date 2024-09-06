/*
MODEL -> DB BD -> Regras de negócio.
CONTROLLER -> Controla o que vem da view e devolve o que vem do model.
VIEW -> Páginas.
*/
import "dotenv/config";
import express from "express";
import cors from "cors";

//importar conexão com o banco
import conn from "./config/connectionDB.js";

//importar modulos
import "./models/userModel.js"
import "./models/boxModel.js"
//importar as rotas
import userRouter from "./routes/userRouter.js";

const PORT = process.env.PORT || 3333
const app = express()

// 3 middleware
app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())

//utilizar rotas
app.use("/users", userRouter)

app.use((request, response) => {
    response.status(404).json({ message: "Rota não encontrada." })
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
});

/*
usuario -> mini mundo 
[POST] - cad. user
[POST] - çogin
[GET] - user logado
[] -
[] -
*/