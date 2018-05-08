import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { getOrderListData, postComment } from '../../../fetch/user/orderlist'
import { getFav } from '../../../fetch/detail';
import OrderListComponent from '../../../components/OrderList'

import './style.less'

class OrderList extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.state = {
      data: []
    }
  }
  render() {
    return (
      <div className="order-list-container">
        <h2>我的收藏</h2>
        {
          this.state.data.length
            ? <OrderListComponent data={this.state.data} submitComment={this.submitComment.bind(this)} />
            : <div>{/* loading */}</div>
        }
      </div>
    )
  }
  componentDidMount() {
    // 获取订单数据
    const userId = this.props.userId
    if (userId !== 'undefined') {
      this.loadOrderList(userId)
    }
  }
  // 获取列表数据
  loadOrderList(userId) {
    const result = getFav(userId)
    result.then(res => {
      return res.json()
    }).then(json => {
      // 获取数据
      this.setState({
        data: json.data
      })
    }).catch(ex => {
      if (__DEV__) {
        console.error('用户主页“订单列表”获取数据报错, ', ex.message)
      }
    })
  }
}

export default OrderList