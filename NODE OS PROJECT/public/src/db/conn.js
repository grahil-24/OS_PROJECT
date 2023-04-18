const mongoose =require("mongoose");

mongoose.connect("mongodb://0.0.0.0:27017/OS_VIRTUAL_LAB",
{
    useUnifiedTopology:true,
    useNewUrlParser:true
})
.then(()=>{
    console.log("Connection Successful to DB...");
})
.catch((e)=>{
    console.log("No Connection Established...");
});

