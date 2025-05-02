
const admin = require("firebase-admin");
const serviceAccount = require("./firebase-admin.json");
const Notification = require('./models/Notification'); // 🔁 Add this line


//all backend code
const port =5000;
const express = require("express") ;
const app = express() ;
const mongoose = require("mongoose") ;
const jwt = require("jsonwebtoken") ;
const path = require("path") ;
const cors = require("cors") ;
const { log, error } = require("console");
const { type } = require("os");
const e = require("express");

 


app.use(express.json()) ; 
app.use(cors()) ;

//Database connetion with mongodb
mongoose.connect("mongodb+srv://sauravthoke28:saurav@cluster0.07nhyvw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")  ;

//API Creation
app.get("/",(req,res)=>{
 res.send("Express App is running")
})

app.get('/notifications/:uid', async (req, res) => {
  const { uid } = req.params;

  try {
    const notifications = await Notification.find({ uid }).sort({ timestamp: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    console.error("❌ Error fetching notifications:", err);
    res.status(500).json({ message: "Server error" });
  }
});


//Schema creating for user model
const Users = mongoose.model('Users',{
    name:{
        type:String ,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    date:{
        type:Date,
        default:Date.now,
    }
})

//Creating endpoint for register the user
app.post('/signup',async (req,res)=>{
  let check = await Users.findOne({email:req.body.email}) ;
 if (check) {
    return res.status(400).json({success:false,errors:"exisiting user found with same email"})
 }
 
 const user = new Users({
    name:req.body.username,
    email:req.body.email,
    password:req.body.password,
 })
 await user.save() ;

 const data = {
    user:{
        id:user.id
    }
 }
 const token = jwt.sign(data,'secret_ecom') ;
 res.json({success:true,token})
})
//creating endpoint for user login
app.post('/login',async (req,res)=>{
    let user = await Users.findOne({email:req.body.email}) ;
    if(user){
        const passCompare = req.body.password === user.password ;
        if(passCompare){
            const data = {
                user :{
                    id : user.id 
                }
            }
            const token = jwt.sign(data,'secret_ecom') ;
            res.json({success:true,token}) ;
        }
        else{
            res.json({success:false,errors:"Wrong Password"}) ;
        }
    }
    else{
        res.json({success:false,errors:"Wrong Email Id"})
    }
})

//creating middleware to fetch user
const fetchUser = async (req,res,next) =>{
 const token = req.header('aut-token') ;
 if(!token){
    res.status(401).send({errors:"Please authenticate using valid token"})
 }
 else{
   try {
    const data = jwt.verify(token,'secret_ecom');
    req.user = data.user ;
    next() ;
   } catch (error) {
    res.status(401).send({errors:"please authenticate using valid token"})
   }
 }
}



// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Notification sender function
function sendNotification(token, title, body) {
  const message = {
    notification: {
      title,
      body,
    },
    token,
  };

  admin
    .messaging()
    .send(message)
    .then((response) => {
      console.log("✅ Successfully sent message:", response);
    })
    .catch((error) => {
      console.error("❌ Error sending message:", error);
    });
}

// Route to receive token and trigger a test notification
app.post("/send-notification", async (req, res) => {
  const { token } = req.body;
  
  if (!token || !uid) {
    return res.status(400).json({ message: "Token and UID are required" });
  }

  const title = "🔔 Test Notification";
  const body = "This is a test notification from the backend!";

  try {
    sendNotification(token, title, body);

    const newNotification = new Notification({
      uid,
      token,
      title,
      body,
    });

    await newNotification.save();

    res.status(200).json({ message: "Notification sent and stored" });
  } catch (err) {
    console.error("❌ Failed to send/save notification:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Start server
// const PORT = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
