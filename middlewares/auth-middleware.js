const { verify } = require("./../helpers/jwt")
const { User } = require("./../models/index")


async function authenticationMiddleware(req, res, next) {
    // const { authorization } = req.headers
    // token = authorization.split("Bearer ")
    // const test = verify(token[1]) 
    // console.log(test)

        try {
            const {authorization} = req.headers
            const token = authorization.split("Bearer ")
            if (token.length !==2) throw {name:"InvalidToken"}
            const { id , email } = verify(token[1])
            req.users = {id, email}
            next()
        } catch (error) {
            if(error.name === "JsonWebTokenError"){
                res.status(400).json({message:"Invalid Token"})
            } else if(error.name === "Unauthorized"){
                res.status(401).json({message:"Unauthorized"})
            } else {
                res.status(500).json(error)
            }
        }
    }

module.exports = authenticationMiddleware