const category_type = [
  'jingdian',
  'ktv',
  'gouwu',
  'shenghuofuwu',
  'jianshenyundong',
  'meifa',
  'qinzi',
  'xiaochikuaican',
  'zizhucan',
  'jiuba',
  'meishi',
  'dianying',
  'jiudian',
  'xuixianyule',
  'waimai',
  'huoguo',
  'liren',
  'ktv',
  'dujiachuxing',
  'zuliaoanmo',
  'zhoubianyou',
  'ribencai',
  'spa',
  'jiehun',
  'jingdian',
  'xuexipeixun',
  'xican',
  'huochejipiao',
  'shaokao',
  'jiazhuang',
  'chongwu',
]
export function getCategoryId(category) {
  if (category === 'all') {
    return '';
  } else {
    return category_type.indexOf(category);
  }
} 