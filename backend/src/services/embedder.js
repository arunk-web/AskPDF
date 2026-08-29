const {GoogleGenerativeAI} = require('@google/generative-ai')
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({model: 'gemini-embedding-001'})


const normalize = (vector) => {
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    return vector.map(val => val / magnitude);
}  

const generateEmbeddings = async (chunk) => {
    try{
        
        const embeddedChunk = await model.embedContent(chunk,{
            outputDimensionality: 768,
        });

        const embeddingValues = embeddedChunk.embedding.values;
        const normalizedValues = normalize(embeddingValues);
        return normalizedValues;

        // return embeddingValues;
    }
    catch(error){
        throw error;
    }
}

module.exports = generateEmbeddings









