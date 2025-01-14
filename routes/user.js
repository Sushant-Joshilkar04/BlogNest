const {Router} = require('express');
const User = require('../models/user')
const router = Router();

router.get('/signin',(req,res)=>{
    return res.render("signin")
})
router.get('/signup',(req,res)=>{
    return res.render("signup",{error:null});
})

router.post('/signup', async (req, res) => {
    const { fullName, password, email } = req.body;

    try {
        await User.create({
            fullName,
            email,
            password,
        });

        return res.redirect('/');
    } catch (err) {
        console.error("Error during signup:", err.message);

        const errorMessage = err.code === 11000 
            ? "Email is already registered !"
            : "An unexpected error occurred. Please try again.";

        return res.render('signup', { error: errorMessage });
    }
});


router.post('/signin',async(req,res)=>{
    const { password , email  } = req.body;
    try {
        const token =await User.matchPasswordAndGenerateToken(email,password);
        console.log("Token",token);
        return res.cookie('token',token).redirect('/');
    } catch (error) {
        return res.render('signin',{
            error:"Incorrect Email or Password",
        });
    }
    

})

router.get('/', (req, res) => {
    return res.render('home', { user: req.user });
});

router.get('/logout',(req, res)=>{
    res.clearCookie('token').redirect('/');
})

module.exports=router;