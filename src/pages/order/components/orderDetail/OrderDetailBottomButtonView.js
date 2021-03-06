import React, { Component } from "react";
import {
    StyleSheet,
    View,
    Alert
} from "react-native";
import ScreenUtils from "../../../../utils/ScreenUtils";
import DesignRule from "../../../../constants/DesignRule";
import { orderDetailAfterServiceModel, orderDetailModel, assistDetailModel } from "../../model/OrderDetailModel";
import OrderApi from "../../api/orderApi";
import Toast from "../../../../utils/bridge";
import shopCartCacheTool from "../../../shopCart/model/ShopCartCacheTool";
import { observer } from "mobx-react/native";
import RouterMap from "../../../../navigation/RouterMap";
import {payStatus, payment, payStatusMsg} from '../../../payment/Payment'
import { NavigationActions } from 'react-navigation';
import { track, trackEvent } from '../../../../utils/SensorsTrack';

const { px2dp } = ScreenUtils;
import { MRText as Text, NoMoreClick } from "../../../../components/ui";

@observer
export default class OrderDetailBottomButtonView extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let nameArr = orderDetailAfterServiceModel.menu;
        if (nameArr.length > 0) {
            return (
                <View style={styles.containerStyle}>
                    {nameArr.map((item,i)=>{
                        return  <NoMoreClick key={i}
                                             style={[styles.touchableStyle, { borderColor: item.isRed ? DesignRule.mainColor : DesignRule.color_ddd }]}
                                             onPress={() => {
                                                 this.operationMenuClick(item);
                                             }}>
                            <Text style={{ color: item.isRed ? DesignRule.mainColor : DesignRule.textColor_secondTitle }}
                                  allowFontScaling={false}>{item.operation}</Text>
                        </NoMoreClick>
                    })}
                </View>
            );
        } else {
            return null;
        }

    }
    operationMenuClick = (menu) => {
        /*
         * 取消订单                 ->  1
         * 去支付                   ->  2
         * 继续支付                 ->  3
         * 订单退款                 ->  4
         * 查看物流                 ->  5
         * 确认收货                 ->  6
         * 删除订单(已完成)          ->  7
         * 再次购买                 ->  8
         * 删除订单(已关闭(取消))    ->  9
         * */
        switch (menu.id) {
            case 1:
                if (assistDetailModel.cancelArr.length > 0) {
                    assistDetailModel.setIsShowSingleSelctionModal(true);
                } else {
                    Toast.$toast("无取消类型！");
                }

                break;
            case 2:
                this._goToPay();
                break;
            case 3:
                this._goToPay()
                break;
            case 4:
                break;
            case 5:
                if (!orderDetailModel.warehouseOrderDTOList[0].expList) {
                    Toast.$toast("当前物流信息不存在！");
                    return;
                }
                if (orderDetailModel.warehouseOrderDTOList[0].expList.length === 0) {
                    Toast.$toast("当前物流信息不存在！");
                }
                if (orderDetailModel.warehouseOrderDTOList[0].expList.length === 1 && orderDetailModel.warehouseOrderDTOList[0].unSendProductInfoList.length === 0) {
                    this.props.nav("order/logistics/LogisticsDetailsPage", {
                        expressNo: orderDetailModel.warehouseOrderDTOList[0].expList[0].expNO
                    });
                } else {
                    this.props.nav("order/logistics/CheckLogisticsPage", {
                        expressList: orderDetailModel.warehouseOrderDTOList[0].expList,
                        unSendProductInfoList: orderDetailModel.warehouseOrderDTOList[0].unSendProductInfoList
                    });
                }
                break;
            case 6:
                let content='是否确认收货?';
               orderDetailModel.warehouseOrderDTOList[0].products.map((value)=>{
                   if(value.status<3){
                       content='您还有商品未发货，确认收货吗？'
                   }
               })

                Alert.alert("", `${content}`, [
                    {
                        text: `取消`, onPress: () => {
                        }
                    },
                    {
                        text: `确定`, onPress: () => {
                            Toast.showLoading();
                            OrderApi.confirmReceipt({ orderNo: orderDetailModel.getOrderNo() }).then((response) => {
                                Toast.hiddenLoading();
                                Toast.$toast("确认收货成功");
                                this.props.nav('order/order/ConfirmReceiveGoodsPage',{
                                    orderNo: orderDetailModel.getOrderNo(),
                                    callBack: this.props.loadPageData
                                })
                            }).catch(e => {
                                Toast.hiddenLoading();
                                Toast.$toast(e.msg);
                            });
                        }
                    }

                ], { cancelable: true });
                break;
            case 7:
                // this.setState({ isShowDeleteOrderModal: true });
                // this.deleteModal && this.deleteModal.open();
                Alert.alert("", `确定删除此订单吗?`, [
                    {
                        text: `取消`, onPress: () => {
                        }
                    },
                    {
                        text: `确定`, onPress: () => {
                            Toast.showLoading();
                            OrderApi.deleteOrder({ orderNo: orderDetailModel.getOrderNo() }).then((response) => {
                                Toast.hiddenLoading();
                                Toast.$toast("订单已删除");
                                this.props.goBack();
                                this.props.callBack();
                            }).catch(e => {
                                Toast.hiddenLoading();
                                Toast.$toast(e.msg);
                            });

                        }
                    }

                ], { cancelable: true });
                break;
            case 8:
                let cartData = [];
                orderDetailModel.warehouseOrderDTOList[0].products.map((item, index) => {
                    cartData.push({
                        spuCode: item.prodCode,
                        productCode: item.prodCode,
                        skuCode: item.skuCode,
                        amount: item.quantity
                    });
                });
                track(trackEvent.OrderAgain,{
                    orderId:orderDetailModel.getOrderNo(),
                   })
                shopCartCacheTool.addGoodItem(cartData);
                this.props.nav("shopCart/ShopCart", { hiddeLeft: false });
                break;
            case 9:
                // this.setState({ isShowDeleteOrderModal: true });
                // this.deleteModal && this.deleteModal.open();
                Alert.alert("", `确定删除此订单吗?`, [
                    {
                        text: `取消`, onPress: () => {
                        }
                    },
                    {
                        text: `确定`, onPress: () => {
                            Toast.showLoading();
                            OrderApi.deleteOrder({ orderNo: orderDetailModel.getOrderNo() }).then((response) => {
                                Toast.hiddenLoading();
                                Toast.$toast("订单已删除");
                                this.props.goBack();
                                this.props.callBack();
                            }).catch(e => {
                                Toast.hiddenLoading();
                                Toast.$toast(e.msg);
                            });

                        }
                    }

                ], { cancelable: true });
                break;
            case 10:
                OrderApi.checkInfo({warehouseOrderNo:orderDetailModel.getOrderNo()}).then(res => {
                    if(res.data){
                        this.props.nav(RouterMap.P_ScorePublishPage, {
                            orderNo:  orderDetailModel.getOrderNo()
                        });
                    }else{
                        Toast.$toast('该商品已晒过单！');
                        this.props.loadPageData()
                    }

                }).catch(e =>{
                    Toast.$toast(e.msg);
                })

                break;
        }
    };

    async _goToPay() {
        let platformOrderNo = orderDetailModel.platformOrderNo
        let result = await payment.checkOrderStatus(platformOrderNo)
        if (result.code === payStatus.payNo) {
            this.props.nav("payment/PaymentPage", {
                orderNum: orderDetailModel.warehouseOrderDTOList[0].outTradeNo,
                amounts: orderDetailModel.payAmount,
                platformOrderNo: orderDetailModel.platformOrderNo,
                orderProductList: orderDetailModel.warehouseOrderDTOList[0].products
            });
        } else if (result.code === payStatus.payNeedThrid) {
            this.props.nav('payment/ChannelPage', {
                remainMoney: Math.floor(result.thirdPayAmount * 100) / 100,
                orderProductList: orderDetailModel.warehouseOrderDTOList[0].products,
                orderNum: orderDetailModel.warehouseOrderDTOList[0].outTradeNo,
                platformOrderNo: orderDetailModel.platformOrderNo,
            })
        } else if (result.code === payStatus.payOut) {
            Toast.$toast(payStatusMsg[result.code])
            let replace = NavigationActions.replace({
                key: this.props.navigation.state.key,
                routeName: 'order/order/MyOrdersListPage',
                params: { index: 2 }
            });
            this.props.navigation.dispatch(replace);
        } else {
            Toast.$toast(payStatusMsg[result.code])
        }
    }
}
const styles = StyleSheet.create({
    containerStyle: {
        height: px2dp(48), flexDirection: "row", alignItems: "center",
        justifyContent: "flex-end", backgroundColor: "white", marginTop: 1
    },
    touchableStyle: {
        borderWidth: 1,
        height: px2dp(30),
        borderRadius: px2dp(15),
        marginRight: px2dp(15),
        justifyContent: "center",
        paddingLeft: px2dp(20),
        paddingRight: px2dp(20)
    }
});
