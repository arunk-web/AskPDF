import UploadBox from "./components/UploadBox";
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
      setStatus(result);

      if(result.status === 'completed' || result.status === 'failed'){
        clearInterval(interval);
      }
    },3000)
  },[documentId]);
  return(
    <div>
      {!documentId && <UploadBox onUploadSuccess={handleUploadSuccess}/>}
      {documentId && status !== 'completed' && <p>Processing your document....</p>}
      {status === 'completed' && <p>Ready to chat!</p>}
    </div>
  );
}

export default App;