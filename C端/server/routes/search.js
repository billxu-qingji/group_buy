const router = require('koa-router')()
const RES = require('../const/index');
const db = require('../db');

router.prefix('/api/search');
router.get('/', async (ctx, next) => {
  try {
    const { page, category, cityName, keyword } = ctx.request.query;
    let rows;
    if (!keyword) {
      rows = await db.query(`select * from goods as g, b_user as b where g.goods_b_user_id=b.b_user_id and g.goods_type=${category} and b.b_user_city='${cityName}'`);
    } else if (!category) {
      console.log(`select * from goods as g, b_user as b where g.goods_b_user_id=b.b_user_id and g.goods_title='%${keyword}%' and b.b_user_city='${cityName}'`);
      rows = await db.query(`select * from goods as g, b_user as b where g.goods_b_user_id=b.b_user_id and g.goods_title like '%${keyword}%' and b.b_user_city='${cityName}'`);
    }
    if (rows) {
      const res = rows.map(item => {
        return {
          id: item.goods_id,
          img_url: item.goods_img_url,
          title: item.goods_title,
          subTitle: item.goods_sub_title,
          price: item.goods_price,
          distance: 12,
          mumber: item.goods_sale_num,
        }
      })
      ctx.body = {
        ...RES.SUCCESS_RES,
        data: res,
      }
    }
  } catch (error) {
    ctx.body = {
      ...RES.Fail_RES,
      message: error.toString(),
    }
  }
})

module.exports = router
