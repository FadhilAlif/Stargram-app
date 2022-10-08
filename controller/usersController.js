const { User } = require("./../models")
const { compare } = require("./../helpers/hash")
const { sign } = require("./../helpers/jwt")


class UserController {
    static async signUp(req, res) {
        const { email, full_name, username, password, profile_image_url, age, phone_number } = req.body
        const data = { email, full_name, username, password, profile_image_url, age, phone_number }
        try {
            const users = await User.create(data)
            if (!users) throw { name: 'SequelizeValidationError' }
            res.status(201).json({
                email: users.email,
                full_name: users.full_name,
                username : users.username,
                profile_image_url : users.profile_image_url,
                age: users.age,
                phone_number: users.phone_number 
            })
        } catch (error) {
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                const ValidationError = error.errors.map((error) => {
                    return error.message
                })
                res.status(400).json({ message: ValidationError })
            }  else {
                res.status(500).json(error)

            }
        }
    }

    static async SignIn(req, res) {
        const { email, password } = req.body
        try {
            const users = await User.findOne({ where: { email } })
            if (!users) throw { name: "EmailNotFound" }
            if (!compare(password, users.password)) throw { name: "WrongPassword" }
            const token = sign({ id: users.id, email: users.email })
            res.status(200).json({ token })

        } catch (error) {
            if (error.name === "EmailNotFound" || error.name === "WrongPassword") {
                res.status(400).json({ message: "email or password incorrect" })
            } else {
                res.status(500).json({ message: "Internal Server error" })
            }
        }
    }

    static async Update(req, res) {

        const { userId } = req.params
        const id = userId

        const { email, full_name, username, profile_image_url, age, phone_number } = req.body
        const data = { email, full_name, username, profile_image_url, age, phone_number }
        try {

            if (id != req.users.id) throw ({ name: "notUserId" })
            const users = await User.update(data, { where: { id }, returning: true })
            if (users[0] === 0) throw ({ name: "cantUpdateUser" })
            if (!users) throw ({name : "SequelizeValidationError"})
            const datas = users[1][0]
            res.status(200).json({
                user: {
                    email: datas.email,
                    full_name: datas.full_name,
                    username: datas.username,
                    profile_image_url: datas.profile_image_url,
                    age: datas.age,
                    phone_number: datas.phone_number
                }
            })
        } catch (error) {
            if (error.name === "cantUpdateUser") {
                res.status(404).json({ message: `cant update User because body data is undefined`})
            } else if (error.name === "notUserId") {
                res.status(401).json({ message: `cant update/ delete User because unauthorized where userId:${id}` })
            } else if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                const ValidationError = error.errors.map((error) => {
                    return error.message
                })
                res.status(400).json({ message: ValidationError })
            } else {
                res.status(500).json({ message: "Internal Server error" })
            }
        }
    }

    static async Remove(req, res) {
        const { userId } = req.params
        const id = userId
        try {
            if (id != req.users.id) throw ({ name: "notUserId" })
            const users = await User.destroy({ where: { id } })
            if (!users) throw { name: 'ErrNotFound' }
            res.status(200).json({ message: "Your account has been succesfully deleted" })
        } catch (error) {
            if (error.name === 'ErrNotFound') {
                res.status(404).json({ message: 'cant delete!! params id not found' })
            } else if (error.name === "notUserId") {
                res.status(401).json({ message: `cant update/ delete User because unauthorized where userId:${id}`})
            } else {
                res.status(500).json({ message: "Internal Server error" })
            }
        }
    }
}

module.exports = UserController