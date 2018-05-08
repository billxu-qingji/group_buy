const router = require('koa-router')()
const RES = require('../const/index');
const db = require('../db');

console.log('detail');
router.prefix('/api/detail')

router.get('/comment', async (ctx, next) => {
  try {
    const id = ctx.request.query.id;
    console.log(`select * from comment as c,c_user as u,order as o where c.comment_order_id=o.order_id and o.c_user_id=u.c_user_id and o.order_goods_id=${id}`);
    const rows = await db.query(`select * from comments as c,c_user as u,orders as o where c.comment_order_id=o.order_id and o.order_c_user_id=u.c_user_id and o.order_goods_id=${id}`);
    if (rows) {
      const res = rows.map(item => {
        return {
          username: item.c_user_username,
          comment: item.comment_comment,
          star: item.comment_star,
        }
      })
      ctx.body = {
        ...RES.SUCCESS_RES,
        data: res,
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
router.get('/info', async (ctx, next) => {
  try {
    const id = ctx.query.id;
    const starsPro = db.query(`select comment_star from orders,comments where comment_order_id=order_id and order_goods_id=${id}`)
    const rowsPro = db.query(`select * from goods where goods_id=${id}`);
    const [stars, rows] = await Promise.all([starsPro, rowsPro]);
    console.log(stars, rows);
    let aveStar = 0;
    if (stars.length) {
      const totalStar = stars.reduce((total, item) => {
        return total + item.comment_star;
      }, 0)
      aveStar = totalStar / stars.length;
    }
    if (rows) {
      const res = rows.map(item => {
        return {
          img: item.goods_img_url,
          title: item.goods_title,
          star: Math.round(aveStar),
          price: item.goods_price,
          subTitle: item.goods_sub_title,
          desc: item.goods_scribe
        }
      })
      ctx.body = {
        ...RES.SUCCESS_RES,
        data: res[0],
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
router.post('/buy', async (ctx, next) => {
  try {
    const { goodsId, userId } = ctx.request.body;
    const res = await db.query(`insert into orders (order_state,order_c_user_id,order_goods_id,order_goods_num,order_create_time,order_close_time,order_comment_state,order_note) values (0,${userId},${goodsId},1,now(),null,0,null)`);
    if (res.affectedRows) {
      ctx.body = RES.SUCCESS_RES;
      // 更新销售数量
      const goodsRow = await db.query(`select goods_sale_num from goods where goods_id=${goodsId}`);
      console.log(goodsRow);
      if (goodsRow) {
        const saleNum = goodsRow[0].goods_sale_num;
        const result = await db.query(`update goods set goods_sale_num=${saleNum + 1} where goods_id=${goodsId}`)
      }
    } else {
      throw new Error('插入失败');
    }
  } catch (error) {
    ctx.body = RES.Fail_RES;
  }
})
router.post('/fav/add', async (ctx, next) => {
  try {
    const { userId, goodsId } = ctx.request.body;
    const favs = await db.query(`select c_user_fav from c_user where c_user_id=${userId}`);
    if (favs) {
      let favsArr = [];
      if (favs[0].c_user_fav === null || favs[0].c_user_fav === '') {
        favsArr = [goodsId];
      } else {
        const oldFavs = favs[0].c_user_fav.split(',');
        if (oldFavs.indexOf(goodsId) !== -1) {
          ctx.body = RES.SUCCESS_RES;
          return;
        };
        favsArr = [...favs[0].c_user_fav.split(','), goodsId];
      }
      const res = await db.query(`update c_user set c_user_fav='${favsArr.join(',')}' where c_user_id=${userId}`)
      if (res.affectedRows) {
        ctx.body = RES.SUCCESS_RES;
      } else {
        throw new Error('更新失败');
      }
    } else {
      throw new Error('查找失败');
    }
  } catch (error) {
    ctx.body = RES.Fail_RES;
  }
})
router.post('/fav/del', async (ctx, next) => {
  try {
    const { userId, goodsId } = ctx.request.body;
    const favs = await db.query(`select c_user_fav from c_user where c_user_id=${userId}`);
    console.log(favs);
    if (favs) {
      if (favs[0].c_user_fav === null) {
        ctx.body = RES.SUCCESS_RES;
        return;
      }
      const oldFavs = favs[0].c_user_fav.split(',');
      const index = oldFavs.indexOf(goodsId);
      if (index === -1) {
        ctx.body = RES.SUCCESS_RES;
        return;
      };
      oldFavs.splice(index, 1);
      const res = await db.query(`update c_user set c_user_fav='${oldFavs.join(',')}' where c_user_id=${userId}`)
      if (res.affectedRows) {
        ctx.body = RES.SUCCESS_RES;
      } else {
        throw new Error('更新失败');
      }
    } else {
      throw new Error('查找失败');
    }
  } catch (error) {
    ctx.body = RES.Fail_RES;
  }
})
router.get('/fav', async (ctx, next) => {
  try {
    console.log('fav com in');
    const { userid } = ctx.request.query
    const fav = await db.query(`select c_user_fav from c_user where c_user_id=${userid}`)
    if (fav && fav[0]) {
      const favs = fav[0].c_user_fav.split(',');
      ctx.body = {
        ...RES.SUCCESS_RES,
        data: favs,
      }
    } else {
      throw new Error('查找失败');
    }
  } catch (error) {
    ctx.body = {
      ...rows,
      data: error.toString(),
    }
  }
})
module.exports = router
