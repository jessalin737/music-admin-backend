const getAccessToken=require('./getAccessToken.js');
const rp=require('request-promise');
const fs=require('fs');
const { param } = require('../controller/swiper.js');

const cloudStorage={
    async download(ctx,fileList){
        const ACCESS_TOKEN=await getAccessToken();
        const options={
            method:'POST',
            uri:`https://api.weixin.qq.com/tcb/batchdownloadfile?access_token=${ACCESS_TOKEN}`,
            body:{
              env:ctx.state.env,
              file_list:fileList
            },
            json:true
        }
        return await rp(options)
        .then((res)=>{
            return res;
        }).catch(function(err){

        })

      },
    async upload(ctx){
        const ACCESS_TOKEN=await getAccessToken();
        //1.请求地址
        const file=ctx.request.files.file;
        const path=`swiper/${Date.now()}-${Math.random()}-${file.name}`;
        const options={
            method:'POST',
            uri:` https://api.weixin.qq.com/tcb/uploadfile?access_token=${ACCESS_TOKEN}`,
            body:{
              path,
              env:ctx.state.env
            },
            json:true
        };

        const info=await rp(options)
        .then((res)=>{
            return res;
        }).catch((err)=>{
            console.log(err);
        })
        // console.log(info);
        //2.上传图片前先拼装一个 HTTP POST 请求
        const params={
            method:'POST',
            headers:{
                'content-type':'multipart/form-data'
            },
            uri:info.url,
            formaData:{
               key:path,
               Signature:info.authorization,
               'x-cos-security-token':info.token,
               'x-cos-meta-fileid':info.cos_file_id,
               //利用node中的fs模块读取文件的二进制内容
               file:fs.createReadStream(file.path)
            },
            json:true
        }
        await rp(params)
        return info.file_id

    }

}
module.exports=cloudStorage