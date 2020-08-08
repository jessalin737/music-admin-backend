const Router=require('koa-router');
const router=new Router();
const callCloudFn=require('../utils/callCloudFn');
const callCloudDB=require('../utils/callCloudDB');

//获取数据使用get
router.get('/list',async(ctx,next)=>{
    //查询歌单列表
    const access_token=await getAccessToken();
    const url=`https://api.weixin.qq.com/tcb/invokecloudfunction?access_token=${access_token}&env=${ENV}&name=music`
    const query=ctx.request.query;
    const res=await callCloudFn(ctx,'music',{
        $url:'playlist',
        start:parseInt(query.start),
        count:parseInt(query.count)
    })
    let data=[];
    if(res.resp_data){
        data=JSON.parse(res.resp_data).data;
    }
    ctx.body={
        data,
        code:20000
    }
})
//获取编辑行的ID
router.get('/getById',async(ctx,next)=>{
    //直接通过HTTP API查询ip地址
    const query=`db.collenction('playlist').doc('${ctx.request.query.id}').get()`;
    const res=await callCloudDB(ctx,'databasequery',query);
    ctx.body={
        data:JSON.parse(res.data),
        code:20000,
    }
})

module.exports=router;