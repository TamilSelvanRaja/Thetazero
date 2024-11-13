const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    /**
    *  Destination to store files
    * The folder to which the file has been saved
    */
    destination: './uploads/',

    /// For other fileds
    filename: (req, file, cb) => {
        // originalname - Name of the file 
        const { originalname: originalName } = file;
        const lastIndexOfDot = originalName.lastIndexOf('.');
        const extension = originalName.slice(lastIndexOfDot);
        // filename - The name of the file within the destination
        let fileName = "";
        if (req.body.fileName == "cameraAttach") {
            // This for adding extensions in camera images
            let exten = "jpg";
            fileName = `${req.body.fileName}.${exten}`
            fileName = fileName.replace(/\s/g, '');
        } else {
            fileName = `${originalName.slice(0, lastIndexOfDot)}_${Date.now()}${extension}`;
            fileName = fileName.replace(/\s/g, '');
        }
        cb(null, fileName);
    },
});

// For upload multiple images from multiple fields
const uploadMultiple = (filename1, filename2, filename3, filename4) => multer({ storage }).fields([{ name: filename1 }, { name: filename2 }, { name: filename3 }, { name: filename4 }]);
// For single file upload
const createSingleFileUploadStrategy = fileName => multer({ storage }).single(fileName);
// For multiple file upload
const createMultiFileUploadStrategy = fieldName => multer({ storage }).array(fieldName);

const deleteFile = (filename) => {
    const filePath = path.join(__dirname, `../uploads/${filename}`);
    fs.unlinkSync(filePath);
}
module.exports = { storage, createSingleFileUploadStrategy, createMultiFileUploadStrategy, uploadMultiple, deleteFile };
