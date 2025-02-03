const express = require("express")
const router = express.Router()

const sqlite3 = require("sqlite3")

const path = require("path")

const fs = require("fs")

const log = require("../CreateLog")
const { promisify } = require("util")

const cp = promisify(fs.cp)
const rm = promisify(fs.rm)


module.exports = router.get("/download/:key", async (req, res) => {
    const db = new sqlite3.Database(path.join(__dirname, "../", "access", "db", "File.db"))

    try {
        const rows = await new Promise((resolve, rejects) => {
            db.all("select * from fileinfo where filekey = ?", [req.params.key], (error, rows) => {
                if (error) rejects(error)
                else resolve(rows)
            })
        })
        if (rows[0] == null) {
            //判断提取码是否对应某文件
            res.send("文件不存在")
            return
        }

        //将文件复制
        await cp(rows[0]["Filepath"], path.join(__dirname, "../", "access", "file", rows[0]["Filename"]), { recursive: true, overwrite: true })
        //创建下载进程

        res.download(path.join(__dirname, "../", "access", "file", rows[0]["Filename"]), (error) => {
            if (error) {
                console.error(log.OutputAndWrite(error.message))
            }
            // console.log(log.OutputAndWrite(Filename));

            setTimeout(async () => {
                try {
                    await rm(path.join(__dirname, "../", "access", "file", rows[0]["Filename"]), { force: true })
                    await rm(rows[0]["Filepath"], { force: true })
                    await new Promise((resolve, reject) => {
                        db.run("DELETE FROM fileinfo WHERE filekey = ?", [req.params.key], (error) => {
                            if (error) reject(error);
                            else resolve();
                        });
                    });
                } catch (error) {
                    console.error(log.OutputAndWrite(error.message))
                }
            }, 10 * 1000)
        })

    } catch (error) {
        console.error(log.OutputAndWrite(error.message));
        res.status(500).send("服务器错误");
    }
})
