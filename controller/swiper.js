const Router=require('koa-router');
const router=new Router();
const callCloudDB=require('../utils/callCloudDB.js');
const cloudStorage=require('../utils/callCloudStorage.js');

router.get('/list',async(ctx,next)=>{
   const query=`db.collection('swiper').get()`
   const res=await callCloudDB(ctx,'databasequery',query);
   //console.log(res);
   let fileList=[];
   let data=res.data;
   for(let i=0;i<data.length;i++){
       fileList.push({
        fileid:JSON.parse(data[i]).fileid,
        max_age:7200
       })
   }

   const dlRes=await cloudStorage.download(ctx,fileList);
   console.log(dlRes);
   let returnData=[];
   for(let i=0;i<dlRes.file_list.length;i++){
       returnData.push({
           download_url:dlRes.file_list[i].download_url,
           fileid:dlRes.file_list[i].fileid,
           _id:JSON.parse(data[i])._id
       })
   }
   ctx.body={
       code:20000,
       data:returnData
   }
})

//上传图片


router.post('/upload', async(ctx, next)=>{
    //上传云存储
    const fileid =  await cloudStorage.upload(ctx)
    console.log(fileid)
    //将云存储所获取到的值存入数据库中
     const query = `
         db.collection('swiper').add({
             data: {
                 fileid: '${fileid}'
             }
         })
     `
    const res = await callCloudDB(ctx, 'databaseadd', query)
    ctx.body = {
        code: 20000,
        id_list: res.id_list
    }
 })

router.get('/del',async(ctx,next)=>{
    //删除云数据库中的轮播图,_id是在数据库中的标识
    const params=ctx.request.query;
    const query=`db.collection('swiper').doc('${params._id}').remove()`
    const delDBRes=await callCloudDB(ctx,'databasedelete',query)

    //删除云存储中的轮播图
   const delStorageRes=await cloudStorage.delete(ctx,[params.fileid]);
   ctx.body={
       code:20000,
       data:{
        delDBRes,
        delStorageRes
       }
   }
})

module.exports=router