const {GoogleGenerativeAI} = require('@google/generative-ai')
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({model: 'gemini-embedding-001'})

const generateEmbeddings = async (chunk) => {
    try{
        
        const embeddedChunk = await model.embedContent(chunk,{
            outputDimensionality: 768,
        });

        const embeddingValues = embeddedChunk.embedding.values
        return embeddingValues;
    }
    catch(error){
        throw error;
    }
}

module.exports = generateEmbeddings









