const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const homeRoutes = require('./routes/home');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', homeRoutes);
app.use('/auth', authRoutes);

mongoose.connect('mongodb://localhost/auth', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
.then(result => {
    
    app.listen(3000);
})
.catch(err => {
    console.log(err);
});
