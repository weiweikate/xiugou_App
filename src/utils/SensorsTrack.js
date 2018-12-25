import { NativeModules } from 'react-native';

const {
    track,
    trackTimerStart,
    trackTimerEnd,
    trackViewScreen,
    logout,
    login
} = NativeModules.RNSensorsAnalyticsModule;
// track("event_name",parmas)
// trackTimerStart("event_name")
// trackTimerEnd("event_name",parmas)

/** 订单相关的埋点事件名称*/
const trackEvent = {
    bannerClick: 'bannerClick',//banner点击
    login: 'login',//登录
    signUp: 'signUp',//注册
    search: 'search',//商品搜索
    commodityDetail: 'commodityDetail',//浏览商品详情页
    addToShoppingcart: 'addToShoppingcart',//加入购物车
    submitOrder: 'submitOrder',//提交订单
    submitOrderDetail: 'submitOrderDetail',//提交订单详情
    payOrder: 'payOrder',//支付订单
    payOrderDetail: 'payOrderDetail',//支付订单详情
    cancelPayOrder: 'cancelPayOrder',//取消订单
    applyReturn: 'applyReturn',//申请退货
    receiveDiscount: 'receiveCoupons',//领取优惠券
    receiveOneyuan: 'receiveOneyuan',//领一元券
    receiveExp: 'receiveExp',//经验值变动
    receiveshowDou: 'receiveshowDou',//秀豆变动
    share: 'share',//分享商品
    contact: 'contact',//联系客服
    ArticleDisplay: 'ArticleDisplay',//文章浏览
    ArticleShare: 'ArticleShare',// 文章分享
    applyJoinPin: 'applyJoinPin',//加入拼店
    applyPin: 'applyPin',//申请开店
    dismissPin: 'dismissPin',//解散拼店
    SharePin: 'SharePin',//分享拼店
    QuitPin: 'QuitPin',//退出拼店
    BuyGiftSubmit: 'BuyGiftSubmit',//购买礼包
    MesInviteJoinPin: 'MesInviteJoinPin',//邀请加入拼店
    MesInviteJoinPinResult: 'MesInviteJoinPinResult',//邀请加入拼店—结果反馈
    MesApplyJoinPin: 'MesApplyJoinPin',//申请加入拼店
    MesApplyJoinPinResult: 'MesApplyJoinPinResult',//申请加入店铺——结果反馈
    Dropout: 'Dropout',//请出拼店
    ReceiveDividents: 'ReceiveDividents',//收到分红
    VIPChange: 'VIPChange',//会员流转
    QrcodeShareto: 'QrcodeShareto'//分享二维码
};


export {
    track,
    trackTimerStart,
    trackTimerEnd,
    trackViewScreen,
    logout,
    login,
    trackEvent
};

/**
 * 导出 login 方法给 RN 使用.
 *
 * @param loginId 用户唯一下登录ID
 *
 * RN 中使用示例：
 *     <Button
 *            title="Button"
 *            onPress={()=>
 *            RNSensorsAnalyticsModule.login("developer@sensorsdata.cn")}>
 *     </Button>
 */

/**
 * 导出 logout 方法给 RN 使用.
 *
 * RN 中使用示例：
 *     <Button
 *            title="Button"
 *            onPress={()=>
 *            RNSensorsAnalyticsModule.logout()}>
 *     </Button>
 */

/**
 * 导出 trackViewScreen 方法给 RN 使用.
 *
 * 此方法用于 RN 中 Tab 切换页面的时候调用，用于记录 $AppViewScreen 事件.
 *
 * @param url        页面的 url  记录到 $url 字段中(如果不需要此属性，可以传 null ).
 * @param properties 页面的属性.
 *
 * 注：为保证记录到的 $AppViewScreen 事件和 Auto Track 采集的一致，
 *    需要传入 $title（页面的title） 、$screen_name （页面的名称，即 包名.类名）字段.
 *
 * RN 中使用示例：
 *     <Button
 *            title="Button"
 *            onPress={()=>
 *            RNSensorsAnalyticsModule.trackViewScreen(null,{"$title":"RN主页","$screen_name":"cn.sensorsdata.demo.RNHome"})}>
 *     </Button>
 *
 */
