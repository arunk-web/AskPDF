const Document = require('../models/Document');
const redisClient = require('../config/redis');

const uploadDocument = async(req,res) => {
    try{
        const newDocument = await Document.create({
            fileName: req.file.originalname,
        });

        //redis needs string
        const jobData = JSON.stringify({
            documentId : newDocument._id,
            filePath: req.file.path,
        });

        await redisClient.lpush('pdf-processing-queue',jobData);

        res.status(202).json({
            message:'File uploaded,processing started',
            documentId: newDocument._id,
        });
    } catch(error){
        console.error('upload error:' , error.message)
        res.status(500).json({
            message:'Something went wrong during upload'
        })
    }
}


module.exports = uploadDocument;