require('dotenv').config()


const express = require('express');
const path = require('path');
const userRoute = require('./routes/user'); 
const blogRoute = require('./routes/blog');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { checkForAuthenticationCookie } = require('./middlewares/auth');
const Blog = require('./models/blog');

const app = express();
//const PORT = 8000; // In real world, this port may be available in another computer
// To handle this use env variables
const PORT = process.env.PORT || 8000;
// mongoose.connect('mongodb://localhost:27017/blogify', {})
//     .then(() => console.log('Connected to DB'))
//     .catch((err) => console.log('Error connecting to DB', err));

    // in env variable export MONGO_URL = 'mongodb://localhost:27017/blogify'
    mongoose.connect(process.env.MONGO_URL)
    .then((e)=> console.log("MongoDB connected"))

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); 
app.use(checkForAuthenticationCookie('token'));
app.use(express.static(path.resolve('./public')))


app.get('/',async(req,res)=>{
    const allBlogs = await Blog.find({});
    return res.render('home',{
        user: req.user,
        blogs: allBlogs,
    });
})


app.use('/user',userRoute) 
app.use('/blog',blogRoute) 



app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
