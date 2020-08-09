const Router=require('koa-router');
const router=new Router();
const callCloudFn=require('../utils/callCloudFn');
const callCloudDB=require('../utils/callCloudDB.js');

//获取数据使用get,查询歌单信息
router.get('/list', async (ctx, next) => {
    const query = ctx.request.query
    const res = await callCloudFn(ctx, 'music', {
        $url: 'playlist',
        start: parseInt(query.start),
        count: parseInt(query.count)
    })
    let data = []
    if (res.resp_data) {
        data = JSON.parse(res.resp_data).data
    }
    ctx.body = {
        data,
        code: 20000,
    }
})

//获取编辑行的ID
router.get('/getById',async(ctx,next)=>{
    //直接通过HTTP API查询ip地址
    const query=`db.collenction('playlist').doc('${ctx.request.query.id}').get()`;
    const res=await callCloudDB(ctx,'databasequery',query);
    ctx.body={
        code:20000,
        data:JSON.parse(res.data),
    }
})
//更新歌单详情信息
router.post('/updatePlaylist',async(ctx,next)=>{
   const params=ctx.request.body;
   const query=`db.collection('playlist').doc('${params._id}')
   .data{
       name:'${params.name}',
       copywriter:'${params.copywriter}'
   }`

   const res=await callCloudDB(ctx,'databaseupdate',query);
   ctx.body={
       code:20000,
       data:res
   }
})
//删除歌单
router.get('/del',async(ctx,next)=>{
    const params=ctx.request.body;
    const query=`db.collection('playlist').doc('${params.id}')`;

    const res=await callCloudDB(ctx,'databasedelete',query);
    ctx.body={
        code:20000,
        data:res
    }
})

module.exports=router;