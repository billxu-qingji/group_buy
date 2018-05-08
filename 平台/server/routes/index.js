const router = require('koa-router')()
const RES = require('../const/index');
const db = require('../db');

router.prefix('/api');

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/plant/info', async (ctx, next) => {
  try {
    const customerPromise = db.query('select count(*) from c_user');
    const businessPromise = db.query('select count(*) from b_user');
    const goodsPromise = db.query('select count(*) from goods');
    const orderPromise = db.query('select count(*) from orders');

    const [customerRes, businessRes, goodsRes, orderRes] = await Promise.all([customerPromise, businessPromise, goodsPromise, orderPromise]);
    console.log(customerRes);
    console.log(Object.keys(customerRes));
    if (customerRes && businessRes && goodsRes && orderRes) {
      const res = {
        customerNum: Object.values(customerRes[0])[0],
        businessNum: Object.values(businessRes[0])[0],
        goodsNum: Object.values(goodsRes[0])[0],
        orderNum: Object.values(orderRes[0])[0],
      };
      ctx.body = {
        ...RES.SUCCESS_RES,
        data: res,
      }
    } else {
      throw new Error('查询失败');
    }
  } catch (error) {
    ctx.body = {
      ...RES.Fail_RES,
      message: error.toString(),
    }
  }
})


module.exports = router
