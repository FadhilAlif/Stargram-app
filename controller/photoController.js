const {Photo, User, Comment} = require('./../models')



class PhotoController {

    static async addPhoto(req, res){

        const UserId = req.users.id
        const {poster_image_url, title, caption} = req.body
        const data =  {poster_image_url, title, caption, UserId}
        try {
            const photos = await Photo.create(data)
            if (!photos) throw { name: 'SequelizeValidationError' }
            res.status(201).json(photos)
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                const ValidationError = error.errors.map((error) => {
                    return error.message
                })
                res.status(400).json({ message: ValidationError })
            } else {
                res.status(500).json({ message: 'internal server error' })
            }
        }
    }
    
    static async getAllPhoto(req, res){
        try {
            const photos = await Photo.findAll({
                where:{UserId:req.users.id},
                include:[{
                    model:Comment,
                    attributes:['comment'],
                    include:{
                        model:User,
                        attributes:['username']
                    }
                },{
                    model:User,
                    attributes:['id','username','profile_image_url']
                }]
            })
            if(!photos) throw {name:"DataNotFound"}
            res.status(200).json(photos)
        } catch (error) {
            if (error.name === "DataNotFound") {
                res.status(404).json("Data Not Found")
            } else {
                res.status(500).json(error)
            }
        }
    }
}

module.exports = PhotoController