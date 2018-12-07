import { observable, action, flow } from "mobx"
import PaymentApi from './PaymentApi'
import Toast from '../../utils/bridge'
import PayUtil from './PayUtil'
import user from '../../model/user'
import resource from './res';
const balanceImg = resource.balance;
const bankImg = resource.bank;
const wechatImg = resource.wechat;
const alipayImg = resource.alipay;

export const paymentType = {
    balance: 1, //余额支付
    wechat: 4,  //微信
    alipay: 8,  //支付宝
    bank: 16,    //银行卡支付
    section: 5
}

export class Payment {
    @observable paySuccessFul = false
    @observable availableBalance = 0
    @observable balancePayment = {
        type: paymentType.balance,
        name: '余额支付',
        icon: balanceImg,
        hasBalance: true
    }
    @observable outTradeNo = ''
    @observable orderNo = ''
    @observable paymentList = [
        {
            type: paymentType.section,
            name: '第三方支付'
        },
        {
            type: paymentType.bank,
            name: '银行卡支付',
            icon: bankImg,
            hasBalance: false,
            isEnable: false
        },
        {
            type: paymentType.wechat,
            name: '微信支付',
            icon: wechatImg,
            hasBalance: false,
            isEnable: true
        },
        {
            type: paymentType.alipay,
            name: '支付宝支付',
            icon: alipayImg,
            hasBalance: false,
            isEnable: true
        }
    ]
    @observable selectedTypes = null
    @observable selectedBalace = false
    @action selectBalancePayment = () => {
        this.selectedBalace = !this.selectedBalace
    }
    @action selectPaymentType = (data) => {
        if (this.selectedTypes && data.type === this.selectedTypes.type) {
            this.selectedTypes = null
        } else {
            this.selectedTypes = data
        }
    }
    @action clearPaymentType = () => {
        this.selectedTypes = null
    }

    @action updateUserData = () => {
        user.updateUserData().then(data => {
            this.availableBalance = data.availableBalance;
        });
    }

    //余额支付
    @action balancePay = flow(function * (password, ref) {
        try {
            Toast.showLoading()
            const result = yield PaymentApi.balance({orderNo: this.orderNo, salePsw: password})
            this.updateUserData()
            Toast.hiddenLoading()
            return result
        } catch (error) {
            Toast.hiddenLoading();
            console.log('PaymentResultView',error)
            ref && ref.show(2, error.msg)
            return error
        }
    })

    //预支付
    @action perpay  = flow(function * (params) {
        try {
            const res = yield PaymentApi.prePay(params)
            return res
        } catch (error) {
            // Toast.$toast(error.msg);
            console.log(error)
            return error
        }
    })

    //继续支付
    @action continuePay = flow(function *(params) {
        try {
            const res = yield PaymentApi.continuePay(params)
            return res
        } catch (error) {
            console.log(error)
        }
    })


    @action continueToPay = flow(function * (params) {
        try {
            const res = yield PaymentApi.continueToPay(params)
            return res
        } catch (error) {
            console.log(error)
        }
    })

    //支付宝支付
    @action alipay = flow(function * (ref) {
        try {
            Toast.showLoading()
            const result = yield PaymentApi.alipay({orderNo: this.orderNo})
            if (result && result.code === 10000) {
                const resultStr = yield PayUtil.appAliPay(result.data.payInfo)
                console.log('alipay result str', resultStr)
                if (resultStr.sdkCode !== 9000) {
                    throw new Error(resultStr.msg)
                }
                Toast.hiddenLoading();
                return resultStr;
            } else {
                Toast.hiddenLoading()
                Toast.$toast(result.msg)
                return ''
            }
        } catch(error) {
            Toast.hiddenLoading()
            ref && ref.show(2, error.msg || error.message)
            return error
        }
    })

    //支付宝支付查账
    @action alipayCheck = flow(function * (params) {
        try {
            const resultStr = yield PaymentApi.alipayCheck(params)
            return {resultStr}
        } catch (error) {
            Toast.hiddenLoading()
            console.log(error)
            return error
        }
    })

    //微信支付
    @action appWXPay = flow(function * (ref) {
        try {
            Toast.showLoading()
            const result = yield PaymentApi.wachatpay({orderNo: this.orderNo})
            
            if (result && result.code === 10000) {
                const payInfo = JSON.parse(result.data.payInfo)
                payInfo.partnerid = payInfo.mchId
                payInfo.timestamp = payInfo.timeStamp
                payInfo.prepayid = payInfo.prepayId
                payInfo.sign = payInfo.paySign
                payInfo.noncestr = payInfo.nonceStr
                payInfo.appid = payInfo.appId
                const resultStr = yield PayUtil.appWXPay(payInfo);
                console.log(JSON.stringify(resultStr));
                if (parseInt(resultStr.code, 0) !== 0) {
                    // ref && ref.show(2, resultStr.msg)
                    Toast.hiddenLoading()
                    throw new Error(resultStr.msg)
                }
                Toast.hiddenLoading()
                return resultStr
            } else {
                Toast.hiddenLoading()
                Toast.$toast(result.msg);
                return
            }

        } catch (error) {
            Toast.hiddenLoading()
            ref && ref.show(2, error.msg || error.message)
            console.log(error)
        }
    })

    @action wechatCheck = flow(function * (params) {
        try {
            const resultStr = yield PaymentApi.wechatCheck(params)
            return {resultStr}
        } catch (error) {
            Toast.hiddenLoading()
            console.log(error)
        }
    })

    //支付宝+平台
    @action ailpayAndBalance = flow(function * (password, ref) {
        try {
            const result = yield PaymentApi.alipayAndBalance({orderNo: this.orderNo, salePsw: password})
            if (result && result.code === 10000) {
                const resultStr = yield PayUtil.appAliPay(result.data.payInfo)
                if (resultStr.sdkCode !== 9000) {
                    throw new Error(resultStr.msg)
                }
                Toast.hiddenLoading();
                return resultStr;
            } else {
                Toast.hiddenLoading()
                Toast.$toast(result.msg)
                return ''
            }
        } catch (error) {
            Toast.hiddenLoading()
            ref && ref.show(2, error.msg || error.message)
            console.log(error)
        }
    })

    @action openWechat = (payInfo) => {
        payInfo.partnerid = payInfo.mchId
        payInfo.timestamp = payInfo.timeStamp
        payInfo.prepayid = payInfo.prepayId
        payInfo.sign = payInfo.paySign
        payInfo.noncestr = payInfo.nonceStr
        payInfo.appid = payInfo.appId
        return PayUtil.appWXPay(payInfo);
    }

     //微信支付
     @action wechatAndBalance = flow(function * (password, ref) {
        try {
            Toast.showLoading()
            const result = yield PaymentApi.wachatpay({orderNo: this.orderNo, salePsw: password})
            if (result && result.code === 10000) {
                const payInfo = JSON.parse(result.data.payInfo)
                const resultStr = yield this.openWechat(payInfo)
                if (parseInt(resultStr.code, 0) !== 0) {
                    Toast.hiddenLoading()
                    throw new Error(resultStr.msg)
                }
                Toast.hiddenLoading()
                return resultStr
            } else {
                Toast.hiddenLoading()
                Toast.$toast(result.msg);
                return
            }

        } catch (error) {
            Toast.hiddenLoading()
            ref && ref.show(2, error.msg || error.message)
            console.log(error)
        }
    })

}
