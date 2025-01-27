const mongoose = require("mongoose")

const messageSchema =new mongoose.Schema({
senderId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
},
recipientId:{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
},
messageType:{
    type:String,
    enum:["text","image"]    
},
messageText:String,
imageUrl:String,
time:{
    type:Date,
    default: Date.now
}
})

const message= mongoose.model("Message",messageSchema)

module.exports= message;
