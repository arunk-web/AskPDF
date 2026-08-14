
const chunkedText = (text) => {
    const chunkSize = 1000;
    const chunkOverlap = 200;

    const chunks = [];
    
    let start = 0;
    while(start < text.length){
        const chunk = text.slice(start,start+chunkSize);
        chunks.push(chunk);
        start += chunkSize - chunkOverlap; 
    }
    return chunks;
}

module.exports = chunkedText;

