const fs = require('fs')
const pdfParse = require('pdf-parse');

const extractTextfromPDF = async(filePath) => {
    try{
        const buffer = await fs.promises.readFile(filePath);

        const data = await pdfParse(buffer);
        return data.text;

    } catch(error){
        console.error('PDF parsing failed:', error.message);
        throw error;
    }
}

module.exports = extractTextfromPDF;