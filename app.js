const Koa = require('koa')
const app = new Koa()
const Router = require('koa-router')
const router = new Router()
const cors = require('koa2-cors')
const koaBody = require('koa-body')

const ENV = 'test-4a705'

// 安装koa2-cors插件实现跨域
app.use(cors({
    origin: ['http://localhost:9528'],
    credentials: true
}))

// 接收post参数解析，post信息在body中所以需要使用koa-body
app.use(koaBody({
    multipart: true,
}))

//定义全局ENV的值
app.use(async (ctx, next)=>{
    console.log('全局中间件')
    // ctx.body = 'Hello Wolrd'
    ctx.state.env = ENV
    await next()
})

const playlist = require('./controller/playlist.js')
const swiper=require('./controller/swiper.js')

router.use('/playlist', playlist.routes())
router.use('/swiper', swiper.routes())


app.use(router.routes())
app.use(router.allowedMethods())



app.listen(3000, ()=>{
    console.log('服务开启在3000端口')
})

