const express = require("express");
const mongoose = require("mongoose");
var cors = require('cors');
const passport = require("passport");
const bodyParser = require("body-parser");
const LocalStrategy = require("passport-local").Strategy;
const jwt = require("jsonwebtoken");
const multer = require("multer")
const app = express();
const path = require("path")


// app.use('/uploads', express.static(path.join(__dirname, '/src/backend/uploads')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // specify the directory to save the files
  },
  filename: (req, file, cb) => {
    const uniqueSuffix =Date.now() + "-" + Math.round(Math.random()*1E9)
    cb(null, uniqueSuffix + '-' + file.originalname); // specify the filename
  }
});

app.use(cors({origin: true, credentials: true})); //allow to domains/servers to exchange data or to communicate (communication b/w frontend & backened)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // This middleware helps your app to read JSON data sent in requests. If a request has JSON data (like {"name": "John", "age": 30}), this middleware will convert it into a JavaScript object and make it available in req.body for your app to use.
app.use(passport.initialize());
const port = 8163;


mongoose
  .connect("mongodb://127.0.0.1:27017/chatApp")
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.log("error", err);
  });

app.listen(port, () => {
  console.log(`running on port:${port}`);
});
// run app with npm  start bcz u use start command in package.json

//controller functions

//user

const UserModel = require("../backend/models/userModel");
const MessageModel = require("../backend/models/messageModel");
const message = require("../backend/models/messageModel");

/// register
app.post("/register", (req, res) => {
  const { name, email, password, image } = req.body;
  const createdUser = new UserModel({name, email, password, image})
  createdUser.save().then(()=>{
    res.status(200).json({
        message:" user is created"
    })
  }).catch(()=>{
    console.log("error while creating a user"); 
    res.status(500).json({
        message:" user is not created"
    })
})
});

//Token
const createToken =(id)=>{
const  payload={
     userId:id
  }
  const Token = jwt.sign(payload,"asdzxcqwe",{expiresIn:"1h"})
  return Token
}




//login 
app.post("/login", async(req,res)=>{

const {email,password}=req.body;

if(!email || !password){
 return res.status(400).json({
message:"please provide email and password",
 })
}
// console.log(email);
const data = await UserModel.findOne({email})
// console.log(data);
if(!data){
  return  res.status(401).json({ message:"user not found" })
}
// console.log(data);
if(data.password!=password){
  
return res.status(401).json({ message:"wrong password" })
}
 
const Token =createToken(data._id)
if(!Token){
  return res.status(401).json({message:"Error In Token generation"})
}
 return res.status(200).json({ message:"login success", token:Token })

})



// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password) {
//     return res.status(400).json({
//       message: "Please provide email and password",
//     });
//   }

//   try {
//     const user = await UserModel.findOne({ email });

//     if (!user) {
//       return res.status(400).json({ message: "User not found" });
//     }

//     if (user.password !== password) {
//       return res.status(400).json({ message: "Wrong password" });
//     }

//     const token = createToken(user._id);

//     if (!token) {
//       return res.status(500).json({ message: "Error in token generation" });
//     }

//     res.status(200).json({ message: "Login success", token });
//   } catch (err) {
//     console.error("Error in login:", err);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });


// Fetch all users except the logged in ones


app.get("/user/:userId",async(req,res)=>{

  const userId = req.params.userId
const users = await UserModel.find({ _id: { $ne: userId } });
if(!users || users.length ==0) {
  console.log("no users found");
}
  // console.log(users);
  res.json(users)

})

// friend-request
app.post('/friend-request',async(req,res)=>{
const {currentUserId, selectedUserID } = req.body
console.log(selectedUserID);
try {
 await UserModel.findByIdAndUpdate(selectedUserID,{
    $push:{firendRequests:currentUserId}
  }
  )
  await UserModel.findByIdAndUpdate(currentUserId,{
$push:{sentFriendRequests:selectedUserID}
  })
  const data = await UserModel.findById(currentUserId)
  console.log(data);
  res.sendStatus(200)
  console.log("ok");
} catch (error) {
  res.sendStatus(200)

  console.log(error);
}



})

app.get("/friend-requests/:userId",async(req,res)=>{

  try {
    const {userId} = req.params
const data = await UserModel.findById(userId).populate("firendRequests","name email image").lean()
const firendRequests = data.firendRequests
console.log(firendRequests);
if(firendRequests){
 return res.json(firendRequests)
}else{
return  res.json({
    message:"no friend request"
  })
}
  } catch (error) {
    console.log("error while fetching friends",error);
  }

})



