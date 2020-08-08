const rp = require('request-promise');

const APPID = 'wxa6caa1a7a6226406';

const APPSECRET = '8f99151c852f21b8fa7ef1deb5e1dcbc';
const URL = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`;
//写文件
const fs = require('fs');
const path = require('path');
const fileName = path.resolve(__dirname, './access_token.json');
// console.log(fileName);

const updateAccessToken = async () => {
    const resStr = await rp(URL);
    const res = JSON.parse(resStr);
    console.log(res);
    //写文件
    if (res.access_token) {
        fs.writeFileSync(fileName, JSON.stringify({
            access_token: res.access_token,
            createTime: new Date()
        }));
    } else {
        await updateAccessToken();
    }
}

const getAccessToken = async () => {
    try {
        //读取文件
        const readRes = fs.readFileSync(fileName, 'utf-8');
        const readObj = JSON.parse(readRes);
        // console.log(readObj);
        const createTime=new Date(readObj.createTime).getTime();
        const nowTime=new Date().getTime();
        if((nowTime-createTime)/1000/60/60>=2){
            await updateAccessToken();
            await getAccessToken();
        }
        return readObj.access_token;
    } catch (error) {
        await updateAccessToken();
        await getAccessToken();
    }

}
setInterval(async () => {
    await updateAccessToken()
}, (7200-300) * 1000);
// console.log(getAccessToken());
module.exports=getAccessToken;





