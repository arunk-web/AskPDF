const multer = require('multer');

const storage = multer.memoryStorage();

const filefilter = (req,file,cb) => {
    if(file.mimetype === 'application/pdf'){
        cb(null,true);
    }
    else {
        cb(null,false);
    }
}

const upload = multer({
    storage : storage,
    fileFilter : filefilter,
    limits : {fileSize:20*1024*1024}
})

module.exports = upload;