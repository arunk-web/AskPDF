const pdfParse = require('pdf-parse');

const extractTextfromPDF = async(buffer) => {
    try{
        const data = await pdfParse(buffer);
        return data.text;
    } catch(error) {
        console.error('PDF parsing failed:', error.message);
        throw error;
    }
}

module.exports = extractTextfromPDF;