app.post("/friend-request/accept",async(req,res)=>{
  const {senderId,recipientId}  =req.body
//  await UserModel.findByIdAndUpdate(userId,{
//   $push:{friends:FriendReqUser}
// })
// await UserModel.findByIdAndUpdate(FriendReqUser,{
// $push:{friends:userId}
//  })
// res.json(200)
try {
  const Sender = await UserModel.findById(senderId)
const Recipient = await UserModel.findById(recipientId)

Sender.friends.push(recipientId)
Recipient.friends.push(senderId)

Recipient.firendRequests= Recipient.firendRequests.filter(requests => requests.toString() !== senderId.toString())
Sender.sentFriendRequests = Sender.sentFriendRequests.filter(requests =>requests.toString() !== recipientId.toString())

await Sender.save()
await Recipient.save()

res.status(200).json({message:"Friend Request Send Successfully"})
} catch (error) {
  console.log("Internal Server Error",error);
}
})


// get  all friends of a user
app.get("/chat/:userId",async(req,res)=>{
try {
  const {userId} = req.params

const user = await UserModel.findById(userId).populate("friends","name email image")
const FriendsList = user.friends
// console.log(user.friends);
res.json(FriendsList)

} catch (error) {
  console.log("Internal Server Error",error);
}

})





// send a new message 
// const upload = multer({storage:storage})
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // Limit file size to 10MB
  },
  fileFilter: (req, file, cb) => {
    // Accept only images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});



app.post("/messages",upload.single("imageFile"),async (req,res)=>{
  try {
    const {senderId,recipientId,messageType,messageText} = req.body

const message = new MessageModel({
  senderId,
  recipientId,
  messageType,
  messageText,
 time: new Date(),
 imageUrl:messageType=== "image"? req.file.path :null
})
console.log(message.imageUrl);
await message.save()
res.status(200).json({
  message:"Message sent successfully"
})
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:"Internal server error of multer"
    })
  }
})

// find the recipient id in the one-on-one chat


app.get("/user/find/:recipientId",async(req,res)=>{

  try {
    const {recipientId}= req.params
    const user = await UserModel.findById(recipientId)
    console.log(user);
    res.json(user)
        
  } catch (error) {
console.log(error);    
  }
})


app.get("/messages/:senderId/:recipientId",async(req,res)=>{

  try {
    const {senderId,recipientId} = req.params

    const messages = await MessageModel.find({
    $or:[
    {senderId:senderId,recipientId:recipientId}, 
    {senderId:recipientId,recipientId:senderId}
    ]
    }).populate("senderId","_id name")
    res.json(messages)
        
  } catch (error) {
console.log(error);
res.status(500).json({message:"Internal server error"})    
  }

})


app.post("/deleteMessages",async(req,res)=>{

try {
const {messages} = req.body
console.log(messages);
if(!Array.isArray(messages) || messages.length === 0){
  return res.status(500).json("invalid req of messages")
}
await MessageModel.deleteMany({_id: {$in:  messages } })
return res.json("messages deleted successfully")
} catch (error) {
  console.log("internal server error",error);
  
}


})


app.get("/friends/:userId",async(req,res)=>{
try {
  const {userId} = req.params

const FriendList =  await UserModel.findById(userId).populate("friends","name email")

res.json(FriendList)

} catch (error) {
  res.json("error of internal server",error)
}

} )

// app.get("/friendRequests/:userId",async(req,res)=>{
// try {
  
// const {userId} = req.params

// const friendReq = await UserModel.findById(userId).populate("sentFriendRequests","name email ")
// console.log();
// const mapfunc = friendReq.sentFriendRequests
// const FriendReqData = friendReq.sentFriendRequests.map((_id) => friend._id )
// console.log(FriendReqData);
// if(FriendReqData){
//   return res.json(FriendReqData)
// }
// else{
//   res.json("there is no Friend req")
// }

// // res.json(FriendReqData)
// } catch (error) {
// res.json("error while fetching friend Request",error)

// }



// })


app.get("/friendRequests/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch user with populated friend requests
    const user = await UserModel.findById(userId).populate("sentFriendRequests", "name email");

    if (!user || !user.sentFriendRequests) {
      return res.status(404).json({ message: "No friend requests found" });
    }

    // Map the friend requests to get only the IDs
    const friendReqData = user.sentFriendRequests.map((friend) => (friend._id));

    console.log(friendReqData); // Log the friend request data

    return res.json(friendReqData);
  } catch (error) {
    console.error("Error while fetching friend requests:", error);
    return res.status(500).json({ message: "Error while fetching friend requests", error });
  }
});
