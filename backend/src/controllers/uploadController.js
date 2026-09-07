const Document = require('../models/Document');
const redisClient = require('../config/redis');

const uploadDocument = async(req,res) => {
    console.log('UPLOAD REQUEST RECEIVED');
    try{
        console.log('ABOUT TO CREATE DOCUMENT');
        const newDocument = await Document.create({
            fileName: req.file.originalname,
        });
        console.log('DOCUMENT CREATED SUCCESSFULLY');

        const fileBase64 = req.file.buffer.toString('base64');
        console.log('BASE64 CONVERSION DONE, length:', fileBase64.length);

        const jobData = JSON.stringify({
            documentId : newDocument._id,
            fileBase64: fileBase64,
        });
        console.log('JOB DATA STRINGIFIED');

        // await redisClient.lpush('pdf-processing-queue',jobData);
        // console.log('REDIS LPUSH DONE');

        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Redis timeout after 20 seconds')), 20000)
        );

        await Promise.race([
            redisClient.lpush('pdf-processing-queue', jobData),
            timeoutPromise
        ]);
        console.log('REDIS LPUSH DONE');


        res.status(202).json({
            message:'File uploaded,processing started',
            documentId: newDocument._id,
        });

        console.log('RESPONSE SENT');

    } catch(error){
        console.error('upload error:' , error.message)
        res.status(500).json({
            message:'Something went wrong during upload'
        })
    }
}

module.exports = uploadDocument;