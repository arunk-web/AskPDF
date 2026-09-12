// const redisClient = require('../config/redis')

// const jobStatus = async(req,res) => {
//     try{
//         const documentId = req.params.documentId;
//         const status = await redisClient.hget(`job:${documentId}`,'status');
//         if(status == null){
//             res.status(404).json({message:'job not found'});
//             return;
//         }
//         const totalChunks = await redisClient.hget(`job:${documentId}`,'totalChunks');

//         res.status(200).json({
//             status,totalChunks
//         })
//     } catch(error){
//         res.status(500).json({
//             message:'Interval Server Error'
//         })
//     }
// }


// module.exports = jobStatus;













const Document = require('../models/Document');

const jobStatus = async(req,res) => {
    try{
        const documentId = req.params.documentId;
        const doc = await Document.findById(documentId);

        if(doc === null){
            res.status(404).json({message:'job not found'});
            return;
        }

        res.status(200).json({
            status: doc.status,
            totalChunks: doc.totalChunks
        })
    } catch(error){
        res.status(500).json({message:'Internal Server Error'});
    }
}

module.exports = jobStatus;

