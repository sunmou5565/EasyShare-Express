const express = require("express")
const router = express.Router()

const multer = require("multer")

const crypto = require("crypto")

const sqlite3 = require("sqlite3")

const path = require("path")

const log = require("../CreateLog")

let now = ""

function Createdate() {
    now = Date.now()
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname,"../","access","file"))
    },
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

        SqlWrite(file.originalname, path.join(__dirname,"../","access","file",now + ";" + name), generateKey(now + ";" + file.originalname))
        cb(null, now + ";" + name)
    }
})
const upload = multer({ storage: storage })

function generateKey(filename) {
    const md5 = crypto.createHash("md5");
    return md5.update(filename).digest("hex").substring(0, 5);
}

function SqlWrite(filename, filepath, filekey) {
    const db = new sqlite3.Database(path.join(__dirname,"../","access","db","File.db"))
    db.run("insert into fileinfo(filename,filekey,filepath) values(?,?,?)", [filename, filekey, filepath], (error) => {
        if (error) {
            console.error(log.OutputAndWrite(error.message))
        }
    })
    key = ""
    db.close()
}

module.exports = router.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.send("ERR!")
    }
    let key = generateKey(now + ";" + req.file.originalname)
    console.log(log.OutputAndWrite(`Uploaded:${req.file.originalname}`))
    res.json({ message: key })
})