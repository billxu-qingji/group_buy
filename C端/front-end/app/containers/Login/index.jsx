import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { hashHistory } from 'react-router'
import { getFav } from '../../fetch/detail/detai';
import * as userInfoActionsFromOtherFile from '../../actions/userinfo'
import * as storeInfoActionsFromOtherFile from '../../actions/store';

import Header from '../../components/Header'
import LoginComponent from '../../components/Login'

class Login extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            checking: true
        }
    }
    render() {
        return (
            <div>
                <Header title="登录" />
                {
                    // 等待验证之后，再显示登录信息
                    this.state.checking
                        ? <div>{/* 等待中 */}</div>
                        : <LoginComponent loginHandle={this.loginHandle.bind(this)} />
                }
            </div>
        )
    }
    componentDidMount() {
        // 判断是否已经登录
        this.doCheck()
    }
    doCheck() {
        const userinfo = this.props.userinfo
        if (userinfo.username) {
            // 已经登录，则跳转到用户主页
            this.goUserPage();
        } else {
            // 未登录，则验证结束
            this.setState({
                checking: false
            })
        }
    }
    // 处理登录之后的事情
    loginHandle(obj) {
        // 保存用户名
        const actions = this.props.userInfoActions
        let userinfo = this.props.userinfo
        userinfo.username = obj.username;
        userinfo.userId = obj.userId;
        actions.update(userinfo)
        // 获取当前用户收藏商品
        this.getFavHandler(obj.userId);
        const params = this.props.params
        const router = params.router
        if (router) {
            // 跳转到指定的页面
            hashHistory.push(router)
        } else {
            // 跳转到用户主页
            this.goUserPage()
        }
    }
    getFavHandler(userId) {
        const actions = this.props.addStoreActions;
        console.log(actions);
        getFav(userId)
            .then(res => {
                return res.json();
            })
            .then(json => {
                const store = json.data.map(item => {
                    return {
                        id: item,
                    }
                })
                actions.add(store);
            })
            .catch(error => {
                console.log(error.toString());
            })
    }
    goUserPage() {
        hashHistory.push('/User')
    }
}

// -------------------redux react 绑定--------------------

function mapStateToProps(state) {
    return {
        userinfo: state.userinfo
    }
}

function mapDispatchToProps(dispatch) {
    return {
        userInfoActions: bindActionCreators(userInfoActionsFromOtherFile, dispatch),
        addStoreActions: bindActionCreators(storeInfoActionsFromOtherFile, dispatch),
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login)