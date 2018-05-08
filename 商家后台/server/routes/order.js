const router = require('koa-router')()
const db = require('../db');
const RES = require('../const');

router.prefix('/api/order')

function adapterData(data) {
  return data.map((item) => {
    return {
      orderId: item.order_id,
      orderState: item.order_state,
      goodsName: item.goods_title,
      userName: item.c_user_username,
      goodsNum: item.order_goods_num,
      orderNote: item.order_note,
      createTime: item.order_create_time,
    }
  })
}
router.get('/', async (ctx, next) => {
  try {
    const { userid } = ctx.request.query;
    const rows = await db.query(`select * from orders as o,b_user as b,c_user as c,goods as g where o.order_goods_id=g.goods_id and o.order_c_user_id=c.c_user_id and b.b_user_id=g.goods_b_user_id and b.b_user_id=${userid}`);
    console.log(rows);
    if (rows) {
      ctx.body = {
        ...RES.SUCCESS_RES,
        data: adapterData(rows),
      }
    } else {
      throw new Error('查找失败');
    }
  } catch (error) {
    ctx.body = {
      ...RES.Fail_RES,
      message: error.toString(),
    };
  }
})
router.get('/cancel', async (ctx, next) => {
  try {
    const orderId = ctx.request.query.id;
    const res = await db.query(`update orders set order_state=-1 where order_id=${orderId}`);
    if (res.affectedRows) {
      ctx.body = RES.SUCCESS_RES;
    } else {
      throw new Error('更新失败');
    }
  } catch (error) {
    ctx.body = {
      ...RES.Fail_RES,
      message: error.toString(),
    }
  }
})
router.get('/pass', async (ctx, next) => {
  try {
    const orderid = ctx.request.query.id;
    const res = await db.query(`update orders set order_state=1 where order_id=${orderid}`);
    console.log(res);
    if (res.affectedRows) {
      ctx.body = RES.SUCCESS_RES
    } else {
      throw new Error('更新失败');
    }
  } catch (error) {
    ctx.body = {
      ...RES.Fail_RES,
      message: error.toString(),
    }
  }
})
router.post('/screen', async (ctx, next) => {
  try {
    const screenInfo = ctx.request.body;
    let sqlStr = `select * from orders as o,b_user as b,c_user as c,goods as g where o.order_goods_id=g.goods_id and o.order_c_user_id=c.c_user_id and b.b_user_id=g.goods_b_user_id and b.b_user_id=${screenInfo.userid}`;
    Object.entries(screenInfo).forEach(([key, value]) => {
      if (value === null || value === '') return;
      switch (key) {
        case 'userName':
          sqlStr += ` and c.c_user_username='${value}'`;
          break;
        case 'goodsName':
          sqlStr += ` and g.goods_title='${value}'`;
          break;
        case 'orderState':
          sqlStr += ` and o.order_state=${value}`;
          break;
      }
    });
    console.log(sqlStr);
    const rows = await db.query(sqlStr);
    if (rows) {
      ctx.body = {
        ...RES.SUCCESS_RES,
        data: adapterData(rows),
      }
    } else {
      throw new Error('查找失败');
    }
  } catch (error) {
    ctx.body = {
      ...RES.Fail_RES,
      message: error.toString(),
    }
  }
})
module.exports = router