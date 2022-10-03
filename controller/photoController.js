const {Photo, User, Comment} = require('./../models')



class PhotoController {
    
    static async getAllPhoto(req, res){
        try {
            const photo = await Photo.findAll({
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
            if(!photo) throw {name:"DataNotFound"}
            res.status(200).json(photo)
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