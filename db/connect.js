const mongoose = require('mongoose')

function connectDB() {
    mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("DB CONNECTED SUCCESSFULLY")
    }).catch (err=>{
        console.log(`ERROR IN DB CONNECTION ${err}`)
    })
}
module.exports = connectDB