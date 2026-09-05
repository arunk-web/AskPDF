import UploadBox from "./components/UploadBox";
import ChatWindow from "./components/ChatWindow";
import { useEffect,useState } from "react";
import api from "./services/api";

function App(){
  const [documentId,setDocumentId] = useState(null);
  const [status,setStatus] = useState(null);

  const handleUploadSuccess = (newDocumentId) => {
    setDocumentId(newDocumentId)
  }

  useEffect(() => {
    if(!documentId) return;

    const interval = setInterval(async ()=> {
      const result = await api.checkStatus(documentId);
      setStatus(result.status);

      if(result.status === 'completed' || result.status === 'failed'){
        clearInterval(interval);
      }
    },3000)
  },[documentId]);
  return(
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      {!documentId && <UploadBox onUploadSuccess={handleUploadSuccess}/>}
      {documentId && status !== 'completed' && <p className="text-neutral-400">Processing your document....</p>}
      {status === 'completed' && <ChatWindow documentId={documentId}/>}
    </div>
  );
}

export default App;