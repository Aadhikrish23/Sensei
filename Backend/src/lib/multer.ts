import multer,{FileFilterCallback} from "multer";
import { Request } from "express";

const allowedMimeTypes = ["application/pdf"];

const fileFilter = (
  req:Request,
  file:Express.Multer.File,
  cb:FileFilterCallback
)=>{
    if(allowedMimeTypes.includes(file.mimetype)){
        cb(null,true);
    } else {
        cb(new Error("Only PDF files allowed"));
    }
};

const limits ={fileSize:5*1024*1024};

const uploader = multer({
    storage: multer.memoryStorage(),
    fileFilter,
    limits
});

export default uploader.single("Resume");