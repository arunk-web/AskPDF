const {getAnswer,getAnswerStream} = require('../services/llmService')

//api endpoint
const chatStreamWithDocument = async (req,res) => {
    try{
        res.setHeader('Content-Type','text/event-stream');
        res.setHeader('Cache-Control','no-cache');
        res.setHeader('Connection','keep-alive');

        const {documentId,question} = req.body;
        //it doesn't return any value,directly writes in real time

        await getAnswerStream(documentId,question,res);

    } catch(error){
        console.log('chat-error:',error.message);
        res.write('Something went wrong while generating the answer');
        res.end();
    }
}

const chatwithDocument = async () => {
    try{
        const {documentId , question} = req.body;
        const answer = await getAnswer(documentId,question);

        res.status(200).json({ answer });

    } catch(error){
        console.error('Chat error:',error.message);
        res.status(500).json({
            message:'Something went wrong while generating the answer'
        });
    }
}

module.exports = {chatwithDocument,chatStreamWithDocument};