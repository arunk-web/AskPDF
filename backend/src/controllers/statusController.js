const redisClient = require('../config/redis')

const jobStatus = async(req,res) => {
    try{
        const documentId = req.params.documentId;
        const status = await redisClient.hget(`job:${documentId}`,'status');
        if(status == null){
            res.status(404).json({message:'job not found'});
            return;
        }
        const totalChunks = await redisClient.hget(`job:${documentId}`,'totalChunks');

        res.status(200).json({
            status,totalChunks
        })
    } catch(error){
        res.status(500).json({
            message:'Interval Server Error'
        })
    }
}


module.exports = jobStatus;