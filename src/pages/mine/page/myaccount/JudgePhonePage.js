import { InteractionManager, TouchableOpacity, View } from 'react-native';
import React from 'react';
import BasePage from '../../../../BasePage';
import ScreenUtils from '../../../../utils/ScreenUtils';
import StringUtils from '../../../../utils/StringUtils';
import bridge from '../../../../utils/bridge';
import { TimeDownUtils } from '../../../../utils/TimeDownUtils';
import MineAPI from '../../api/MineApi';
import user from '../../../../model/user';
import SMSTool from '../../../../utils/SMSTool';
import { MRText as Text} from '../../../../components/ui';
import { observer } from 'mobx-react';
import VerifyCodeInput from '../../components/VerifyCodeInput'
import Styles from '../../../login/style/InputPhoneNum.Style';
const {px2dp} = ScreenUtils;
@observer
export default class JudgePhonePage extends BasePage {

    // 构造
    constructor(props) {
        super(props);
        this.state = {
            downTime: 0
        };
        this.$navigationBarOptions.title = this.params.title;
        this.isLoadding = false;
    }


    componentDidMount() {

        InteractionManager.runAfterInteractions(() => {
           this._onGetCode();
        });
    }

    _render() {
        const  phoneNum  = user.phone;
        return (
            <View style={Styles.bgContent}>
                <View style={Styles.contentStyle}>
                    <Text style={Styles.topTitleStyle}>
                        请输入短信验证码
                    </Text>
                    <Text style={Styles.topTipTitleStyle}>
                        我们已发送短信验证码到你的手机
                    </Text>
                    <Text style={{ marginTop: 10 }}>
                        {StringUtils.encryptPhone(phoneNum)}
                    </Text>

                    <View style={{ alignItems: "center" }}>
                        <VerifyCodeInput onChangeText={
                            (text) => {
                                this._toNext(text);
                            }
                        } verifyCodeLength={4}
                        />

                        <View style={{ marginTop: px2dp(10), flexDirection: "row" }}>
                            {this.state.downTime > 0 ?
                                <Text style={Styles.authHaveSendCodeBtnStyle}>
                                    {this.state.downTime}s后可点击
                                </Text> :
                                null
                            }
                            <TouchableOpacity
                                activeOpacity={1}
                                style={{
                                    paddingTop: px2dp(0),
                                    marginLeft: px2dp(5),
                                    justifyContent: "center"
                                }}
                                onPress={() => {
                                    this._onGetCode();
                                }}
                            >
                                <Text
                                    style={this.state.downTime > 0 ?
                                        [Styles.authHaveSendCodeBtnStyle, { textDecorationLine: "underline" }]
                                        : [Styles.authReSendCodeStyle]}
                                >
                                    重新发送
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        );
    }



    _onGetCode = () => {
        let downTime = this.state.downTime;
        let tel = user.phone;
        if (downTime > 0) {
            return;
        }
        if (StringUtils.isEmpty(tel.trim())) {
            bridge.$toast('手机号为空');
            return;
        }
        //获取验证码
        let that = this;
        if (StringUtils.checkPhone(tel)) {
            SMSTool.sendVerificationCode(this.params.title === '设置交易密码' ? SMSTool.SMSType.SetSaleType : SMSTool.SMSType.ForgetSaleType, tel).then((data) => {
                that.setState({downTime: 60});
                bridge.$toast('验证码已发送请注意查收');
                (new TimeDownUtils()).startDown((time) => {
                    that.setState({downTime: time});
                });
            }).catch((data) => {
                that.setState({downTime: 0});
                bridge.$toast(data.msg);
            });
        } else {
            bridge.$toast('手机格式不对');
        }
    };

    _toNext = (code) => {
        if (this.isLoadding === true) {
            return;
        }
        let tel = user.phone.trim();
        if (StringUtils.isEmpty(tel)) {
            bridge.$toast('请输入手机号');
            return;
        }
        if (StringUtils.isEmpty(code) || code.length !== 4) {
            return;
        }
        if (StringUtils.checkPhone(tel)) {
            // 验证
            this.isLoadding = true;
            MineAPI.judgeCode({
                verificationCode: code,
                phone: tel
            }).then((data) => {
                this.isLoadding = false;
                if (user.hadSalePassword) {//设置过交易密码， 修改支付密码
                    if (user.idcard) {//认证过身份证
                        this.$navigate('mine/account/JudgeIDCardPage');
                    } else {
                        // 跳转到实名认证页面
                        this.$navigate('mine/userInformation/IDVertify2Page', {
                            from: 'salePwd'
                        });
                    }
                } else {
                    // 第一次设置交易密码
                    this.$navigate('mine/account/SetOrEditPayPwdPage', {
                        title: '设置交易密码',
                        tips: '请设置6位纯数字交易支付密码',
                        from: 'set',
                        oldPwd: '',
                        code: code
                    });
                }
            }).catch((data) => {
                bridge.$toast(data.msg);
                this.isLoadding = false;
            });
        } else {
            this.isLoadding = false;
            bridge.$toast('手机格式不对');
            return;
        }
    };
}

