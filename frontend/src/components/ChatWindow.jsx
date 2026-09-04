import { useState } from "react";
import api from "../services/api";


function ChatWindow({documentId}){
    const[question,setquestion] = useState('');
    const[message,setmessage] = useState([]);
    const[isStreaming,setIsStreaming] = useState(false);
    
    const handleInputChange = (event) => {
        setquestion(event.target.value);
    }
    

    const handleSend = async () => {
        if(!question) return;
        setmessage(
            prev => [...prev, {sender : 'user' , text : question }]
        );

        setmessage(prev => [...prev, {sender : 'ai' , text : ''}]);
        setquestion('');
        setIsStreaming(true);

        await api.sendChatMessage(documentId,question,(chunkText) => {
            setmessage(prev => {
                const updated = [...prev];
                const lastMessage = updated[updated.length - 1];
                updated[updated.length - 1] = { ...lastMessage, text: lastMessage.text + chunkText };
                return updated;
            });
        });

        setIsStreaming(false);
    }

    return(
        <div>
            <div>
                {message.map((msg,index) => (
                    <p key={index}>
                        <strong>{msg.sender}:</strong>{msg.text}
                    </p>
                ))}
            </div>

            <input 
                type="text" 
                value={question}
                onChange={handleInputChange}
                placeholder="Ask a question about your document...."
            />

            <button onClick={handleSend} disabled={isStreaming}>
                Send
            </button>
        </div>
    )
}

export default ChatWindow;