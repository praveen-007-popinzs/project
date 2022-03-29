const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/route.js');

const { default : mongoose } = require('mongoose');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://pikachu:Krishp007@cluster0.yil5n.mongodb.net/group36Database?authSource=admin&replicaSet=atlas-lx6x0g-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true", {useNewUrlParser : true})
.then( () => console.log('mongoDB is connected'))
.catch( err => console.log(err))


app.use('/', route);

app.listen(process.env.PORT || 3000, function() {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});