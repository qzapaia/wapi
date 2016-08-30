module.exports = function(req,res,next){
  if(!process.env.HOSTNAME){

    console.log('### process.env.HOSTNAME does not exists. resolving hostname automatically');
    process.env = process.env || {};

    process.env.HOSTNAME = (req.secure ? 'https://' : 'http://') + req.headers.host + req.originalUrl.replace(req.path,'');
  }
  next();
}
