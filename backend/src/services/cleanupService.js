const Document = require('../models/Document');

const cleanupOrphanJobs = async () => {
    try{
        const thresholdTime = Date.now() - (10*60*1000);
        const docs = await Document.find({status: 'processing', updatedAt : {$lt: thresholdTime}});

        for(const doc of docs){
            await Document.findByIdAndUpdate(doc._id,{status : 'failed'});
        }
    } catch(error){
        console.error('cleanup failed', error.message);
    }
}

module.exports = cleanupOrphanJobs;








