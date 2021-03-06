import React from 'react';
import { observer } from 'mobx-react';

import {
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    ListView,
    RefreshControl,
    BackHandler
} from 'react-native';
import { SwipeListView } from '../../../components/ui/react-native-swipe-list-view';
import BasePage from '../../../BasePage';
import ScreenUtils from '../../../utils/ScreenUtils';
import {
    UIText
} from '../../../components/ui/index';
import res from '../res';
import shopCartStore from '../model/ShopCartStore';
import shopCartCacheTool from '../model/ShopCartCacheTool';
import DesignRule from '../../../constants/DesignRule';
const dismissKeyboard = require('dismissKeyboard');
import ShopCartEmptyView from '../components/ShopCartEmptyView';
import ShopCartCell from '../components/ShopCartCell';
import SectionHeaderView from '../components/SectionHeaderView';
import RouterMap from '../../../navigation/RouterMap';
import user from '../../../model/user';
import StringUtils from '../../../utils/StringUtils';

const {px2dp} = ScreenUtils


@observer
export default class ShopCartPage extends BasePage {
    $navigationBarOptions = {
        title: '购物车',
        leftNavItemHidden: true
    };

    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.contentList = null;
        let hiddeLeft = true;
        if (!(this.params.hiddeLeft === undefined)) {
            hiddeLeft = this.params.hiddeLeft;
        } else {
            hiddeLeft = true;
        }
        this.$navigationBarOptions.leftNavItemHidden = hiddeLeft;
        this.state = {
            showNav: false
        };
    }

    componentDidMount() {
        this.didFocusSubscription = this.props.navigation.addListener(
            'didFocus',
            payload => {
                BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
                this.pageFocus = true;
                shopCartCacheTool.getShopCartGoodsListData();
            }
        );
        this.willBlurSubscription = this.props.navigation.addListener(
            'willBlur',
            payload => {
                BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
            }
        );
        this.didBlurSubscription = this.props.navigation.addListener(
            'didBlur',
            payload => {
                this.pageFocus = false;
            }
        );
    }

    componentWillUnmount() {
        this.didFocusSubscription && this.didFocusSubscription.remove();
        this.didBlurSubscription && this.didBlurSubscription.remove();
        this.willBlurSubscription && this.willBlurSubscription.remove();
    }

    handleBackPress = () => {
        if (this.$navigationBarOptions.leftNavItemHidden) {
            this.$navigate('HomePage');
            return true;
        } else {
            return false;
        }
    };

    _render() {
        return (
            <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'column' }}>
                {shopCartStore.cartData && shopCartStore.cartData.length > 0 ? this._renderListView() : this._renderEmptyView()}
                {shopCartStore.cartData && shopCartStore.cartData.length > 0 ? this._renderShopCartBottomMenu() : null}
            </View>
        );
    }

    _renderEmptyView = () => {
        return (
            <ShopCartEmptyView btnClickAction={() => {
                this._gotoLookAround();
            }}/>
        );
    };
    _gotoLookAround = () => {
        this.$navigateBackToHome();
    };
    _renderListView = () => {
        if (!this.pageFocus) {
            return;
        }
        const { statusBarHeight } = ScreenUtils;
        return (

            <View
                style={{
                    width: ScreenUtils.width,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1
                }}>

                <SwipeListView
                    extraData={this.state}
                    style={{
                        width: ScreenUtils.width
                    }}
                    sections={shopCartStore.cartData}
                    useSectionList={true}
                    disableRightSwipe={true}
                    renderItem={(rowData, rowMap) => (
                        this._renderValidItem(rowData, rowMap)
                    )}
                    renderHiddenItem={(data, rowMap) => (
                        this._renderRowHiddenComponent(data, rowMap)
                    )}
                    renderHeaderView={(sectionData) => {
                        console.log(sectionData.section);
                        return (
                            <SectionHeaderView
                                sectionData={sectionData.section}
                                gotoCollectBills={(sectionData) => {
                                    this._gotoCollectBills(sectionData);
                                }}
                            />
                        );
                    }}
                    listViewRef={(listView) => this.contentList = listView}
                    rightOpenValue={-75}
                    showsVerticalScrollIndicator={false}
                    swipeRefreshControl={
                        <RefreshControl
                            refreshing={shopCartStore.isRefresh}
                            onRefresh={() => {
                                this._refreshFun();
                            }
                            }
                            progressViewOffset={statusBarHeight + 44}
                            colors={[DesignRule.mainColor]}
                            title="下拉刷新"
                            tintColor={DesignRule.textColor_instruction}
                            titleColor={DesignRule.textColor_instruction}
                        />
                    }
                />
            </View>
        );
    };
    _gotoCollectBills = (sectionData) => {
        if (!StringUtils.isEmpty(sectionData.activityCode)) {
            this.$navigate(RouterMap.XpDetailPage, {
                activityCode: sectionData.activityCode
            });
        } else {
            this.$toastShow('活动不存在');
        }

    };
    _renderRowHiddenComponent = (data, rowMap) => {
        return (
            <TouchableOpacity
                style={styles.standaloneRowBack}
                onPress={() => {
                    rowMap[data.item.key].closeRow();
                    this._deleteFromShoppingCartByProductId(data);
                }}>
                <View
                    style={
                        {
                            backgroundColor: 'white',
                            height: 140,
                            width: ScreenUtils.width,
                            marginTop: -20,
                            justifyContent: 'center',
                            alignItems: 'flex-end'
                        }
                    }
                >
                    <View
                        style={{
                            width: 75,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: DesignRule.mainColor,
                            height: 140
                        }}
                    >
                        <UIText style={styles.backUITextWhite} value='删除'/>
                    </View>

                </View>
            </TouchableOpacity>
        );
    };
    _renderShopCartBottomMenu = () => {
        if (!this.pageFocus) {
            return;
        }
        let hiddeLeft = true;
        if (!(this.params.hiddeLeft === undefined)) {
            hiddeLeft = this.params.hiddeLeft;
        } else {
            hiddeLeft = true;
        }
        return (
            <View
                style={[{
                    height: 49,
                    width: ScreenUtils.width,
                    backgroundColor: 'white',
                    zIndex: 20
                },
                    (!hiddeLeft && ScreenUtils.tabBarHeight > 49)
                        ?
                        { height: 83 }
                        :
                        null
                ]}
            >
                <View style={styles.CartBottomContainer}>
                    <TouchableOpacity
                        style={{ flexDirection: 'row', paddingLeft: 19, alignItems: 'center' }}
                        onPress={() => this._selectAll()}
                    >
                        <Image
                            source={shopCartStore.computedSelect ? res.button.selected_circle_red : res.button.unselected_circle}
                            style={{ width: 22, height: 22 }}/>
                        <UIText
                            value={'全选'}
                            style={{
                                fontSize: 13,
                                color: DesignRule.textColor_instruction,
                                marginLeft: 10
                            }}/>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <UIText
                            value={'合计'}
                            style={{ fontSize: 13, color: DesignRule.textColor_mainTitle }}/>
                        <UIText
                            value={'¥' + shopCartStore.getTotalMoney}
                            style={styles.totalPrice}/>
                        <TouchableOpacity
                            style={styles.selectGoodsNum}
                            onPress={() => this._toBuyImmediately()}
                        >
                            <UIText
                                value={`结算(${shopCartStore.getTotalSelectGoodsNum})`}
                                style={{ color: 'white', fontSize: 16 }}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    _renderValidItem = (itemData, rowMap) => {
        return (
            <ShopCartCell itemData={itemData.item}
                          rowMap={rowMap}
                          rowId={itemData.index}
                          sectionData={itemData.section}
                          cellClickAction={
                              (itemData) => {
                                  this._jumpToProductDetailPage(itemData);
                              }}/>
        );
    };

    _refreshFun = () => {
        shopCartStore.setRefresh(true);
        shopCartCacheTool.getShopCartGoodsListData();
    };

    _toBuyImmediately = () => {
        dismissKeyboard();
        if (!user.isLogin) {
            this.$navigate(RouterMap.LoginPage);
            return;
        }
        let [...selectArr] = shopCartStore.startSettlement();
        if (selectArr.length <= 0) {
            this.$toastShow('请先选择结算商品~');
            return;
        }
        let isCanSettlement = true;
        let haveNaNGood = false;
        let tempArr = [];
        selectArr.map(good => {
            if (good.amount > good.sellStock) {
                isCanSettlement = false;
            }
            if (good.amount > 0 && !isNaN(good.amount)) {
                tempArr.push(good);
            }
            if (isNaN(good.amount)) {
                haveNaNGood = true;
                isCanSettlement = false;
            }
        });

        if (haveNaNGood) {
            this.$toastShow('存在选中商品数量为空,或存在正在编辑的商品,请确认~');
            return;
        }
        if (!isCanSettlement) {
            this.$toastShow('商品库存不足请确认~');
            return;
        }
        if (isCanSettlement && !haveNaNGood) {
            let buyGoodsArr = [];
            tempArr.map((goods) => {
                buyGoodsArr.push({
                    skuCode: goods.skuCode,
                    quantity: goods.amount,
                    productCode: goods.spuCode
                });
            });
            this.$navigate('order/order/ConfirOrderPage', {
                orderParamVO: {
                    orderType: 99,
                    orderProducts: buyGoodsArr,
                    source: 1
                }
            });
        }
    };
    _jumpToProductDetailPage = (itemData) => {

        if (itemData.productStatus === 0) {
            return;
        }
        if (itemData.sectionType === 8) {
            this.$navigate(RouterMap.XpDetailPage, {
                activityCode: itemData.activityCode
            });
            return;
        }
        this.$navigate('product/ProductDetailPage', {
            productId: itemData.productId,
            productCode: itemData.spuCode
        });
    };
    _selectAll = () => {
        shopCartStore.isSelectAllItem(!shopCartStore.computedSelect);
    };
    /*删除操作*/
    _deleteFromShoppingCartByProductId = (itemData) => {
        console.log('删除前');
        console.log(itemData);
        let delteCode = [
            { 'skuCode': itemData.item.skuCode }
        ];
        shopCartCacheTool.deleteShopCartGoods(delteCode);
    };
}

const styles = StyleSheet.create({
    standaloneRowBack: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end'

    },
    backUITextWhite: {
        marginRight: 0,
        color: 'white',
        fontSize: px2dp(17)
    },
    addOrReduceBtnStyle: {
        fontSize: px2dp(13),
        color: DesignRule.textColor_mainTitle
    },
    validItemContainer: {
        height: px2dp(140),
        flexDirection: 'row',
        backgroundColor: DesignRule.bgColor
    },
    validProductImg: {
        width: px2dp(80),
        height: px2dp(80),
        marginLeft: px2dp(16),
        marginRight: px2dp(16)
    },
    validConUITextContainer: {
        flex: 1,
        height: px2dp(100),
        justifyContent: 'space-between',
        marginTop: px2dp(10),
        paddingRight: px2dp(15)
    },
    invalidItemContainer: {
        height: px2dp(100),
        flexDirection: 'row',
        backgroundColor: 'white'
    },
    invalidUITextInvalid: {
        width: px2dp(38),
        height: px2dp(20),
        borderRadius: px2dp(10),
        backgroundColor: DesignRule.textColor_instruction,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: px2dp(12)
    },
    invalidProductImg: {
        width: px2dp(80),
        height: px2dp(80),
        marginLeft: px2dp(7),
        marginRight: px2dp(15)
    },
    invalidUITextContainer: {
        flex: 1,
        height: px2dp(100),
        justifyContent: 'space-between',
        marginTop: px2dp(30),
        paddingRight: px2dp(15)
    },

    CartBottomContainer: {
        width: ScreenUtils.width,
        height: px2dp(49),
        backgroundColor: 'white',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center'
    },
    totalPrice: {
        fontSize: px2dp(13),
        color: DesignRule.mainColor,
        marginLeft: px2dp(10),
        marginRight: px2dp(10)
    },
    selectGoodsNum: {
        width: px2dp(110),
        height: px2dp(49),
        backgroundColor: DesignRule.mainColor,
        justifyContent: 'center',
        alignItems: 'center'
    },

    TextInputStyle: {
        padding: 0,
        paddingTop: px2dp(5),
        height: px2dp(30),
        width: px2dp(46),
        fontSize: px2dp(11),
        color: DesignRule.textColor_mainTitle,
        alignSelf: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        paddingVertical: 0
    },
    validContextContainer: {
        flex: 1,
        height: px2dp(100),
        justifyContent: 'space-between',
        marginTop: px2dp(10),
        paddingRight: px2dp(15)
    }
});
