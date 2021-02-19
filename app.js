const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const multer = require('multer')
const cors = require('cors');

app.use(cors())

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname.replace(" ", ""));
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file'));
    }
}
const upload = multer({ storage: storage, limits: { fileSize: 1024 * 1024 }, fileFilter: fileFilter }); // 1mb

app.post('/', (req, res) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            res.send({ 'msg': `${err.message}` })
        }
        else {
            if (req.file) {
                console.log(req.file)
                let url = `http://localhost:8000/${req.file.destination}${req.file.filename}`;
                res.send(
                    {
                        "success": 1,
                        "file": {
                            "url": url,
                        }
                    }
                )
            }
            else {
                res.send({ 'msg': 'Please upload a file' })
            }
        }
    })
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

const port = 8000;
app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`)
})