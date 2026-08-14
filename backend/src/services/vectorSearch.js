const Chunk = require('../models/Chunk')
const generateEmbeddings = require('../services/embedder')

const cosineSimilarity = (vecA,vecB) => {
    let dotProduct = 0;
    let magA = 0;
    let magB = 0;

    for(let i = 0 ; i < vecA.length ; i++){
        dotProduct += vecA[i]*vecB[i];
        magA += vecA[i]*vecA[i];
        magB += vecB[i]*vecB[i];
    }
    return dotProduct/(Math.sqrt(magA)*Math.sqrt(magB)) ; 
}

const findReleventChunks = async(documentId,userQuestion) => {
    const userQuery = await generateEmbeddings(userQuestion);
    const chunkGroup = await Chunk.find({documentId});

    const similarityArray = []

    for(let i = 0 ; i < chunkGroup.length ; i++){
        let currentValue = cosineSimilarity(chunkGroup[i].embedding,userQuery);
        similarityArray.push({score: currentValue , text : chunkGroup[i].text});
    }

    similarityArray.sort((a,b) => b.score - a.score);
    const filter = similarityArray.filter((item) => item.score >= 0.7);
    const topChunks = filter.slice(0,5);
    return topChunks.map((item) => item.text);
}

module.exports = findReleventChunks;