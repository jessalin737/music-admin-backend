const Koa=require('koa');
const app=new Koa();
const Router=require('koa-router');
const router=new Router();
const cors=require('koa2-cors');
const ENV='test-4a705';
//cors方案允许指定的前端端口向后端发送请求
app.use(cors({
    origin:['http://localhost:9528'],
    credentials:true
}))

app.use(async (ctx,next)=>{
   console.log('全局中间件');
   ctx.state.env=ENV;
   next();
 })
//获取playlist.js中的路由名称，并且定义路由的名字为playlist
const playlist=require('./controller/playlist.js');
router.use('/playlist',playlist.routes());

app.use(router.routes());
app.use(router.allowedMethods());


app.listen(3000,()=>{
    console.log('3000端口的服务正在启动');
});
