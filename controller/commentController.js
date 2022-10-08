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
    
    static async getAllComment(req, res){
        try {
            const comments = await Comment.findAll({ 
                model:Comment,
                where:{UserId:req.users.id},
                include:[{
                    model:Photo,
                    attributes:['id', 'title','caption','poster_image_url']
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
                console.log(error)
            }   
        }
    } 
      
    
    static async updateComment(req, res){ 
        const {commentId} = req.params
        const id = commentId
        
        const {comment} = req.body 
        const data = {comment}
        try {
            const comments = await Comment.update(data, {where:{id}, attributes:['id','comment','UserId','PhotoId'], returning: true}) 
            if(comments[0]===0) throw ({name:"Can't Update"})
            res.status(200).json(comments[1])
        } catch (error) {
            if(error.name === "Can't Update"){
                res.status(400).json(error)
            } else{
                res.status(500).json(error)
            }
        }
    }
     
    static async removeComment(req,res){ 
        const {commentId} = req.params
        const id = commentId
        console.log(id);
        try {
            const comments = await Comment.destroy({ where: {id} })
            if (!comments) throw { name: 'ErrNotFound' }
            res.status(200).json({message:"Your Comments has been succesfully deleted"})
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