const express = require("express")
const router = express.Router()

const multer = require("multer")

const path = require("path")

const log = require("../CreateLog")
const func = require("./func/otherfunc")

let now = ""

function Createdate() {
    now = Date.now()
}

//创建storage控制器
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../", "access", "file"))
    },
    //文件命名逻辑
    filename: function (req, file, cb) {
        Createdate()
        let name = file.originalname
        let type = ".unknown"
        if (name.search("\\.") !== -1) {
            name = name.split(/\.([^.]*)$/)
            type = name[1]
            name = Buffer.from(name[0], "utf-8").toString("base64") + "." + type
        } else {
            name = Buffer.from(name, "utf-8").toString("base64") + type
        }

        func.SqlWrite(file.originalname, path.join(__dirname, "../", "access", "file", now + ";" + name), func.generateKey(now + ";" + file.originalname))
        cb(null, now + ";" + name)
    }
})
const upload = multer({ storage: storage })


module.exports = router.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.send("ERR!")
    }
    let key = func.generateKey(now + ";" + req.file.originalname)
    console.log(log.OutputAndWrite(`Uploaded:${req.file.originalname}`))
    res.json({ message: key })
})