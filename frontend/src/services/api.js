import axios from 'axios'

const uploadPDF = async (file) => {
    const formData = new FormData();
    formData.append('pdf',file);
    
    const response = await axios.post('http://localhost:5000/api/upload',formData);
    return response.data;
    
}

const checkStatus = async (documentId) => {
    try{
        const response = await axios.get(`http://localhost:5000/api/status/${documentId}`);
        return response.data;
    }
    catch(error){
        throw error;
    }
}

const sendChatMessage = async (documentId,question,onChunkReceived) => {
    const response = await fetch('http://localhost:5000/api/chat/stream',{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({documentId,question}),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();    //translator
    //data aata hai, wो raw bytes (binary) mein aata hai, seedha readable text nahi hota. TextDecoder ek translator hai jо in bytes ko normal text mein convert karता hai

    while(true){
        const {done,value} = await reader.read();
        if (done) break;

        const chunkText = decoder.decode(value);
        onChunkReceived(chunkText);
    }


}



export default {uploadPDF , checkStatus , sendChatMessage};