import jwt from "jsonwebtoken"

const createUserToken = async (user, request, response) => {
    //criar o token

    const token = jwt.sign(
      { 
        name: user.nome,
        id: user.user_id
      },
      "SENHASUPERSEGURA",//Senha de criptografia
    );
   //retornar o token
    response.status(200).json({
        message: "Você está autenticado",
        token: token,
        userId: user.user_id,
    });
}

export default createUserToken;
