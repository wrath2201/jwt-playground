const redis=require('redis')

const redisClient=redis.createClient()

redisClient.on('error',(err)=>console.error('redis error:',err));
redisClient.on('connect',()=>console.log('redis connected'))

redisClient.connect();

module.exports=redisClient;