const {Photo, User, Comment} = require('./../models')



class commentController {

    static async addComment(req, res){

        const UserId = req.users.id
        const {comment, PhotoId} = req.body
        const data =  {comment, UserId, PhotoId}
        try {
            const comments = await Comment.create(data, {returning: true})
            if (!comments) throw { name: 'SequelizeValidationError' }
            res.status(201).json(comments)
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
    
    //masih blm muncul
    static async getAllComment(req, res){
        try {
            const comments = await Comment.findAll({
                where:{UserId:req.users.id},
                include:[{
                    model:Comment,
                    attributes:['comment'],
                    include:{
                        model:Photo,
                        attributes:['id', 'title','caption','poster_image_url']
                    }
                },{
                    model:User,
                    attributes:['id','username','profile_image_url', 'phone_number']
                }]
            })
            if(!comments) throw {name:"DataNotFound"}
            res.status(200).json(comments)
        } catch (error) {
            if (error.name === "DataNotFound") {
                res.status(404).json("Data Not Found")
            } else {
                res.status(500).json(error)
            }   
        }
    } 
      
    //blm diubah
    static async updateComment(req, res){ 
        const {photoId} = req.params
        const id = photoId
        
        const {title, caption, poster_image_url} = req.body 
        const data = {title, caption, poster_image_url}
        try {
            const photos = await Photo.update(data, {where:{id}, attributes:['id','title','caption','poster_image_url'], returning: true}) 
            if(photos[0]===0) throw ({name:"cantDelete"})
            res.status(200).json(photos[1])
        } catch (error) {
            if(error.name === "cantDelete"){
                res.status(400).json(error)
            } else{
                res.status(500).json(error)
            }
        }
    } 
     
    //blm di ubah
    static async removeComment(req,res){ 
        const {photoId} = req.params
        const id = photoId
        console.log(id);
        try {
            const photos = await Photo.destroy({ where: {id} })
            if (!photos) throw { name: 'ErrNotFound' }
            res.status(200).json({message:"Your photos has been succesfully deleted"})
        } catch (error) {
            if (error.name === 'ErrNotFound') {
                res.status(404).json({ message: 'data not found' })
            } else {
                res.status(500).json(error.message)
            }
        }
    }
}

module.exports = commentController