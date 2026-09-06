require('dotenv').config();
const connectDB = require('../src/config/db');

if (require.main === module) {
    connectDB();
}

const redisClient = require('../src/config/redis');
const Document = require('../src/models/Document');
const Chunk = require('../src/models/Chunk')
const extractTextfromPDF = require('../src/services/pdfParser')
const chunkedText = require('../src/services/chunker');
const generateEmbeddings = require('../src/services/embedder')
const cleanupOrphanJobs = require('../src/services/cleanupService')

const processQueue = async () => {
    while(true) {
        const Job = await redisClient.brpop('pdf-processing-queue',0);

        const requiredData = Job[1];
        const convertIntoObject = JSON.parse(requiredData);    //string->object

        const docId = convertIntoObject.documentId;
        const fileBase64 = convertIntoObject.fileBase64;
        const fileBuffer = Buffer.from(fileBase64, 'base64');

        console.log(docId);
        
        try{
            await redisClient.hset(`job:${docId}`,'status','processing');
            const extractedText = await extractTextfromPDF(fileBuffer);
            const chunkedArray = chunkedText(extractedText);

            let i = 0;
            while(i < chunkedArray.length){
                const embedding = await generateEmbeddings(chunkedArray[i]);

                await Chunk.create({
                    documentId: docId,
                    text: chunkedArray[i],
                    embedding: embedding,
                    chunkIndex: i,
                });
                
                i++;
            }

            await Document.findByIdAndUpdate(docId,{status: 'completed', totalChunks: chunkedArray.length});
            await redisClient.hset(`job:${docId}`,'status','completed');
            await redisClient.hset(`job:${docId}`,'totalChunks',chunkedArray.length)

        } catch(error){
            console.error('Processing failed:', error.message)
            await Document.findByIdAndUpdate(docId, {status:'failed'});
            await redisClient.hset(`job:${docId}`,'status','failed');
        }
        
    }
}

processQueue();

setInterval(cleanupOrphanJobs,5*60*1000);