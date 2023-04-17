const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = "this_is_a_secret_jwt_token_which_should_be_stored_in_Config_data_or_env_local_file";

//Route 1:-create a user using: POST "/api/auth/createuser". No requirement of login
router.post('/createuser',[

   // for applying validation layer
   body('name','Please enter a valid name').isLength({ min: 3 }),
   body('email','Please enter a valid email').isEmail(),
   body('password','Please enter a password of atleast 5 characters').isLength({ min: 5 }),

] ,async (req, res) => {
   //if there are errors return bad request along with the errors.
   const errors = validationResult(req);
   let success = false;
   if (!errors.isEmpty()) {
     return res.status(400).json({ errors: errors.array() });
   }

   try{
      //to check whwther the user with this email already exists or not.
      let user = await User.findOne({email: req.body.email});
      if(user){
         return res.status(400).json({success, error: "Oops Sorry! a user with this email already exists"})
      }

      //create a salt
      const salt = await bcrypt.genSalt(10);
      const secretPass = await bcrypt.hash(req.body.password, salt);
      //Create a new user
      user = await User.create({
         name: req.body.name,
         email: req.body.email,
         password: secretPass,
      });
      
      //generating auth token which secures the safe connection between client and server.
      const data = {
         user:{ id: user.id }
      }
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({success, authtoken});
      //  res.json(user);

   } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
   }
})

//Route 2:-Authenticate a user using: POST "/api/auth/login". No requirement of login
router.post('/login',[
   // for applying validation layer
   body('email','Please enter a valid email').isEmail(),
   body('password','Password cannot be blank').exists(),
] ,async (req, res) => {
   const errors = validationResult(req);
   let success = false;
   if (!errors.isEmpty()) {
     return res.status(400).json({ errors: errors.array() });
   }

   const {email, password} = req.body;
   try {
      let user = await User.findOne({email});
      if(!user){
         return res.status(400).json({success, error: "Please login with correct credentials."});
      }

      const passCompare = await bcrypt.compare(password, user.password);
      if(!passCompare){
         success = false;
         return res.status(400).json({success, error: "Please login with correct credentials."});
      }
      const data = {
         user:{ id: user.id }
       }
       const authtoken = jwt.sign(data, JWT_SECRET);
       success = true;
       res.json({success, authtoken});
   } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
   }
});

//Route 3:-Get loggedin user details using: POST "/api/auth/getuser".Login required
router.post('/getuser', fetchuser, async (req, res) => {
try {
   userId = req.user.id;
   const user = await User.findById(userId).select("-password")
   res.send(user);
   
} catch (error) {
   console.error(error.message);
   res.status(500).send("Internal Server Error");
}
});
module.exports = router;