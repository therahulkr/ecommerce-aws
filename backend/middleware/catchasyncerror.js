module.exports = (trycatcherr)=>(req,res,next)=>{
    
    Promise.resolve(trycatcherr(req,res,next)).catch(next);

}