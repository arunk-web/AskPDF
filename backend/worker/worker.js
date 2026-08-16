require('dotenv').config();
const connectDB = require('../src/config/db');

connectDB();
const redisClient = require('../src/config/redis');
const Document = require('../src/models/Document');
const Chunk = require('../src/models/Chunk')
const extractTextfromPDF = require('../src/services/pdfParser')
const chunkedText = require('../src/services/chunker');
const generateEmbeddings = require('../src/services/embedder')

const processQueue = async () => {
    while(true) {
        const Job = await redisClient.brpop('pdf-processing-queue',0);

        // console.log(Job);
        // ['pdf-processing-queue', '{"documentId":"...","filePath":"..."}']  we get array from this

        const requiredData = Job[1];
        const convertIntoObject = JSON.parse(requiredData);    //string->object

        const docId = convertIntoObject.documentId;
        const docpath = convertIntoObject.filePath;

        console.log(docId,docpath);
        
        try{
            await redisClient.hset(`job:${docId}`,'status','processing');
            const extractedText = await extractTextfromPDF(docpath);
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