import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { login } from '../../fetch/user/log';
import './style.less'

class Login extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            username: '',
            password: ''
        }
    }
    render() {
        return (
            <div id="login-container">
                <div className="input-container phone-container">
                    <i className="icon-tablet"></i>
                    <input
                        type="text"
                        placeholder="输入账号"
                        onChange={(e) => { this.changeHandle('username', e.target.value) }}
                        value={this.state.username}
                    />
                </div>
                <div className="input-container password-container">
                    <i className="icon-key"></i>
                    {/* <button>发送验证码</button> */}
                    <input
                        type="password"
                        placeholder="输入密码"
                        onChange={(e) => { this.changeHandle('password', e.target.value) }}
                    />
                </div>
                <button className="btn-login" onClick={this.clickHandle.bind(this)}>登录</button>
            </div>
        )
    }
    changeHandle(type, value) {
        this.setState({
            [type]: value
        })
    }
    clickHandle() {
        const { username, password } = this.state;
        const result = login(this.state);
        result
            .then(res => res.json())
            .then(json => {
                const loginHandle = this.props.loginHandle
                loginHandle(json.data);
            })
            .catch(error => {
                console.log(error.toString());
            })
    }
}

export default Login