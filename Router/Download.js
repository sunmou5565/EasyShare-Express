const express = require("express")
const router = express.Router()

const sqlite3 = require("sqlite3")

const path = require("path")

const fs = require("fs")

const log = require("../CreateLog")
const { json } = require("stream/consumers")

module.exports = router.get("/download/:key", (req, res) => {
    const db = new sqlite3.Database(path.join(__dirname,"../","access","db","File.db"))
    db.all("select * from fileinfo where filekey = ?", [req.params.key], (error, rows) => {
        if (error) {
            console.log(log.OutputAndWrite(error.message))
        }
        console.log(log.OutputAndWrite(`Create download task:\n`+JSON.stringify(rows)))
        if (rows[0] == null) {
            res.send("文件不存在")
            return
        } else {
            fs.renameSync(rows[0]["Filepath"], path.join(__dirname,"../","access","file", rows[0]["Filename"]), (error) => {
                if (error) {
                    console.error(log.OutputAndWrite(error.message))
                }
            })
            res.download(path.join(__dirname,"../","access","file", rows[0]["Filename"]), (error) => {
                if (error) {
                    console.log(log.OutputAndWrite(error.message))
                } else {
                    fs.rmSync(path.join(__dirname, "file", rows[0]["Filename"]), { force: true })
                    db.run("delete from fileinfo where filekey = ?", [req.params.key], (error) => {
                        if(error){
                            console.error(log.OutputAndWrite(error.message))
                        }
                    })
                    
                }
            })


        }
    })
    db.close()
})