const {GoogleGenerativeAI} = require('@google/generative-ai')
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({model: 'text-embedding-004'})

const generateEmbeddings = async (chunk) => {
    try{
        const embeddedChunk = await model.embedContent(chunk);
        const embeddingVector = embeddedChunk.embedding.values
        return embeddingVector;
    }
    catch(error){
        throw error
    }
}

module.exports = generateEmbeddings









