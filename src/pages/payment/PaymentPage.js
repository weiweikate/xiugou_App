import React from 'react';
import { View, StyleSheet, Image, TouchableWithoutFeedback, Alert } from 'react-native';
import res from './res'
import BasePage from '../../BasePage';
import { observer } from 'mobx-react/native';
import ScreenUtils from '../../utils/ScreenUtils';
import DesignRule from '../../constants/DesignRule';
import { MRText as Text } from '../../components/ui';
import user from '../../model/user';
import { payment, payStatus, payStatusMsg } from './Payment'
import PasswordView from './PayPasswordView'
import { PaymentResult } from './PaymentResultPage';
const { px2dp } = ScreenUtils;
import Toast from '../../utils/bridge'
import { NavigationActions } from 'react-navigation';

@observer
export default class PaymentPage extends BasePage {

    $navigationBarOptions = {
        title: '订单支付',
        show: true
    };

    state = {
        showPwd: false,
        showPwdMsg: '',
        showResult: false,
        payResult: PaymentResult.none,
        payMsg: ''
    }

    constructor(props) {
        super(props);
        payment.amounts = this.params.amounts ? parseFloat(this.params.amounts) : 0.0
        let orderProduct = this.params.orderProductList && this.params.orderProductList[0];
        payment.name = orderProduct && orderProduct.productName
        payment.orderNo = this.params.orderNum;
        payment.platformOrderNo = this.params.platformOrderNo;
        user.updateUserData()
    }

    $NavBarLeftPressed = () => {
        this.$navigateBack();
    }

    goToPay =()=> {
        payment.checkOrderStatus().then(result => {
            if (result.code === payStatus.payNo) {
                if (payment.amounts <= 0) {
                    this._zeroPay()
                    return
                }
                const {selectedBalace} = payment
                if (!selectedBalace) {
                    this.$navigate('payment/ChannelPage')
                    return
                }
                //用户设置过交易密码
                if (user.hadSalePassword) {
                    this.setState({ showPwd: true })
                }  else {
                    this.$navigate('mine/account/JudgePhonePage', { title: '设置交易密码' });
                }
            } else if (result.code === payStatus.payNeedThrid) {
                this.$navigate('payment/ChannelPage', {remainMoney: Math.floor(result.thirdPayAmount * 100) / 100})
            } else if (result.code === payStatus.payOut) {
                Toast.$toast(payStatusMsg[result.code])
                this._goToOrder(2)
            } else {
                Toast.$toast(payStatusMsg[result.code])
            }
        }).catch(err => {
            Toast.$toast(err.msg)
        })
    }

    _zeroPay = () => {
        this._platformPay()
    }

    _selectedBalance() {
        payment.selectBalancePayment()
    }

    _platformPay(password) {
        payment.platformPay(password).then((result) => {
            this.setState({ showPwd: false })
            if (result === payStatus.payNeedThrid) {
                payment.selectedBalace = false
                this.$navigate('payment/ChannelPage', {remainMoney: (payment.amounts - user.availableBalance).toFixed(2)})
                return
            }

            let replace = NavigationActions.replace({
                key: this.props.navigation.state.key,
                routeName: 'payment/PaymentResultPage',
                params: {payResult: PaymentResult.success}
            });
            this.props.navigation.dispatch(replace);
            payment.resetPayment()
        }).catch(err => {
            this.setState({ showPwdMsg: err.msg })
        })
    }

    _finishedAction(password) {
        this._platformPay(password)
    }

    _forgetPassword = () => {
        this.setState({ showPwd: false })
        this.$navigate('mine/account/JudgePhonePage', { title: '设置交易密码' });
    };

    _cancelPay = () => {
        this.setState({showPwd: false})
        setTimeout(() => {
            Alert.alert(
                '确认要放弃付款？',
                '订单会超时关闭，请尽快支付',
                [
                  {text: '确认离开', onPress: () => {this.setState({showPwd: false}); this._goToOrder()}},
                  {text: '继续支付', onPress: () => {this.setState({showPwd: true});}}
                ],
                { cancelable: false }
            )
        }, 600)
        
    }

    _goToOrder(index) {
        let replace = NavigationActions.replace({
            key: this.props.navigation.state.key,
            routeName: 'order/order/MyOrdersListPage',
            params: { index: index ? index : 1 }
        });
        this.props.navigation.dispatch(replace);
    }

