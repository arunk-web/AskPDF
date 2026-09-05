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


    const handleKeyDown = (event) => {
        if (event.key === 'Enter') handleSend();
    } 



    return (
        <div className="flex flex-col h-screen bg-black text-white">
            <div className="flex-1 overflow-y-auto px-4 py-6">
                <div className="max-w-5xl mx-auto flex flex-col gap-6">
                    {message.map((msg,index) => (
                        msg.sender == 'user' ? (
                        <div key={index} className="self-end bg-blue-600 text-white rounded-3xl px-4 py-2.5 max-w-[75%] wrap-break-word">
                            {msg.text}
                        </div>
                    ) : (
                        <div key={index} className="self-start text-neutral-100 max-w-[75%] whitespace-pre-wrap leading-relaxed">
                            {msg.text}
                        </div>
                )
            ))}
            </div>
        </div>

        <div className="border-t border-neutral-800 bg-black px-4 sm:px-6 py-4">
    <div className="w-full max-w-5xl mx-auto flex items-center gap-3 bg-neutral-800 rounded-full px-5 py-4">
        <input
            type="text"
            value={question}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about your document"
            className="flex-1 bg-transparent outline-none text-white placeholder-neutral-500 text-base py-1"
        />

                <button 
                    onClick={handleSend} 
                    disabled={isStreaming}
                    className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center disabled:opacity-40 shrink-0"
                >
                ↑
                </button>
            </div>
        </div>   
    </div>
    )
}

export default ChatWindow;