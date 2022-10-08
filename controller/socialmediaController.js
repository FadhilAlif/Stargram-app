const {SocialMedia, User} = require('./../models')

class socialmediaController {

    static async addSocialMedia(req, res){

        const UserId = req.users.id
        const {name, social_media_url} = req.body
        const data =  {name, social_media_url, UserId}
        try {
            const socialmedias = await SocialMedia.create(data)
            if (!socialmedias) throw { name: 'SequelizeValidationError' }
            res.status(201).json({social_media:socialmedias})
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
            res.status(200).json({social_medias:socialmedias})
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
            const socialmedias = await SocialMedia.update(data, {where:{id, UserId:req.users.id}, returning: true}) 
            if(socialmedias[0]===0) throw ({name:"cantUpdateSocialMedia"})
            if (!socialmedias) throw { name: 'SequelizeValidationError' }
            const datas = socialmedias[1][0] 
            res.status(200).json({social_media:datas})
        } catch (error) {
            if(error.name === "cantUpdateSocialMedia"){
                res.status(400).json({message:`can't update social media where socialMediaId : ${id} or body request is null`})
            }else if (error.name === 'SequelizeValidationError') {
                const ValidationError = error.errors.map((error) => {
                    return error.message
                })
                res.status(400).json({ message: ValidationError })
            } else{
                res.status(500).json(error.name)
            }
        }
    } 

    static async removeSocialMedia(req,res){ 
        const {socialMediaId} = req.params
        const id = socialMediaId
        
        try {
            const socialmedias = await SocialMedia.destroy({ where: {id, UserId:req.users.id} })
            if (!socialmedias) throw { name: 'ErrNotFound' }
            res.status(200).json({message:"Your social media has been succesfully deleted"})
        } catch (error) {
            if (error.name === 'ErrNotFound' || error.name === 'SequelizeDatabaseError') {
                res.status(404).json({ message: 'socialMediaId not found' })
            } else {
                res.status(500).json(error.message)
            }
        }
    }
}

module.exports = socialmediaController