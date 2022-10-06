const {SocialMedia, User} = require('./../models')

class socialmediaController {

    static async addSocialMedia(req, res){

        const UserId = req.users.id
        const {name, social_media_url} = req.body
        const data =  {name, social_media_url, UserId}
        try {
            const socialmedias = await SocialMedia.create(data)
            if (!socialmedias) throw { name: 'SequelizeValidationError' }
            res.status(201).json(socialmedias)
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                const ValidationError = error.errors.map((error) => {
                    return error.message
                })
                res.status(400).json({ message: ValidationError })
            } else {
                console.log(error)
                res.status(500).json({ message: 'internal server error' })
            }
        }
    }

    static async getAllSocialMedia(req, res){
        try {
            const socialmedias = await SocialMedia.findAll({
                where:{UserId:req.users.id},
                include:[{
                    model:User,
                    attributes:['id','username','profile_image_url']
                }]
            })
            if(!socialmedias) throw {name:"DataNotFound"}
            res.status(200).json(socialmedias)
        } catch (error) {
            if (error.name === "DataNotFound") {
                res.status(404).json("Data Not Found")
            } else {
                res.status(500).json(error)
            }
        }
    } 

    static async updateSocialMedia(req, res){ 
        const {socialMediaId} = req.params
        const id = socialMediaId
        
        const {name, social_media_url} = req.body 
        const data = {name, social_media_url}
        try {
            const socialmedias = await SocialMedia.update(data, {where:{id}, attributes:['id','name','social_media_url'], returning: true}) 
            if(socialmedias[0]===0) throw ({name:"cantDelete"})
            res.status(200).json(socialmedias[1])
        } catch (error) {
            if(error.name === "cantDelete"){
                res.status(400).json(error)
            } else{
                res.status(500).json(error)
            }
        }
    } 

    static async removeSocialMedia(req,res){ 
        const {socialMediaId} = req.params
        const id = socialMediaId
        console.log(id);
        try {
            const socialmedias = await SocialMedia.destroy({ where: {id} })
            if (!socialmedias) throw { name: 'ErrNotFound' }
            res.status(200).json({message:"Your socialmedias has been succesfully deleted"})
        } catch (error) {
            if (error.name === 'ErrNotFound') {
                res.status(404).json({ message: 'data not found' })
            } else {
                res.status(500).json(error.message)
            }
        }
    }
}

module.exports = socialmediaController