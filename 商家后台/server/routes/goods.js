const router = require('koa-router')()
const db = require('../db');
const RES = require('../const');

router.prefix('/api/goods')

router.get('/', async (ctx, next) => {
  try {
    const { userid } = ctx.request.query;
    const rows = await db.query(`select * from goods where goods_b_user_id=${userid} order by goods_create_time desc`);
    ctx.body = {
      ...RES.SUCCESS_RES,
      data: rows,
    }
  } catch (error) {
    ctx.body = {
      ...RES.Fail_RES,
      message: error.toString(),
    }
  }
})
router.post('/add', async (ctx, next) => {
  try {
    const goodsInfo = ctx.request.body;
    const imgurl = 'http://localhost:4001/images/list/2.png';
    const res = await db.query(
      `insert into goods (goods_title,goods_sub_title,goods_price,goods_scribe,goods_type,goods_img_url,goods_sale_num,goods_create_time,goods_update_time,goods_b_user_id) values ('${goodsInfo.title}','${goodsInfo.subTitle}',${goodsInfo.price},'${goodsInfo.desc}',${goodsInfo.type},'${goodsInfo.imgUrl}',${0},now(),now(),${goodsInfo.userid})`
    )
    if (res.affectedRows) {
      ctx.body = RES.SUCCESS_RES;
    } else {
      throw new Error('插入失败');
    }
  } catch (error) {
    ctx.body = {
      ...RES.Fail_RES,
      message: error.toString(),
    }
  }
})
router.post('/del', async (ctx, next) => {
  try {
    const { delGoodsId } = ctx.request.body;
    if (!delGoodsId.length) return;
    let sqlStr = 'delete from goods where ';
    delGoodsId.forEach((id, index) => {
      if (index === 0) {
        sqlStr += `goods_id=${id}`
      } else {
        sqlStr += ` or goods_id=${id}`;
      }
    })
    const res = await db.query(sqlStr);
    if (res.affectedRows) {
      ctx.body = RES.SUCCESS_RES;
    } else {
      throw new Error('删除失败');
    }
  } catch (error) {
    ctx.body = {
      ...RES.Fail_RES,
      message: error.toString(),
    }
  }
})
router.post('/update', async (ctx, next) => {
  try {
    const { goodsid, desc, price, subTitle, title, type, imgUrl } = ctx.request.body;
    const res = await db.query(`update goods set goods_scribe='${desc}',goods_price=${price},goods_sub_title='${subTitle}',goods_title='${title}',goods_type=${type},goods_img_url='${imgUrl}' where goods_id=${goodsid}`);
    if (res.affectedRows) {
      ctx.body = RES.SUCCESS_RES;
    } else {
      throw new Error('修改失败');
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
    const { userId, screenValue } = ctx.request.body;
    const rows = await db.query(`select * from goods where goods_b_user_id=${userId} and goods_title like '%${screenValue}%' order by goods_create_time desc`);
    if (rows) {
      ctx.body = {
        ...RES.SUCCESS_RES,
        data: rows,
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