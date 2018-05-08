const router = require('koa-router')()
const db = require('../db');

router.prefix('/api/store')

router.post('/login', async (ctx, next) => {
  
})
module.exports = router