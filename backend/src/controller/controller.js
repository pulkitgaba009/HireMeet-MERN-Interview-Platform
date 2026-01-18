const getRoute = (req,res)=>{
    res.status(200).json({message:"Get route is working..."});
    console.log("working");
}

export {getRoute};