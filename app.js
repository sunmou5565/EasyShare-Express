const express = require("express")
const app = express()

const path = require("path")

const fs = require("fs")

const sqlite3 = require("sqlite3").verbose()

const upload = require("./Router/Upload")
const download = require("./Router/Download")

const log = require("./CreateLog")

app.use(upload)
app.use(download)

app.use(express.static(path.join(__dirname, "View")))

app.listen(80, "0.0.0.0", (error) => {
    if (error) {
        console.error(log.OutputAndWrite(error.message))
        return
    }
    CheckAndCreteDir()
    CheckAndCreateTable()
})

function CheckAndCreteDir(){
    if(!fs.existsSync(path.join(__dirname,"access"))){
        fs.mkdirSync(path.join(__dirname,"access"))
    }
    const date = new Date()
    console.log(log.OutputAndWrite("Pre launch tasks"))
    if (!fs.existsSync(path.join(__dirname,"access","db"))) {
        fs.mkdirSync(path.join(__dirname,"access","db"))
    }
    if (!fs.existsSync(path.join(__dirname,"access","file"))) {
        fs.mkdirSync(path.join(__dirname,"access","file"))
    }
    console.log(log.OutputAndWrite("Task completion before startup"))
}



function CheckAndCreateTable(){
    const db = new sqlite3.Database(path.join(__dirname,"access","db","File.db"))
    db.all("SELECT name FROM sqlite_master WHERE type='table' AND name = 'fileinfo'", [], (error, rows) => {
        if (error) {
            console.error(error.message)
            return
        }
        if (!rows[0]) {
            db.run("CREATE TABLE fileinfo (Filename TEXT,Filekey  TEXT,Filepath TEXT)", [], (error, rows) => {
                if (error) {
                    console.error(log.OutputAndWrite(error.message))
                    return
                }
            })
        }
    })
    db.close()
}