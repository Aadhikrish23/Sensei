import multer,{FileFilterCallback} from "multer";
import { Request,Response,NextFunction } from "express";
import { v4 as uuidv4 } from "uuid"; 
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedMimeTypes = ["application/pdf"];
const filepath = process.env.UplaodFilepath || path.join(__dirname, "../../uploads/resumes");
if (!fs.existsSync(filepath)) {
  fs.mkdirSync(filepath, { recursive: true });
}
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,filepath);
    },
    filename:(req:any,file,cb)=>{
        let id = req.user.id;
        const filename = `${id}-${uuidv4()}`;
        cb(null,filename);  
    }
});
const fileFilter = (req:Request,file:Express.Multer.File,cb:FileFilterCallback)=>{
    if(allowedMimeTypes.includes(file.mimetype)){
        cb(null,true);
    }
    else{
       cb(new Error("Only PDF files are  allowed", ));

    }
}

const limits ={fileSize:5*1024*1024};

const uploader = multer({
    storage:storage,
    fileFilter:fileFilter,
    limits:limits
});

export default uploader.single("Resume");
