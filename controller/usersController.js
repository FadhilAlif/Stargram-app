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
            res.status(201).json({token})
        } catch (error) {
            res.status(500).json(error)
        }
    }

    static async Update(req, res){
        const {userId} = req.params
        const id = userId

        const {email, full_name, username, profile_image_url, age, phone_number} = req.body
        const data = {email, full_name, username, profile_image_url, age, phone_number}
        try {
            const users = await User.update(data, {where:{id},attributes:['email','full_name','username','profile_image_url','age','phone_number'], returning: true})
            if(users[0]===0) throw ({name:"cantDelete"})
            res.status(200).json(users[1])
        } catch (error) {
            if(error.name === "cantDelete"){
                res.status(400).json(error)
            } else{
                res.status(500).json(error)
            }
        }
    }

    static async Remove(req, res){
        const {userId} = req.params
        const id = userId
        console.log(id);
        try {
            const users = await User.destroy({ where: {id} })
            if (!users) throw { name: 'ErrNotFound' }
            res.status(200).json({message:"Your account has been succesfully deleted"})
        } catch (error) {
            if (error.name === 'ErrNotFound') {
                res.status(404).json({ message: 'data not found' })
            } else {
                res.status(500).json(error.message)
            }
        }
    }
}

module.exports = UserController