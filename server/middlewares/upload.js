import multer from 'multer'
// use of existing code: [node+multer中间件实现单文件、多文件上传—超详细] https://blog.csdn.net/naoguaten/article/details/121965199

// this is the middleware for saving files to the /uploads folder in the server
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

export default upload;