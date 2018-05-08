const router = require('koa-router')()
const RES = require('../const/index');
const db = require('../db');

router.prefix('/api/home')

router.get('/ad', async (ctx, next) => {
  try {
    rows = await db.query('select * from ad');
    ctx.body = {
      ...RES.SUCCESS_RES,
      data: rows.map(item => {
        return {
          id: item.ad_id,
          img_url: item.ad_img_url,
          link: item.ad_link,
          title: item.ad_title,
        }
      }),
    }
  } catch (error) {
    ctx.body = {
      ...RES.Fail_RES,
      data: error.toString(),
    }
  }
})

router.get('/list', async (ctx, next) => {
  try {
    const rows = await db.query('select * from goods order by goods_create_time desc');
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
    }else{
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
