const mongoose = require('mongoose');
const databaseConnect = () => {
    mongoose.set('strictQuery', false);
    mongoose.connect(process.env.DATABSE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log('Mongodb Database Connected');
    }).catch(error=>{
        console.log(error);
    })
}

module.exports = databaseConnect;