const {Photo, User, Comment} = require('./../models')



class commentController {

    static async addComment(req, res){

        const UserId = req.users.id
        const {comment, PhotoId} = req.body
        const data =  {comment, UserId, PhotoId}
        try {
            const comments = await Comment.create(data, {returning: true})
            if (!comments) throw { name: 'SequelizeValidationError' }
            res.status(201).json({comment:comments})
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                const ValidationError = error.errors.map((error) => {
                    return error.message
                })
                res.status(400).json({ message: ValidationError })
            } else if(error.name === 'SequelizeForeignKeyConstraintError'){
                res.status(400).json({ message: "PhotoId not found"})
            } else{
                res.status(500).json(error)
            }
        }
    }
    
    static async getAllComment(req, res){
        try {
            const comments = await Comment.findAll({
                where:{UserId:req.users.id},
                include:[{
                    model:Photo,
                    attributes:['id', 'title', 'caption', 'poster_image_url'],
                },{
                    model:User,
                    attributes:['id','username','profile_image_url', 'phone_number']
                }]
            })
            if(!comments) throw {name:"DataNotFound"}
            res.status(200).json({comments})
        } catch (error) {
            if (error.name === "DataNotFound") {
                res.status(404).json("Data Not Found")
            } else {
                res.status(500).json(error)
            }   
        }
    } 
      
    static async updateComment(req, res){ 
        const {commentId} = req.params
        const id = commentId
        
        const {comment, PhotoId} = req.body 
        const data = {comment, PhotoId}
        try {
            const comments = await Comment.update(data, {where:{id, UserId:req.users.id}, returning: true}) 
            if(comments[0]===0) throw ({name:"cantUpdateComment"})
            if (!comments) throw { name: 'SequelizeValidationError' }
            const datas = comments[1][0]
            res.status(200).json({comment:datas})
        } catch (error) {
            if(error.name === "cantUpdateComment"){
                res.status(400).json({message:`cant Update comment where photoId : ${id} or body request is null`})
            } else if (error.name === 'SequelizeValidationError') {
                const ValidationError = error.errors.map((error) => {
                    return error.message
                })
                res.status(400).json({ message: ValidationError })
            } else{
                res.status(500).json(error)
            }
        }
    } 
     
    static async removeComment(req,res){ 
        const {commentId} = req.params
        const id = commentId
        
        try {
            const comments = await Comment.destroy({ where: {id, UserId:req.users.id} })
            if (!comments) throw { name: 'ErrNotFound' }
            res.status(200).json({message:"Your photos has been succesfully deleted"})
        } catch (error) {
            if (error.name === 'ErrNotFound' || error.name === 'SequelizeDatabaseError') {
                res.status(404).json({ message: 'commentId not found' })
            } else {
                res.status(500).json({message:'Internal server error'})
            }
        }
    }
}

module.exports = commentController