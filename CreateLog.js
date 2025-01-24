const fs = require("fs")

const path = require("path")

module.exports = {
    OutputLog: function (text) {
        const date = new Date()
        return `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}] ${text}`
    },

    WriteLog: function (text) {
        if(!fs.existsSync(path.join(__dirname,"log"))){
            fs.mkdirSync(path.join(__dirname,"log"))
        }
        const date = new Date()
        fs.appendFileSync(`log/${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}.log`, `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}]`+text+"\n")
    },

    OutputAndWrite:function(text){
        if(!fs.existsSync(path.join(__dirname,"log"))){
            fs.mkdirSync(path.join(__dirname,"log"))
        }
        const date = new Date()
        fs.appendFileSync(`log/${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}.log`, `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}]`+text+"\n")
        return `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}] ${text}`
    }
}