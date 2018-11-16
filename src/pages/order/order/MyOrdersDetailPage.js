import React from 'react';
import {
    NativeModules,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ImageBackground, Image, DeviceEventEmitter, Alert
} from 'react-native';
import BasePage from '../../../BasePage';
import {
    UIText, UIImage
} from '../../../components/ui';
import { RefreshList } from '../../../components/ui';
import { color } from '../../../constants/Theme';
import StringUtils from '../../../utils/StringUtils';
import ScreenUtils from '../../../utils/ScreenUtils';
import { TimeDownUtils } from '../../../utils/TimeDownUtils';
import buyerHasPay from '../res/buyerHasPay.png';
import couponIcon from '../../mine/res/couponsImg/dingdan_icon_quan_nor.png';
import arrow_right from '../res/arrow_right.png';
import position from '../res/dizhi-icon.png';
import GoodsDetailItem from '../components/GoodsDetailItem';
import UserSingleItem from '../components/UserSingleItem';
import CommonTwoChoiceModal from '../components/CommonTwoChoiceModal';
import SingleSelectionModal from '../components/BottomSingleSelectModal';
import ShowMessageModal from '../components/ShowMessageModal';
import productDetailHome from '../res/productDetailHome.png';
import productDetailMessage from '../res/productDetailMessage.png';
import logisticCar from './../res/car.png'
import tobePayIcon from './../res/dingdanxiangqing_icon_fuk.png';
import finishPayIcon from './../res/dingdanxiangqing_icon_yiwangcheng.png';
import hasDeliverIcon from './../res/dingdanxiangqing_icon_yifehe.png';
import refuseIcon from './../res/dingdanxiangqing_icon_guangbi.png';
import constants from '../../../constants/constants';
import DateUtils from '../../../utils/DateUtils';
import Toast from '../../../utils/bridge';
import productDetailImg from '../res/productDetailImg.png';
import moreIcon from '..//res/more_icon.png';
import GoodsGrayItem from '../components/GoodsGrayItem';
import OrderApi from '../api/orderApi';
import user from '../../../model/user';
import shopCartCacheTool from '../../shopCart/model/ShopCartCacheTool';
import { NavigationActions } from 'react-navigation';
import DesignRule from 'DesignRule';
import MineApi from '../../mine/api/MineApi';

class MyOrdersDetailPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            isShowReceiveGoodsModal: false,
            isShowDeleteOrderModal: false,
            isShowSingleSelctionModal: false,
            isShowShowMessageModal: false,
            orderId: this.props.navigation.state.params.orderId,
            expressNo: '',
            viewData: {},
            //todo 这里的初始化仅仅为了减少判空处理的代码，后面会删除
            pageState: 1,
            pageStateString: constants.pageStateString[1],
            menu: {},
            giftBagCoupons: [],
            cancelArr:[]
        };
    }

    $navigationBarOptions = {
        title: '订单详情',
        show: true// false则隐藏导航
    };
    $getPageStateOptions = () => {
        return {
            loadingState: 'success',
            netFailedProps: {
                netFailedInfo: this.state.netFailedInfo,
                reloadBtnClick: this._reload
            }
        };
    };
    $NavBarRenderRightItem = () => {
        return (
            <TouchableOpacity onPress={this.showMore} style={{width:20,height:44,alignItems:'center',justifyContent:'center'}}>
                <Image source={moreIcon} style={{ width: 20, height: 5, marginRight: 10 }} resizeMode='contain'/>
            </TouchableOpacity>
        );
    };
    showMore = () => {
        this.setState({ isShowShowMessageModal: true });
        this.messageModal && this.messageModal.open();
    };
    //**********************************ViewPart******************************************
    renderState = () => {
        let leftTopIcon;
        switch(this.state.status){
            case 1:
                leftTopIcon=tobePayIcon;
                break;
            case 2:
                leftTopIcon = buyerHasPay;
                break;
            case 3:
                leftTopIcon=hasDeliverIcon;
                break;
            case 4:
            case 5:
                leftTopIcon=finishPayIcon;
                break;
            case 6:
            case 7:
            case 8:
                leftTopIcon=refuseIcon;
                break;
            default:
            leftTopIcon = buyerHasPay;
            break;



        }
        return (
            <View style={{ marginBottom: 10 }}>
                <ImageBackground style={styles.redRectangle} source={productDetailImg}>
                    <UIImage source={leftTopIcon} style={{ height: 25, width: 25, marginTop: -22 }}/>
                    <View style={{ marginTop: -22 }}>
                        <UIText value={this.state.pageStateString.buyState} style={{
                            color: 'white',
                            fontSize: 18,
                            marginLeft: 10
                        }}/>
                        {StringUtils.isNoEmpty(this.state.pageStateString.moreDetail) ?
                            <UIText value={this.state.pageStateString.moreDetail}
                                    style={{ color: 'white', fontSize: 13, marginLeft: 10 }}/> : null
                        }
                    </View>
                </ImageBackground>
                <TouchableOpacity style={styles.topOrderDetail} onPress={() => {
                    this.$navigate('order/logistics/LogisticsDetailsPage', {
                        orderNum: this.state.viewData.orderNum,
                        orderId: this.state.orderId,
                        expressNo: this.state.expressNo
                    })
                }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center',justifyContent:'space-between'}} >
                        <UIImage source={logisticCar} style={{ height: 19, width: 19, marginLeft: 21 }}/>
                        <View style={{justifyContent:'center',flex:1}}>
                            {typeof this.state.pageStateString.sellerState === 'string' ?
                                <View style={{ marginLeft: 10}}>
                                <UIText value={this.state.pageStateString.sellerState} style={{
                                    color: DesignRule.textColor_mainTitle,
                                    fontSize: 15,
                                    marginRight: 46
                                }}/>
                                    {StringUtils.isNoEmpty(this.state.pageStateString.logisticsTime)?
                                    <UIText style={{
                                        color: DesignRule.textColor_instruction,
                                        fontSize:15,
                                        marginTop:3
                                    }} value={DateUtils.getFormatDate(this.state.pageStateString.logisticsTime / 1000)}/>:null}
                                </View>
                                :
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={{
                                        flex:1,
                                        fontSize: 15,
                                         marginLeft:10,
                                        marginRight:3,
                                        color: DesignRule.textColor_instruction
                                    }}>{this.state.pageStateString.sellerState[0]}</Text>
                                    <Text style={{
                                        fontSize: 15,
                                        marginRight:16,
                                        color: DesignRule.textColor_instruction
                                    }}>{this.state.pageStateString.sellerState[1]}</Text>
                                </View>
                            }
                            {StringUtils.isNoEmpty(this.state.pageStateString.sellerTime) ?
                                <UIText value={this.state.pageStateString.sellerTime}
                                        style={{
                                            color: DesignRule.textColor_instruction,
                                            fontSize: 13,
                                            marginLeft: 10,
                                            marginRight: 16,
                                            marginTop:5
                                        }}/>
                                : null}

                        </View>
                        <UIImage source={arrow_right} style={{ height: 19, width: 19, marginRight: 11 }}
                                 resizeMode={'contain'}/>
                    </View>

                </TouchableOpacity>
            </View>

        );
    };

    componentDidMount() {
        DeviceEventEmitter.addListener('OrderNeedRefresh', () => this.loadPageData());
        this.loadPageData();
        this.getCancelOrder();

    }
    getCancelOrder(){
        let arrs=[];
        MineApi.queryDictionaryTypeList({ code: 'QXDD' }).then(res => {
            if (res.code == 10000 && StringUtils.isNoEmpty(res.data)) {
                res.data.map((item,i)=>{
                    arrs.push(item.value)
                })
                this.setState({
                    cancelArr: arrs
                });
            }
        }).catch(err => {
            console.log(err);
        });
    }

    componentWillUnmount() {
        DeviceEventEmitter.removeAllListeners('OrderNeedRefresh');
    }

    _render = () => {
        return (
            <View style={styles.container}>
                <RefreshList
                    ListHeaderComponent={this.renderHeader}
                    ListFooterComponent={this.renderFootder}
                    data={this.state.orderType === 5 || this.state.orderType === 98 ? this.state.viewData.list : this.state.viewData.list}
                    renderItem={this.renderItem}
                    onRefresh={this.onRefresh}
                    onLoadMore={this.onLoadMore}
                    extraData={this.state}
                    isEmpty={this.state.isEmpty}
                    emptyTip={'暂无数据！'}
                />
                {this.renderModal()}
            </View>
        );
    };
    renderItem = ({ item, index }) => {
        if (this.state.orderType === 5 || this.state.orderType === 98) {
            return (
                <GoodsGrayItem
                    uri={item.uri}
                    goodsName={item.goodsName}
                    category={item.category}
                    salePrice={'￥' + StringUtils.formatMoneyString(item.salePrice, false)}
                    goodsNum={item.goodsNum}
                    onPress={() => this.clickItem(item)}
                />
            );
        } else {
            return (
                <TouchableOpacity>
                    <GoodsDetailItem
                        uri={item.uri}
                        goodsName={item.goodsName}
                        salePrice={'￥' + StringUtils.formatMoneyString(item.salePrice, false)}
                        category={item.category}
                        goodsNum={item.goodsNum}
                        clickItem={() => {
                            this.clickItem(index, item);
                        }}
                        afterSaleService={item.afterSaleService}
                        afterSaleServiceClick={(menu) => this.afterSaleServiceClick(menu, index)}
                    />
                </TouchableOpacity>
            );
        }

    };
    renderGiftPageHeader = () => {
        return (
            <View style={{ marginTop: 10 }}>
                {this.state.orderType == 5 || this.state.orderType === 98 ?

                    <View style={{
                        marginTop: 20,
                        backgroundColor: '#fff',
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        <View style={{
                            borderWidth: 1,
                            borderRadius: 5,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderColor: DesignRule.mainColor,
                            marginLeft: 20
                        }}>
                            <Text style={{
                                fontSize: 11,
                                color: DesignRule.mainColor,
                                padding: 3
                            }}>礼包</Text>
                        </View>
                        <Text style={{
                            marginLeft: 10,
                            fontSize: 12,
                            color: DesignRule.textColor_instruction
                        }}>{this.state.giftPackageName}</Text>
                    </View>
                    :
                    null}
            </View>
        );
    };
    renderHeader = () => {
        return (
            <View>
                {this.renderState()}
                {this.state.pageStateString.disNextView ? this.renderAddress() : null}
                {this.renderGiftPageHeader()}
            </View>
        );
    };
    renderMenus = () => {
        let itemArr = [];
        console.log(this.state.afterSaleService);
        for (let i = 0; i < this.state.afterSaleService.length; i++) {
            itemArr.push(
                <TouchableOpacity key={i}
                                  style={[styles.grayView, { borderColor: this.state.afterSaleService[i].isRed ? color.red : DesignRule.color_ddd }]}
                                  onPress={() => {
                                      this.afterSaleServiceClick(this.state.afterSaleService[i], i);
                                  }}>
                    <Text
                        style={[styles.grayText, { color: this.state.afterSaleService[i].isRed ? color.red : color.gray_666 }]}>{this.state.afterSaleService[i].operation}</Text>
                </TouchableOpacity>
            );
        }
        return itemArr;
    };
    renderGiftaftersales = () => {
        return (
            <View>
                {this.state.afterSaleService.length === 0 ? null :
                    <View>
                        <View style={{
                            flexDirection: 'row',
                            height: 48,
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            backgroundColor: 'white'
                        }}>
                            {this.renderMenus()}
                        </View>
                        {this.renderLine()}
                    </View>
                }
            </View>
        );
    };
    renderFootder = () => {
        return (
            <View style={{ backgroundColor: 'white' }}>
                {this.state.orderType == 5 ? this.renderGiftaftersales() : null}
                {(this.state.orderType == 5 || this.state.orderType == 98) && this.state.giftBagCoupons.length > 0 ?
                    <View>
                        {this.renderLine()}
                        {this.state.giftBagCoupons.map((item, index) => {
                            return <View style={{ backgroundColor: 'white' }} key={index}>
                                {index == 0 ? <Image source={couponIcon} style={{
                                    width: 15,
                                    height: 12,
                                    position: 'absolute',
                                    left: 15,
                                    top: 12
                                }} /> : null}
                                <View style={{
                                    height: 34,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginLeft: 36
                                }}>
                                    <Text style={{
                                        color: DesignRule.textColor_instruction,
                                        fontSize: 13,
                                        alignSelf: 'center'
                                    }}>{item.couponName}</Text>
                                    <Text style={{
                                        color: DesignRule.textColor_instruction,
                                        fontSize: 13,
                                        alignSelf: 'center',
                                        marginRight: 14
                                    }}>x1</Text>
                                </View>
                                <View
                                    style={{ marginLeft: 36, backgroundColor: DesignRule.bgColor, height: 0.5, width: '100%' }}/>
                            </View>;
                        })}
                        {this.renderWideLine()}
                    </View>

                    :
                    null}
                <UserSingleItem itemHeightStyle={{ height: 25 }} leftText={'商品总价'}
                                leftTextStyle={{ color: DesignRule.textColor_instruction }}
                                rightText={StringUtils.formatMoneyString(this.state.viewData.goodsPrice)}
                                rightTextStyle={{ color: DesignRule.textColor_instruction }} isArrow={false}
                                isLine={false}/>
                <UserSingleItem itemHeightStyle={{ height: 25 }} leftText={'运费（快递）'}
                                leftTextStyle={{ color: DesignRule.textColor_instruction }}
                                rightText={StringUtils.formatMoneyString(this.state.viewData.freightPrice)}
                                rightTextStyle={{ color: DesignRule.textColor_instruction }} isArrow={false}
                                isLine={false}/>
                <UserSingleItem itemHeightStyle={{ height: 25 }} leftText={'优惠券优惠'}
                                leftTextStyle={{ color: DesignRule.textColor_instruction }}
                                rightText={'-' + StringUtils.formatMoneyString(this.state.viewData.couponPrice)}
                                rightTextStyle={{ color: DesignRule.textColor_instruction }} isArrow={false}
                                isLine={false}/>
                <UserSingleItem itemHeightStyle={{ height: 25 }} leftText={'1元现金券'}
                                leftTextStyle={{ color: DesignRule.textColor_instruction }}
                                rightText={'-' + StringUtils.formatMoneyString(this.state.viewData.tokenCoin)}
                                rightTextStyle={{ color: DesignRule.textColor_instruction }} isArrow={false}
                                isLine={false}/>
                <UserSingleItem itemHeightStyle={{ height: 35 }} leftText={'订单总价'}
                                leftTextStyle={{ color: DesignRule.textColor_mainTitle_222, fontSize: 15 }}
                                rightText={StringUtils.formatMoneyString(this.state.viewData.totalPrice)}
                                rightTextStyle={{ color: DesignRule.textColor_mainTitle_222, fontSize: 15 }} isArrow={false}
                                isLine={false}/>
                {this.renderLine()}
                <UserSingleItem itemHeightStyle={{ height: 55 }} leftText={'实付款'}
                                leftTextStyle={{ color: DesignRule.textColor_mainTitle_222, fontSize: 15 }}
                                rightText={StringUtils.formatMoneyString(this.state.viewData.orderTotalPrice)}
                                rightTextStyle={{ color: color.red, fontSize: 15 }} isArrow={false}
                                isLine={false}/>
                {this.renderWideLine()}
                <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                    <UIText value={'订单编号：' + this.state.viewData.orderNum}
                            style={{ color: DesignRule.textColor_instruction, fontSize: 13, marginLeft: 16, marginTop: 10 }}/>
                    <TouchableOpacity style={{
                        borderWidth: 1,
                        borderColor: DesignRule.color_ddd,
                        marginRight: 10,
                        justifyContent: 'center',
                        height: 22,
                        width: 55,
                        marginTop: 10
                    }} onPress={() => this.copyOrderNumToClipboard()}>
                        <Text style={{ paddingLeft: 10, paddingRight: 10 }}>复制</Text>
                    </TouchableOpacity>
                </View>
                <UIText value={'创建时间：' + DateUtils.getFormatDate(this.state.viewData.createTime / 1000)}
                        style={{ color: DesignRule.textColor_instruction, fontSize: 13, marginLeft: 16, marginTop: 10 }}/>
                {StringUtils.isNoEmpty(this.state.viewData.platformPayTime) && this.state.status > 1 ?
                    <UIText value={'平台付款时间：' + DateUtils.getFormatDate(this.state.viewData.platformPayTime / 1000)}
                            style={{ color: DesignRule.textColor_instruction, fontSize: 13, marginLeft: 16, marginTop: 10 }}/> : null}
                {StringUtils.isNoEmpty(this.state.viewData.shutOffTime) && this.state.status > 5 ?
                    <UIText value={'关闭时间：' + DateUtils.getFormatDate(this.state.viewData.shutOffTime / 1000)}
                            style={{ color: DesignRule.textColor_instruction, fontSize: 13, marginLeft: 16, marginTop: 10 }}/> : null}
                {StringUtils.isEmpty(this.state.viewData.cancelTime) ? null :
                    <UIText value={'取消时间：' + DateUtils.getFormatDate(this.state.viewData.cancelTime / 1000)}
                            style={{ color: DesignRule.textColor_instruction, fontSize: 13, marginLeft: 16, marginTop: 10 }}/>}
                {StringUtils.isNoEmpty(this.state.viewData.payTime) && (this.state.payType % 2 == 0) && this.state.viewData.status > 1 ?
                    <UIText value={'三方付款时间：' + DateUtils.getFormatDate(this.state.viewData.payTime / 1000)}
                            style={{ color: DesignRule.textColor_instruction, fontSize: 13, marginLeft: 16, marginTop: 10 }}/> : null}
                {StringUtils.isNoEmpty(this.state.viewData.outTradeNo) && (this.state.payType % 2 == 0) ?
                    <UIText value={'交易订单号：' + this.state.viewData.outTradeNo} style={{
                        color: DesignRule.textColor_instruction,
                        fontSize: 13,
                        marginLeft: 16,
                        marginTop: 10,
                        marginBottom: 10
                    }}/> : null}
                {StringUtils.isEmpty(this.state.viewData.sendTime) ? null :
                    <UIText value={'发货时间：' + DateUtils.getFormatDate(this.state.viewData.sendTime / 1000)} style={{
                        color: DesignRule.textColor_instruction,
                        fontSize: 13,
                        marginLeft: 16,
                        marginTop: 10,
                        marginBottom: 10
                    }}/>}
                {StringUtils.isEmpty(this.state.viewData.finishTime) ? null :
                    <UIText
                        value={'完成时间：' + DateUtils.getFormatDate(this.state.viewData.deliverTime ? this.state.viewData.deliverTime / 1000 : this.state.viewData.finishTime / 1000)}
                        style={{
                            color: DesignRule.textColor_instruction,
                            fontSize: 13,
                            marginLeft: 16,
                            marginTop: 10,
                            marginBottom: 10
                        }}/>}
                {this.renderWideLine()}
                <View style={{ height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                    {this.renderMenu()}
                </View>
            </View>
        );
    };
    renderMenu = () => {
        let nameArr = this.state.pageStateString.menu;
        let itemArr = [];
        for (let i = 0; i < nameArr.length; i++) {
            itemArr.push(
                <TouchableOpacity key={i} style={{
                    borderWidth: 1,
                    borderColor: nameArr[i].isRed ? color.red : DesignRule.color_ddd,
                    height: 30,
                    borderRadius: 10,
                    marginRight: 15,
                    justifyContent: 'center',
                    paddingLeft: 20,
                    paddingRight: 20
                }} onPress={() => {
                    this.operationMenuClick(nameArr[i]);
                }}>
                    <Text style={{ color: nameArr[i].isRed ? color.red : color.gray_666 }}>{nameArr[i].operation}</Text>
                </TouchableOpacity>
            );
        }
        return itemArr;
    };
    renderModal = () => {
        return (
            <View>
                <ShowMessageModal
                    isShow={this.state.isShowShowMessageModal}
                    detail={[
                        { icon: productDetailMessage, title: '消息' },
                        { icon: productDetailHome, title: '首页' }
                    ]}
                    ref={(ref)=>this.messageModal = ref}
                    clickSelect={(index) => {
                        switch (index) {
                            case 0:
                                this.$navigate('message/MessageCenterPage');
                                break;
                            case 1:
                                let resetAction = NavigationActions.reset({
                                    index: 0,
                                    actions: [
                                        NavigationActions.navigate({ routeName: 'Tab' })//要跳转到的页面名字
                                    ]
                                });
                                this.props.navigation.dispatch(resetAction);
                                break;
                        }
                        this.setState({ isShowShowMessageModal: false });
                    }}
                    closeWindow={() => this.setState({ isShowShowMessageModal: false })}
                />

                <CommonTwoChoiceModal
                    isShow={this.state.isShowDeleteOrderModal}
                    detail={{ title: '删除订单', context: '确定删除此订单吗', no: '取消', yes: '确认' }}
                    ref={(ref)=>{this.deleteModal = ref;}}
                    closeWindow={() => {
                        this.setState({ isShowDeleteOrderModal: false });
                    }}
                    yes={() => {
                        this.setState({ isShowDeleteOrderModal: false });
                        if (this.state.status === 4||this.state.status === 5) {
                            Toast.hiddenLoading();
                            Toast.showLoading();
                            OrderApi.deleteCompletedOrder({ orderNum: this.state.viewData.orderNum }).then((response) => {
                                Toast.hiddenLoading();
                                NativeModules.commModule.toast('订单已删除');
                                this.$navigateBack();
                                this.params.callBack && this.params.callBack();
                            }).catch(e => {
                                Toast.hiddenLoading();
                                NativeModules.commModule.toast(e.msg);
                            });

                        } else if (this.state.status === 6||this.state.status === 7||this.state.status === 8) {
                            Toast.showLoading();
                            OrderApi.deleteClosedOrder({ orderNum: this.state.viewData.orderNum }).then((response) => {
                                Toast.hiddenLoading();
                                NativeModules.commModule.toast('订单已删除');
                                this.$navigateBack();
                                this.params.callBack && this.params.callBack();
                            }).catch(e => {
                                Toast.hiddenLoading();
                                NativeModules.commModule.toast(e.msg);
                            });
                        } else {
                            NativeModules.commModule.toast('状态值异常，暂停操作');
                        }
                    }}
                    no={() => {
                        this.setState({ isShowDeleteOrderModal: false });
                    }}
                />
                <CommonTwoChoiceModal
                    isShow={this.state.isShowReceiveGoodsModal}
                    detail={{ title: '确认收货', context: '是否确认收货?', no: '取消', yes: '确认' }}
                    close={() => {
                        this.setState({ isShowReceiveGoodsModal: false });
                    }}
                    ref={(ref)=>this.receiveModal = ref}
                    yes={() => {
                        this.setState({ isShowReceiveGoodsModal: false });
                        Toast.showLoading();
                        OrderApi.confirmReceipt({ orderNum: this.state.viewData.orderNum }).then((response) => {
                            Toast.hiddenLoading();
                            NativeModules.commModule.toast('确认收货成功');
                            this.loadPageData();
                        }).catch(e => {
                            Toast.hiddenLoading();
                            this.$toastShow(e.msg);
                        });
                    }}
                    no={() => {
                        this.setState({ isShowReceiveGoodsModal: false });
                    }}
                />
                <SingleSelectionModal
                    isShow={this.state.isShowSingleSelctionModal}
                    ref={(ref)=>{this.cancelModal = ref}}
                    detail={this.state.cancelArr}
                    closeWindow={() => {
                        this.setState({ isShowSingleSelctionModal: false });
                    }}
                    commit={(index) => {
                        this.setState({ isShowSingleSelctionModal: false });
                        Toast.showLoading();
                        OrderApi.cancelOrder({
                            buyerRemark: this.state.cancelArr[index],
                            orderNum: this.state.viewData.orderNum
                        }).then((response) => {
                            Toast.hiddenLoading();
                            NativeModules.commModule.toast('订单已取消');
                            this.$navigateBack();
                            this.params.callBack && this.params.callBack();
                        }).catch(e => {
                            Toast.hiddenLoading();
                            NativeModules.commModule.toast(e.msg);
                        });
                    }}
                />
            </View>

        );
    };
    onContentSizeChange(event) {
        this.setState({ height: event.nativeEvent.contentSize.height });
    }



        renderAddress = () => {
            console.log('this.state.heightaddredd',this.state.height);
        return (
            <View style={{
                minHeight:83,
                backgroundColor: 'white',
                flexDirection: 'row',
                paddingTop: 10,
                paddingBottom: 10,
                alignItems: 'center'
            }}>
                <UIImage source={position} style={{ height: 20, width: 20, marginLeft: 20 }} resizeMode={'contain'}/>
                <View style={{ flex: 1, marginLeft: 15, marginRight: 20 }}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Text style={{
                            flex: 1,
                            fontSize: 15,
                            color: DesignRule.textColor_instruction
                        }}>收货人：{this.state.viewData.receiverName}</Text>
                        <Text style={{
                            fontSize: 15,
                            color: DesignRule.textColor_instruction
                        }}>{this.state.viewData.receiverNum}</Text>
                    </View>
                    <UIText value={
                        '收货地址：' + this.state.viewData.provinceString
                        + this.state.viewData.cityString
                        + this.state.viewData.areaString
                        + this.state.viewData.receiverAddress
                    }
                            style={{ color: DesignRule.textColor_instruction, fontSize: 15 ,marginTop:5}}/>
                </View>
            </View>
        );
    };

    renderLine = () => {
        return (
            <View style={{ height: 0.5, backgroundColor: DesignRule.lineColor_inColorBg }}/>
        );
    };
    renderWideLine = () => {
        return (
            <View style={{ height: 10, backgroundColor: DesignRule.bgColor }}/>
        );
    };
    //28:45:45后自动取消订单
    startCutDownTime = (overtimeClosedTime) => {
        let autoConfirmTime = Math.round((overtimeClosedTime - new Date().valueOf()) / 1000);
        if (autoConfirmTime < 0) {
            return;
        }
        (new TimeDownUtils()).settimer((time) => {
            let pageStateString = this.state.pageStateString;
            pageStateString.moreDetail = time.hours + ':' + time.min + ':' + time.sec + '后自动取消订单';
            this.setState({ pageStateString: pageStateString });
            if (time.hours === undefined && time.min === undefined && time.sec === undefined) {
                this.setState({
                    pageStateString: constants.pageStateString[10]
                });
                if (this.params.callBack) {
                    this.params.callBack();
                }
                this.loadPageData();
            }
        }, autoConfirmTime);
    };
    //06天18:24:45后自动确认收货
    startCutDownTime2 = (autoConfirmTime2) => {
        let autoConfirmTime = Math.round((autoConfirmTime2 - new Date().valueOf()) / 1000);
        if (autoConfirmTime < 0) {
            return;
        }
        (new TimeDownUtils()).settimer(time => {
            let pageStateString = this.state.pageStateString;
            pageStateString.moreDetail = time.days + '天' + time.hours + ':' + time.min + ':' + time.sec + '后自动确认收货';
            this.setState({ pageStateString: pageStateString });
            if (time.hours === undefined && time.min === undefined && time.sec === undefined) {
                this.setState({
                    pageStateString: constants.pageStateString[5]
                });
                if (this.params.callBack) {
                    this.params.callBack();
                }
                this.loadPageData();
            }
        }, autoConfirmTime);
    };
    //**********************************BusinessPart******************************************
    getAfterSaleService = (data, index) => {
        //售后状态
        let afterSaleService = [];
        let statusArr = [4, 16, 8];
        let isAfterSale = (data[index].restrictions & statusArr[0]) == statusArr[0] && (data[index].restrictions & statusArr[1]) == statusArr[1] &&
            (data[index].restrictions & statusArr[2]) == statusArr[2];
        switch (data[index].status) {
            case 2:
                if ((data[index].restrictions & statusArr[0]) == statusArr[0]) {
                    afterSaleService.push();
                } else {
                    afterSaleService.push({
                        id: 0,
                        operation: '退款',
                        isRed: false
                    });
                }

                break;
            case 3:
            case 4:
                if (isAfterSale) {
                    afterSaleService.push();
                } else {
                    switch (data[index].returnType) {
                        case 1://申请退款
                            afterSaleService.push({
                                id: 2,
                                operation: '退款中',
                                isRed: false
                            });
                            break;
                        case 2://申请退货
                            afterSaleService.push({
                                id: 3,
                                operation: '退货中',
                                isRed: false
                            });
                            break;
                        case 3://申请换货
                            afterSaleService.push({
                                id: 6,
                                operation: '换货中',
                                isRed: false
                            });
                            break;
                        default:
                            afterSaleService.push({
                                id: 1,
                                operation: '退换',
                                isRed: false
                            });
                    }
                }
                break;
            case 5:
                if (isAfterSale) {
                    afterSaleService.push();
                } else if ((data[index].finishTime || 0) - (new Date().valueOf()) < 0) {
                    afterSaleService.push();
                }
                else {
                    switch (data[index].returnType) {
                        case 1://申请退款
                            afterSaleService.push({
                                id: 2,
                                operation: '退款中',
                                isRed: false
                            });
                            break;
                        case 2://申请退货
                            afterSaleService.push({
                                id: 3,
                                operation: '退货中',
                                isRed: false
                            });
                            break;
                        case 3://申请换货
                            afterSaleService.push({
                                id: 6,
                                operation: '换货中',
                                isRed: false
                            });
                            break;
                        default:
                            afterSaleService.push({
                                id: 1,
                                operation: '退换',
                                isRed: false
                            });
                    }
                }
                break;
            case 6:
                switch (data[index].returnType) {
                    case 1://申请退款
                        afterSaleService.push({
                            id: 2,
                            operation: '售后完成',
                            isRed: false
                        });
                        break;
                    case 2://申请退货
                        afterSaleService.push({
                            id: 3,
                            operation: '售后完成',
                            isRed: false
                        });
                        break;
                    case 3://申请换货
                        afterSaleService.push({
                            id: 6,
                            operation: '售后完成',
                            isRed: false
                        });
                        break;
                    default:
                        afterSaleService.push();
                }
                break;
            case 7:
            case 8:
                afterSaleService.push();
                break;
        }
        return afterSaleService;
    };
    loadPageData() {
        Toast.showLoading();
        OrderApi.lookDetail({
            id: this.state.orderId,
            userId: user.id,
            status: this.params.status,
            orderNum: this.params.orderNum
        }).then((response) => {
            Toast.hiddenLoading();
            let data = response.data;
            let arr = [];
            if (data.orderType === 5 || data.orderType === 98) {//礼包。。。
                data.orderProductList[0].orderProductPriceList.map((item, index) => {
                    arr.push({
                        id: data.orderProductList[0].id,
                        orderId: item.orderProductId,
                        productId: item.productId,
                        uri: item.specImg,
                        goodsName: item.productName,
                        salePrice: StringUtils.isNoEmpty(item.originalPrice) ? item.originalPrice : 0,
                        category: item.spec,
                        goodsNum: item.productNum,
                        returnProductId: data.orderProductList[0].returnProductId,
                        returnType: data.orderProductList[0].returnType,
                        returnProductStatus: data.orderProductList[0].returnProductStatus,
                        status: data.orderProductList[0].status
                    });
                });
            } else {
                data.orderProductList.map((item, index) => {
                    arr.push({
                        id: item.id,
                        orderId: item.orderId,
                        productId: item.productId,
                        uri: item.specImg,
                        goodsName: item.productName,
                        salePrice: StringUtils.isNoEmpty(item.price) ? item.price : 0,
                        category: item.spec,
                        goodsNum: item.num,
                        returnProductId: item.returnProductId,
                        afterSaleService: this.getAfterSaleService(data.orderProductList, index),
                        returnProductStatus: item.returnProductStatus,
                        returnType: item.returnType,
                        status: item.status,
                        activityCode: item.activityCode
                    });
                });
            }

            let pageStateString = constants.pageStateString[parseInt(data.status)];
            /*
             * operationMenuCheckList
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
            switch (parseInt(data.status)) {
                // case 0:
                //     break
                //等待买家付款
                case 1:
                    this.startCutDownTime(data.shutOffTime);
                    pageStateString.sellerState = ['收货人:' + data.receiver,'' + data.recevicePhone];
                    pageStateString.sellerTime = '收货地址:' + data.province + data.city + data.area + data.address;
                    if (StringUtils.isEmpty(data.outTradeNo)) {
                        pageStateString.menu = [
                            {
                                id: 1,
                                operation: '取消订单',
                                isRed: false
                            }, {
                                id: 2,
                                operation: '去支付',
                                isRed: true
                            }
                        ];
                    } else {
                        pageStateString.menu = [
                            {
                                id: 1,
                                operation: '取消订单',
                                isRed: false
                            }, {
                                id: 3,
                                operation: '继续支付',
                                isRed: true
                            }
                        ];
                    }
                    break;
                //买家已付款 待发货
                case 2:
                    pageStateString.menu = [];
                    break;
                //卖家已发货 待收货
                case 3:
                    this.startCutDownTime2(data.autoReceiveTime);
                    pageStateString.sellerTime = '';
                    break;
                //   确认收货
                case 4:
                    pageStateString.sellerState = '已签收';
                    pageStateString.logisticsTime=data.deliverTime?data.deliverTime:data.finishTime
                    break;
                //订单已完成
                case 5:
                    if (data.orderType == 5 || data.orderType == 98) {
                        pageStateString.menu = [
                            {
                                id: 7,
                                operation: '删除订单',
                                isRed: false
                            }
                        ];
                    }
                    pageStateString.sellerTime = '收货地址：' + data.province + data.city + data.area + data.address;
                    pageStateString.logisticsTime=data.deliverTime?data.deliverTime:data.finishTime
                    break;
                case 6://退货关闭
                case 7://用户关闭
                case 8://超时关闭
                    if (data.orderType == 5 || data.orderType == 98) {
                        pageStateString.menu = [
                            {
                                id: 7,
                                operation: '删除订单',
                                isRed: false
                            }
                        ];
                    }
                    pageStateString.sellerState = '订单已关闭';
                    pageStateString.moreDetail = data.buyerRemark;
                    pageStateString.logisticsTime=data.shutOffTime?data.shutOffTime:null
                    break;

            }
            this.setState({
                viewData: {
                    expressNo: data.expressNo,
                    orderId: this.params.orderId,
                    list: arr,
                    receiverName: data.receiver,
                    receiverNum: data.recevicePhone,
                    receiverAddress: data.address,
                    provinceString: data.province,
                    cityString: data.city,
                    areaString: data.area,
                    goodsPrice: data.totalProductPrice,//商品价格(detail.totalPrice-detail.freightPrice)
                    freightPrice: data.freightPrice,//运费（快递）
                    tokenCoin: data.tokenCoin || 0,//一元券抵扣
                    couponPrice: data.couponPrice || 0,//优惠券抵扣
                    totalPrice: data.totalOrderPrice,//订单总价
                    orderTotalPrice: data.needPrice,//需付款
                    orderNum: data.orderNum,//订单编号
                    createTime: data.createTime,//创建时间
                    platformPayTime: data.platformPayTime,//平台付款时间
                    payTime: data.payTime,//三方付款时间
                    outTradeNo: data.outTradeNo,//三方交易号
                    sendTime: data.sendTime,//发货时间
                    finishTime: data.finishTime,//成交时间
                    autoConfirmTime: data.autoReceiveTime,//自动确认时间
                    deliverTime: data.deliverTime,
                    pickedUp: data.pickedUp,//
                    cancelTime: data.cancelTime ? data.cancelTime : null,//取消时间,
                    shutOffTime:data.shutOffTime,//超时关闭时间
                },
                afterSaleService: this.getAfterSaleService(data.orderProductList, 0),
                returnProductStatus: data.orderProductList[0].returnProductStatus,
                pageStateString: pageStateString,
                expressNo: data.expressNo,
                pageState: data.pageState,
                activityId: data.activityId,
                orderType: data.orderType,
                allData: data,
                payType: (data.orderPayRecord ? data.orderPayRecord.type : null),
                orderProductPrices: data.orderProductList[0].price,//礼包，套餐啥的,
                giftPackageName: data.orderType == 5 || data.orderType == 98 ? data.orderProductList[0].productName : '礼包',
                status: data.status,//订单状态
                activityCode: data.orderProductList[0] && data.orderProductList[0].activityCode ? data.orderProductList[0].activityCode : null,//礼包的code
                giftBagCoupons: data.orderProductList[0] && data.orderProductList[0].giftBagCoupons ? data.orderProductList[0].giftBagCoupons : []

            });
            console.log('setView', this.state.viewData);
        }).catch(e => {
            Toast.hiddenLoading();
            Toast.$toast(e.msg);
            if (e.code === 10009) {
                this.$navigate('login/login/LoginPage', {
                    callback: () => {
                        this.loadPageData();
                    }
                });
            }
        });
    }

    clickItem = (index, item) => {
        console.log('clickItem', index, item);
        switch (this.state.orderType) {
            case 1://秒杀
            case 2://降价拍
                this.$navigate('home/product/ProductDetailPage', {
                    activityType: this.state.orderType,
                    // activityCode: this.state.viewData.list[index].activityCode//
                    productId: this.state.viewData.list[index].productId
                });
                break;
            case 3://不是礼包，5才是
                this.$navigate('topic/TopicDetailPage', {
                    activityType: 3,
                    activityCode: this.state.viewData.list[index].activityCode
                });
                break;
            case 5://普通礼包
                this.$navigate('topic/TopicDetailPage', {
                    activityType: 3,
                    activityCode: this.state.activityCode
                });
                break;

            case 98://升级礼包
                this.$navigate('topic/TopicDetailPage', {
                    activityType: 3,
                    activityCode: this.state.activityCode
                });
                break;

            case 99://普通商品
                this.$navigate('home/product/ProductDetailPage', { productId: this.state.viewData.list[index].productId });
                break;
        }
    };
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
        this.setState({ menu: menu });
        switch (menu.id) {
            case 1:
                if(this.state.cancelArr.length>0){
                    this.setState({ isShowSingleSelctionModal: true });
                    this.cancelModal && this.cancelModal.open();
                }else{
                    this.$toastShow('无取消类型！');
                }

                break;
            case 2:
                this.$navigate('payment/PaymentMethodPage', {
                    orderNum: this.state.viewData.orderNum,
                    amounts: this.state.viewData.orderTotalPrice
                    // orderType: this.state.viewData.pickedUp - 1
                });
                break;
            case 3:
                this.$navigate('payment/PaymentMethodPage', {
                    orderNum: this.state.viewData.orderNum,
                    amounts: this.state.viewData.orderTotalPrice,
                    outTradeNo: this.state.viewData.outTradeNo
                });
                break;
            case 4:
                // this.navigate(RouterPaths.AfterSaleServicePage,{
                //     pageType:0,
                //     pageData:this.state.viewData,
                //     index:0,
                // })
                NativeModules.commModule.toast('目前仅支持单个商品退款');
                break;
            case 5:
                this.$navigate('order/logistics/LogisticsDetailsPage', {
                    orderNum: this.state.viewData.orderNum,
                    orderId: this.state.orderId,
                    expressNo: this.state.expressNo
                });
                break;
            case 6:
                console.log(this.state.viewData.list);
                let j = 0;
                let returnTypeArr = ['', '退款', '退货', '换货'];
                for (let i = 0; i < this.state.viewData.list.length; i++) {
                    let returnProductStatus = this.state.viewData.list[i].returnProductStatus || 99999;
                    if (returnProductStatus === 1) {
                        let content = '确认收货将关闭' + returnTypeArr[this.state.viewData.list[i].returnType] + '申请，确认收货吗？';
                        Alert.alert('提示', `${ content }`, [
                            {
                                text: '取消', onPress: () => {
                                }
                            },
                            {
                                text: '确定', onPress: () => {
                                    Toast.showLoading();
                                    OrderApi.confirmReceipt({ orderNum: this.state.viewData.orderNum }).then((response) => {
                                        Toast.hiddenLoading();
                                        NativeModules.commModule.toast('确认收货成功');
                                        this.getDataFromNetwork();
                                    }).catch(e => {
                                        Toast.hiddenLoading();
                                        NativeModules.commModule.toast(e.msg);
                                    });
                                }
                            }
                        ], { cancelable: true });
                        j++;
                        break;
                    }
                }
                if (j == 0) {
                    this.setState({ isShowReceiveGoodsModal: true });
                    this.receiveModal && this.receiveModal.open();
                }
                // this.setState({ isShowReceiveGoodsModal: true });
                break;
            case 7:
                this.setState({ isShowDeleteOrderModal: true });
                this.deleteModal && this.deleteModal.open();
                break;
            case 8:
                Toast.showLoading();
                OrderApi.againOrder({
                    orderNum: this.state.viewData.orderNum,
                    id: this.state.orderId
                }).then((response) => {
                    let cartData = [];
                    Toast.hiddenLoading();
                    response.data.orderProducts.map((item, index) => {
                        cartData.push({ productId: item.productId, priceId: item.priceId, amount: item.num });
                    });
                    shopCartCacheTool.addGoodItem(cartData);
                    this.$navigate('shopCart/ShopCart', { hiddeLeft: false });
                }).catch(e => {
                    Toast.hiddenLoading();
                    NativeModules.commModule.toast(e.msg);
                });
                break;
        }
    };
    copyOrderNumToClipboard = () => {
        StringUtils.clipboardSetString(this.state.viewData.orderNum);
        NativeModules.commModule.toast('订单号已经复制到剪切板');
    };
    afterSaleServiceClick = (menu, index) => {
        console.log(menu);
        // afterSaleService:[
        //             {
        //                 id:0,
        //                 operation:'退款',
        //                 isRed:false,
        //             },{
        //                 id:1,
        //                 operation:'退换',
        //                 isRed:false,
        //             },{
        //                 id:2,
        //                 operation:'退款中',
        //                 isRed:false,
        //             },{
        //                 id:3,
        //                 operation:'退货中',
        //                 isRed:false,
        //             },{
        //                 id:4,
        //                 operation:'售后完成',
        //                 isRed:true,
        //             },{
        //                 id:5,
        //                 operation:'售后失败',
        //                 isRed:true,
        //             },
        // {
        //                 id:6,
        //                 operation:'换货中',
        //                 isRed:true,
        //             },
        //         ],
        switch (menu.id) {
            case 0:
                this.$navigate('order/afterSaleService/AfterSaleServicePage', {
                    pageType: 0,
                    orderProductId: this.state.orderType == 5 || this.state.orderType == 98 ? this.state.viewData.list[0].id : this.state.viewData.list[index].id
                });
                break;
            case 1:
                this.$navigate('order/afterSaleService/AfterSaleServiceHomePage', {
                    pageData: this.state.allData,
                    index: index
                });
                break;
            case 2:
                this.$navigate('order/afterSaleService/ExchangeGoodsDetailPage', {
                    pageType: 0,
                    returnProductId: this.state.orderType == 5 || this.state.orderType == 98 ? this.state.viewData.list[0].returnProductId : this.state.viewData.list[index].returnProductId
                });
                break;
            case 3:
                this.$navigate('order/afterSaleService/ExchangeGoodsDetailPage', {
                    pageType: 1,
                    returnProductId: this.state.orderType == 5 || this.state.orderType == 98 ? this.state.viewData.list[0].returnProductId : this.state.viewData.list[index].returnProductId
                });
                break;
            case 6:
                this.$navigate('order/afterSaleService/ExchangeGoodsDetailPage', {
                    pageType: 2,
                    returnProductId: this.state.orderType == 5 || this.state.orderType == 98 ? this.state.viewData.list[0].returnProductId : this.state.viewData.list[index].returnProductId
                });
                break;
        }
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: DesignRule.bgColor,
        marginBottom: ScreenUtils.safeBottom
    }, redRectangle: {
        width: ScreenUtils.width,
        height: 100,
        backgroundColor: color.red,
        flexDirection: 'row',
        paddingLeft: 22,
        position: 'absolute',
        alignItems: 'center'
    }, whiteRectangle: {
        height: 81,
        marginTop: 69,
        backgroundColor: 'white',
        marginLeft: 15,
        marginRight: 15,
        justifyContent: 'space-between',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    grayView: {
        width: 90,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'white',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: DesignRule.lineColor_inGrayBg,
        marginRight: 15,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10
    }, grayText: {
        fontSize: 13,
        lineHeight: 18,
        color: DesignRule.textColor_secondTitle
    },
     topOrderDetail:{
         minHeight:81,
         marginTop: 69,
         backgroundColor: 'white',
         marginLeft: 15,
         marginRight: 15,
         paddingTop:5,
         paddingBottom:5,
         borderRadius: 10,
         justifyContent:'center'
     }
});

export default MyOrdersDetailPage;
