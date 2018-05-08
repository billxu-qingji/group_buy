const router = require('koa-router')()
const RES = require('../const/index');
const db = require('../db');

router.prefix('/api/business')
router.get('/', async (ctx, next) => {
  try {
    const rows = await db.query('select * from b_user');
    console.log(rows);
    if (rows) {
      ctx.body = {
        ...RES.SUCCESS_RES,
        data: rows.map(item => {
          return {
            userid: item.b_user_id,
            username: item.b_user_username,
            storeName: item.b_user_store_name,
            createTime: item.b_user_create_time,
            userState: item.b_user_state,
          }
        }),
      }
    } else {
      throw new Error('获取数据失败');
    }
  } catch (error) {
    ctx.body = {
      ...RES.Fail_RES,
      message: error.toString(),
    }
  }

})
router.get('/active', async (ctx, next) => {
  try {
    const { userid } = ctx.request.query;
    const res = await db.query(`update b_user set b_user_state=1 where b_user_id=${userid}`);
    if (res) {
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
router.get('/forbidden', async (ctx, next) => {
  try {
    const { userid } = ctx.request.query;
    const res = await db.query(`update b_user set b_user_state=0 where b_user_id=${userid}`);
    if (res) {
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
router.post('/search', async (ctx, next) => {
  try {
    const { keyword } = ctx.request.body;
    const rows = await db.query(`select * from b_user where b_user_username like '%${keyword}%'`);
    if (rows) {
      ctx.body = {
        ...RES.SUCCESS_RES,
        data: rows.map(item => {
          return {
            userid: item.b_user_id,
            username: item.b_user_username,
            storeName: item.b_user_store_name,
            createTime: item.b_user_create_time,
            userState: item.b_user_state,
          }
        }),
      }
    } else {
      throw new Error('获取数据失败');
    }
  } catch (error) {
    ctx.body = {
      ...RES.Fail_RES,
      message: error.toString(),
    }
  }
})
module.exports = router
