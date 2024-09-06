import Jwt from "jsonwebtoken";
import getToken from "./get-token.js";

const checkToken = (request, response, next) => {
    if(!request.headers.authorization){
        response.status(401).json({message: "acesso negado"});
        return;
    }

    //buscar o usuario que está logado
    const token = getToken(request)
    if (!token) {
        response.status(401).json({message: "acesso negado"});
        return;
    }
    try {
        const verificado = Jwt.verify(token, "SENHASUPERSEGURA")
        request.user = verificado;
        next();
    } catch (error) {
        return response.status(400).json({message: "Token Inválido"})
    }
};

export default checkToken;