    _render() {
        const { selectedBalace, name } = payment
        const { showPwd } = this.state
        let { availableBalance } = user
        let channelAmount = (payment.amounts).toFixed(2)
        if (selectedBalace) {
            channelAmount = (payment.amounts - availableBalance) <= 0 ? 0.00 : (payment.amounts - availableBalance).toFixed(2)
        }
        return <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.row}>
                    <Text style={styles.name} numberOfLines={1}>订单名称：{name}</Text>
                </View>
                <View style={styles.line}/>
                <View style={styles.row}>
                    <Text style={styles.text}>需支付金额：</Text>
                    <Text style={styles.money}>￥{payment.amounts}</Text>
                </View>
            </View>
            <TouchableWithoutFeedback disabled={availableBalance <= 0} onPress={()=> this._selectedBalance()}>
            <View style={styles.balanceContent}>
                <Image style={styles.iconBalance} source={res.balance}/>
                <Text style={styles.text}>现金账户</Text>
                <View style={{flex: 1}}/>
                <Text style={styles.name}>可用金额: {availableBalance}元</Text>
                <Image style={styles.iconCheck} source={selectedBalace ? res.check : res.uncheck}/>
            </View>
            </TouchableWithoutFeedback>
            <View style={styles.needView}>
            <Text style={styles.need}>三方需付金额</Text>
            <Text style={styles.amount}>￥{channelAmount}</Text>
            </View>
            <TouchableWithoutFeedback onPress={() => {this.goToPay()}}>
            <View style={styles.payBtn}>
                <Text style={styles.payText}>去支付</Text>
            </View>
            </TouchableWithoutFeedback>
            {showPwd ? <PasswordView
                finishedAction={(pwd)=> {this._finishedAction(pwd)}}
                forgetAction={()=>{this._forgetPassword()}}
                dismiss={()=>{this._cancelPay() }}
                showPwdMsg={this.state.showPwdMsg}
            /> : null}
        </View>;
    }
}

const bgColor = '#f2f2f2'
const whiteBg = '#fff'
const buttonBg = '#FF0050'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: bgColor
    },
    content: {
        marginTop: px2dp(10),
        marginLeft: px2dp(15),
        marginRight: px2dp(15),
        height: px2dp(100),
        backgroundColor: whiteBg,
        borderRadius: 5
    },
    balanceContent: {
        marginTop: px2dp(10),
        marginLeft: px2dp(15),
        marginRight: px2dp(15),
        paddingRight: px2dp(10),
        paddingLeft: px2dp(10),
        height: px2dp(50),
        backgroundColor: whiteBg,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    row: {
        height: px2dp(50),
        flexDirection: 'row',
        paddingRight: px2dp(10),
        paddingLeft: px2dp(10),
        alignItems: 'center'
    },
    name: {
        color: DesignRule.textColor_secondTitle,
        fontSize: px2dp(13)
    },
    line: {
        height: ScreenUtils.onePixel,
        backgroundColor: DesignRule.lineColor_inWhiteBg
    },
    text: {
        color: DesignRule.textColor_mainTitle,
        fontSize: px2dp(13)
    },
    money: {
        color: DesignRule.mainColor,
        fontSize: px2dp(13)
    },
    iconBalance: {
        width: px2dp(24),
        height: px2dp(24),
        marginRight: px2dp(10)
    },
    iconCheck: {
        marginLeft: px2dp(10),
        width: px2dp(20),
        height: px2dp(20)
    },
    need: {
        marginTop: px2dp(30),
        color: DesignRule.textColor_instruction,
        fontSize: px2dp(13)
    },
    amount: {
        marginTop: px2dp(10),
        color: DesignRule.textColor_mainTitle,
        fontSize: px2dp(30),
        fontWeight: '600'
    },
    needView: {
        flex: 1,
        alignItems: 'center'
    },
    payBtn: {
        backgroundColor: buttonBg,
        marginBottom: ScreenUtils.safeBottom + 20,
        height: px2dp(44),
        marginLeft: px2dp(15),
        marginRight: px2dp(15),
        borderRadius: px2dp(22),
        alignItems: 'center',
        justifyContent: 'center'
    },
    payText: {
        color: whiteBg,
        fontSize: px2dp(17)
    }
});

