const {Router} = require('express');
const User = require('../models/user')
const router = Router();

router.get('/signin',(req,res)=>{
    return res.render("signin")
})
router.get('/signup',(req,res)=>{
    return res.render("signup");
})

router.post('/signup', async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.render('signup', {
                error: 'User is already registered with this email.'
            });
        }
        await User.create({
            fullName,
            email,
            password,
        });

    
        return res.redirect('/');
        
    } catch (error) {
        console.error("Error during signup:", error);
        return res.status(500).send({ error: "An error occurred during the sign up process." });
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