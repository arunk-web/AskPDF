import { useState } from "react";
import api from "../services/api";

function UploadBox({ onUploadSuccess }){
    const [selectedFile , setselectedFile] = useState(null);
    const [isUploading , setIsUploading] = useState(false);
    

    const handleFileChange = (event) => {
        setselectedFile(event.target.files[0]);
    }

    const handleUpload = async() => {
        setIsUploading(true)
        try{
            const result = await api.uploadPDF(selectedFile);
            onUploadSuccess(result.documentId);
        } 
        catch(error){
            console.error(error);
        }
        setIsUploading(false);
    }

    return(
        <div>
            <input type="file"
                placeholder="Insert any file here!"
                onChange={handleFileChange}
            />

            <button onClick={handleUpload}>Submit</button>

        </div>
    )
}


export default UploadBox;