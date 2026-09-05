import { useState } from "react";
import api from "../services/api";

function UploadBox({ onUploadSuccess }) {
    const [selectedFile, setselectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (event) => {
        setselectedFile(event.target.files[0]);
    }

    const handleUpload = async () => {
        setIsUploading(true);
        try {

            const result = await api.uploadPDF(selectedFile);
            onUploadSuccess(result.documentId);
        }
        catch (error) {
            console.error(error);
        }
        setIsUploading(false);
    }

    return (
        <div className="border border-dashed border-neutral-700 rounded-2xl px-10 py-12 flex flex-col items-center gap-4 bg-neutral-900">

            <p className="text-neutral-300">Upload a PDF to start asking questions</p>
            <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}

                className="text-sm text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-neutral-800 file:text-white hover:file:bg-neutral-700"
            />
            <button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}

                className="bg-white text-black px-6 py-2 rounded-full disabled:opacity-40"
            >
                {isUploading ? 'Uploading...' : 'Submit'}
                
            </button>
        </div>
    )
}

export default UploadBox;