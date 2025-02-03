const crypto = require("crypto")
const path = require("path")
const sqlite3 = require("sqlite3")

const log = require("../../CreateLog");
const { error } = require("console");

module.exports = {

    /**
     * 生成提取码/Create a key
     * @param {string} filename 
     * @returns {string}
     */
    generateKey(filename) {
        const md5 = crypto.createHash("md5");
        return md5.update(filename).digest("hex").substring(0, 5);
    },

    /**
     * 向数据库写入文件信息
     * @param {string} filename 
     * @param {string} filepath 
     * @param {string} filekey 
     */
    SqlWrite(filename, filepath, filekey) {
        const db = new sqlite3.Database(path.join(__dirname, "../","../", "access", "db", "File.db"),(error)=>{
            if (error) {
                console.error(log.OutputAndWrite(error.message))
            }
        })
        db.run("insert into fileinfo(filename,filekey,filepath) values(?,?,?)", [filename, filekey, filepath], (error) => {
            if (error) {
                console.error(log.OutputAndWrite(error.message))
            }
        })
        db.close()
    }
}