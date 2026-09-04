const findReleventChunks = require('./vectorSearch');
const {GoogleGenerativeAI} = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({model:'gemini-3.1-flash-lite'});

// real time chatting functionality
const getAnswerStream = async (documentId,userQuery,res) => {
    try{
        const releventChunk = await findReleventChunks(documentId,userQuery);
        if(releventChunk.length == 0){
            res.write("I don't know based on the document.");
            res.end();
            return;
        }
        const text = releventChunk.join('\n\n');

        const prompt = `
        constext = ${text}
        Question = ${userQuery}
        Instructions: Only answer using the context above. If the answer is not in the context, say "I don't know based on the document."
        `;

        const result = await model.generateContentStream(prompt);
        for await(const chunk of result.stream){
            const chunkText = chunk.text();
            res.write(chunkText);
        }
        res.end();
    } catch (error){
        res.write("I don't know based on the document.")
        res.end();
    }
}


const getAnswer = async (documentId,userQuery) => {
    try{
        const requiredChunks = await findReleventChunks(documentId,userQuery);

        if(requiredChunks.length == 0){
            return "I don't know";
        }

        const contextText = requiredChunks.join('\n\n');

        const prompt = `
        Context = ${contextText}
        Question = ${userQuery}
        Instructions: Only answer using the context above. If the answer is not in the context, say "I don't know based on the document."
        `;

        const result = await model.generateContent(prompt);
        const requiredAnswer = result.response.text();
        return requiredAnswer;

    } catch(error){
        throw error;
    }
}

module.exports = {getAnswer,getAnswerStream};


