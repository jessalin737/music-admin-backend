const getAccessToken = require('./getAccessToken.js')
const rp = require('request-promise')

//利用云函数请求云数据库中的内容
const callCloudFn = async (ctx, fnName, params) => {
    const ACCESS_TOKEN = await getAccessToken()
    const options = {
        method: 'POST',
        uri: `https://api.weixin.qq.com/tcb/invokecloudfunction?access_token=${ACCESS_TOKEN}&env=${ctx.state.env}&name=${fnName}`,
        body: {
            ...params
        },
        json: true 
    }

    return await rp(options)
        .then((res) => {
            return res
        })
        .catch(function (err) {
        })
}

module.exports = callCloudFn