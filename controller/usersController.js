const {User} = require("./../models")
const {compare} = require("./../helpers/hash")
const {sign} = require("./../helpers/jwt")


class UserController{
    static async signUp(req, res){
        const {email, full_name, username, password, profile_image_url, age, phone_number} = req.body
        try {
            const users = await User.create({email, full_name, username, password, profile_image_url, age, phone_number})
            res.status(201).json({
                email: users.email,
                full_name: users.full_name,
                username : users.username,
                profile_image_url : users.profile_image_url,
                age: users.age,
                phone_number: users.phone_number 
            })
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                const ValidationError = error.errors.map((error) => {
                    return error.message
                })
                res.status(400).json({ message: ValidationError })
            } else if(error.name === 'SequelizeUniqueConstraintError') {
                const ValidationError = error.errors.map((error) => {
                    return error.message
                })
                res.status(400).json({ message: ValidationError })
            } else{
                res.status(500).json(error)

            }
        }
    }

    static async SignIn(req, res){
        const {email, password} = req.body
        try {
            const users = await User.findOne({ where:{email}})
            if(!users) throw {name: "EmailNotFound"}
            if(!compare(password, users.password)) throw {name:"WrongPassword"}
            const token = sign({id: users.id, email:users.email})
            res.status(200).json({token})
        } catch (error) {
            res.status(500).json(error)
        }
    }
}

module.exports = UserController