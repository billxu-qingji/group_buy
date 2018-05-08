const router = require('koa-router')()
const RES = require('../const/index');
const db = require('../db');

router.prefix('/api/order');

router.get('/', async (ctx, next) => {
  try {
    const uid = ctx.query.uid;
    const rows = await db.query(`select * from orders as o,goods as g where o.order_goods_id=g.goods_id and o.order_c_user_id=${uid} order by order_create_time desc`);
    const res = rows.map(item => {
      return {
        id: item.order_id,
        img: item.goods_img_url,
        title: item.goods_title,
        count: item.goods_sale_num,
        price: item.goods_price,
        commentState: item.order_comment_state,
      }
    })
    ctx.body = {
      ...RES.SUCCESS_RES,
      data: res,
    }
  } catch (error) {
    ctx.body = {
      ...RES.Fail_RES,
      message: error.toString(),
    }
  }
})

module.exports = router
