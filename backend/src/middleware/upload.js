const path = require('path');
const multer = require('multer');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null,uploadDir);
    },

    filename:(req,file,cb)=>{
        const newName = Date.now() + '-' + file.originalname;
        cb(null,newName);
    }
});

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