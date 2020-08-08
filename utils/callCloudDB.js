const getAccessToken=require('./getAccessToken');
const rp=require('request-promise');

//封装查询云数据库的函数
const callCloudDB=async(ctx,fnName,query={})=>{
   const ACCESS_TOKEN=await getAccessToken();
   const options={
       method:'POST',
       uri:`https://api.weixin.qq.com/tcb/${fnName}?access_token=${ACCESS_TOKEN}`,
       body:{
           query,
           env:ctx.state.env,
       },
       json:true
   }
   return await rp(options).then((res)=>{
       return res;
   }).catch((err)=>{
       console.log(err);
   })
}
module.exports=callCloudDB