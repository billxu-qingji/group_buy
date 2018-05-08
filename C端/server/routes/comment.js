const router = require('koa-router')()
const RES = require('../const/index');
const db = require('../db');

router.prefix('/api/comment');

router.post('/add', async (ctx, next) => {
  try {
    const { id, comment, star } = ctx.request.body;
    const res = await db.query(`insert into comments (comment_order_id,comment_comment,comment_star) values (${id},'${comment}',${star})`);
    if (res.affectedRows) {
      ctx.body = RES.SUCCESS_RES;
      const result = await db.query(`update orders set order_comment_state=2 where order_id=${id}`);
      if (!result.affectedRows) {
        throw new Error('修改评论状态失败');
      }
    } else {
      throw new Error('插入失败');
    }
  } catch (error) {
    ctx.body = {
      ...RES.Fail_RES,
      messsage: error.toString(),
    }
  }
})

module.exports = router
