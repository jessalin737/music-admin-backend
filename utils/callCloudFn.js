const getAccessToken = require('./getAccessToken.js');
const rp=require('request-promise');
const { params, param } = require('../controller/playlist.js');


    const callCloudFn =async(ctx,fnName,params)=>{
    //查询歌单列表
    const access_token=await getAccessToken();
    const url=`https://api.weixin.qq.com/tcb/invokecloudfunction?access_token=${access_token}&env=${ctx.state.env}&name=${fnName}`;
    var options = {
        method: 'POST',
        uri: url,
        body: {
           ...params
        },
        json: true // Automatically stringifies the body to JSON
    };
    
    const data=await rp(options)
        .then((res)=> {
            return res;
        })
        .catch(function (err) {
            // POST failed...
        });
    ctx.body={
        data,
        code:20000
    }
}                 
module.exports=callCloudFn;