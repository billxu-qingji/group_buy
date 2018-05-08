const router = require('koa-router')()
const RES = require('../const/index');
const db = require('../db');

router.prefix('/api/users')
router.get('/info', async (ctx, next) => {
  try {
    const { userid } = ctx.query;
    if (userid === 'undefined') return;
    const rows = await db.query(`select * from p_user where p_user_id=${userid}`);
    if (rows && rows[0]) {
      ctx.body = {
        ...RES.SUCCESS_RES,
        data: {
          id: rows[0].p_user_id,
          username: rows[0].p_user_username,
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
  rows = await db.query(`SELECT * from p_user where p_user_username='${ctx.request.body.username}'`);
  if (rows[0] && rows[0].p_user_password === ctx.request.body.password) {
    // 设置cookie过期时间
    const DAYS = 7;
    // 设置cookie
    ctx.cookies.set('userid', rows[0].p_user_id, {
      maxAge: DAYS * 60 * 60 * 24,
      httpOnly: false,
    });
    ctx.body = {
      "success": "true",
      "message": ""
    }
  } else {
    ctx.body = {
      "success": "false",
      "message": "username or password error!"
    }
  }
})

module.exports = router
