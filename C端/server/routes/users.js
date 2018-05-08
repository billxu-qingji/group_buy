const router = require('koa-router')()
const db = require('../db');
const RES = require('../const/index');

router.prefix('/api/users')

router.post('/login', async (ctx, next) => {
  try {
    const { username, password } = ctx.request.body;
    console.log(username, password);
    rows = await db.query(`SELECT * from c_user where c_user_username='${username}'`);
    if (rows[0] && rows[0].c_user_password === password) {
      if(!rows[0].c_user_state){
        throw new Error('该用户已被禁用'); 
      }
      // 设置cookie过期时间
      const DAYS = 7;
      ctx.cookies.set('username', rows[0].c_user_username, {
        maxAge: DAYS * 60 * 60 * 24,
        httpOnly: false,
      });
      ctx.body = {
        ...RES.SUCCESS_RES,
        data: {
          userId: rows[0].c_user_id,
          username: rows[0].c_user_username
        },
      }
    } else {
      throw new Error('用户名或者密码不正确');
    }
  } catch (error) {
    ctx.body = {
      ...RES.Fail_RES,
      message: error.toString(),
    }
  }
})

module.exports = router
