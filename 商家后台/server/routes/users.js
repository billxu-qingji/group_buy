const router = require('koa-router')()
const db = require('../db');
const RES = require('../const');

router.prefix('/api/users')

router.get('/info', async (ctx, next) => {
  try {
    const { userid } = ctx.query;
    if (userid === 'undefined') return;
    const rows = await db.query(`select * from b_user where b_user_id=${userid}`);
    if (rows && rows[0]) {
      ctx.body = {
        ...RES.SUCCESS_RES,
        data: {
          id: rows[0].b_user_id,
          username: rows[0].b_user_username,
          email: rows[0].b_user_email,
          prefix: rows[0].b_user_prefix,
          phone: rows[0].b_user_phone,
          store_name: rows[0].b_user_store_name,
          city: rows[0].b_user_city,
        }
      }
    } else {
      throw new Error('未找到用户');
    }
  } catch (error) {
    ctx.body = {
      ...RES.Fail_RES,
      message: error.toString(),
    }
  }

})
router.post('/login', async (ctx, next) => {
  try {
    const rows = await db.query(`select * from b_user where b_user_username='${ctx.request.body.username}'`);
    if (rows[0] && rows[0].b_user_password === ctx.request.body.password) {
      if (!rows[0].b_user_state) {
        throw new Error('该用户已被禁用');
      }
      // 设置cookie过期时间
      const DAYS = 7;
      // 设置cookie
      ctx.cookies.set('userid', rows[0].b_user_id, {
        maxAge: DAYS * 60 * 60 * 24,
        httpOnly: false,
      })
      ctx.body = RES.SUCCESS_RES
    } else {
      throw new Error('用户名或密码不正确');
    }
  } catch (error) {
    ctx.body = {
      ...RES.Fail_RES,
      message: error.toString(),
    }
  }

})
router.post('/register', async (ctx, next) => {
  try {
    const { username, password, email, prefix, phone } = ctx.request.body;
    const res = await db.query(`insert into b_user (b_user_username,b_user_password,b_user_email,b_user_prefix,b_user_phone,b_user_state,b_user_create_time) values ('${username}','${password}','${email}','${prefix}','${phone}',1,now())`);
    if (res.affectedRows === 1) {
      ctx.body = RES.SUCCESS_RES;
    } else {
      throw new Error('注册失败');
    }
  } catch (error) {
    ctx.body = {
      ...RES.Fail_RES,
      message: error.toString(),
    }
  }
})
router.get('/store', async (ctx, next) => {
  try {
    const userid = ctx.request.query.userid;
    const goodsInfo = await db.query(`select goods_id, goods_price, goods_sale_num from goods where goods_b_user_id=${userid}`)
    if (goodsInfo) {
      const storeInfo = {};
      let orderNum = 0;
      let salesVolume = 0;
      goodsInfo.forEach(item => {
        orderNum += item.goods_sale_num;
        salesVolume += (item.goods_sale_num * item.goods_price);
      })
      ctx.body = {
        ...RES.SUCCESS_RES,
        data: {
          salesVolume,
          orderNum,
          daySalesVolume: parseInt(salesVolume / 4),
          goodsNum: goodsInfo.length,
        }
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
