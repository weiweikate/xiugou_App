import { TabNavigator } from 'react-navigation';
import React, { Component } from 'react';
import { DeviceEventEmitter, Text, View } from 'react-native';
import Home from '../pages/home/HomePage';
import Mine from '../pages/mine/page/MinePage';
import ShopCart from '../pages/shopCart/page/ShopCartPage';
import MyShop_RecruitPage from '../pages/spellShop/MyShop_RecruitPage';
import { StyleSheet, Image, ImageBackground } from 'react-native';
import res from '../comm/res';
import ScreenUtils from '../utils/ScreenUtils';
import ShowListPage from '../pages/show/ShowListPage';
import user from '../model/user';
import { homeTabManager } from '../pages/home/model/HomeTabManager';
import RouterMap from './RouterMap';
import DesignRule from '../constants/DesignRule';
import { observer } from 'mobx-react';
import { autorun } from 'mobx';
import Animation from 'lottie-react-native';
import { TrackApi } from '../utils/SensorsTrack';


const NormalTab = ({ source, title }) => {
    return <View style={styles.tab}>
        <Image style={styles.tabBarIcon} source={source}/>
        <Text style={styles.text}>{title}</Text>
    </View>;
};

const ActiveTab = ({ source, title }) => {
    return <View style={styles.tab}>
        <Image style={styles.tabBarIcon} source={source}/>
        <Text style={styles.activeText}>{title}</Text>
    </View>;
};

const Tab = ({ focused, activeSource, normalSource, title }) => {
    if (focused) {
        return <ActiveTab source={activeSource} title={title}/>;
    }
    return <NormalTab source={normalSource} title={title}/>;
};

@observer
class SpellShopTab extends Component {
    render() {
        const { focused, normalSource, activeSource } = this.props;
        if (!user) {
            return <Tab focused={focused} normalSource={normalSource} activeSource={activeSource} title={'拼店'}/>;
        }

        if (!user.isLogin) {
            return <Tab focused={focused} normalSource={normalSource} activeSource={activeSource} title={'拼店'}/>;
        }

        if (user.levelRemark >= 'V2' && !user.storeCode) {
            return <Image style={styles.store} source={res.tab.home_store}/>;
        }

        if (user.storeCode && user.levelRemark >= 'V2' && user.storeStatus === 0) {
            return <Image style={styles.store} source={res.tab.home_store}/>;
        }

        return <Tab focused={focused} normalSource={normalSource} activeSource={activeSource} title={'拼店'}/>;
    }
}

@observer
class HomeTab extends Component {

    render() {
        if (!homeTabManager.homeFocus) {
            return <Tab normalSource={res.tab.home_n} title={'首页'}/>;
        }
        return (
            <ImageBackground style={styles.home} source={res.tab.home_s_bg}>
                <Animation
                    ref={animation => {
                        this.animation = animation;
                    }}
                    style={styles.home}
                    loop={false}
                    imageAssetsFolder={'lottie/home'}
                    source={require('./tab_to_top.json')}/>
            </ImageBackground>
        );
    }

    observeAboveRecommend = autorun(() => {
        const { aboveRecommend } = homeTabManager;
        this.animation && (aboveRecommend ? this.animation.play(0, 7) : this.animation.play(10, 17));
    });

    componentDidUpdate(prevProps) {
        const { aboveRecommend } = homeTabManager;
        this.animation && (this.animation.setNativeProps({ progress: aboveRecommend ? 0.5 : 1 }));
    }
}

const ShowFlag = () => <View style={styles.shopFlag}>
    <ImageBackground style={styles.flagBg} source={res.tab.home_store_flag}>
        <Text style={styles.flagText}>快享拼店价</Text>
    </ImageBackground>
</View>;

@observer
export class SpellShopFlag extends Component {
    state = {
        isFlag: true
    };

    componentWillReceiveProps(nextProps) {
        const { isShow } = nextProps;
        if (isShow) {
            setTimeout(() => {
                this.setState({ isFlag: isShow });
            }, 400);
        } else {
            this.setState({ isFlag: isShow });
        }
    }

    render() {
        if (!this.state.isFlag) {
            return null;
        }
        if (!user) {
            return null;
        }
        if (!user.isLogin) {
            return null;
        }
        if (user.levelRemark >= 'V2' && !user.storeCode) {
            return <ShowFlag/>;
        }
        if (user.storeCode && user.levelRemark >= 'V2' && user.storeStatus === 0) {
            return <ShowFlag/>;
        }

        return null;
    }
}

export const TabNav = TabNavigator(
    {
        HomePage: {
            screen: Home,
            navigationOptions: {
                tabBarIcon: ({ focused }) => <HomeTab normalSource={res.tab.home_n}
                                                      title={'首页'}/>,
                tabBarOnPress: (tab) => {
                    const { jumpToIndex, scene, previousScene } = tab;
                    if (previousScene.key !== 'HomePage') {
                        jumpToIndex(scene.index);
                    } else {
                        DeviceEventEmitter.emit('retouch_home');
                    }
                }
            }


        },
        ShowListPage: {
            screen: ShowListPage,
            navigationOptions: {
                tabBarLabel: '秀场',
                tabBarIcon: ({ focused }) => <Tab focused={focused} normalSource={res.tab.discover_n}
                                                  activeSource={res.tab.discover_s} title={'秀场'}/>,
                tabBarOnPress: (tab) => {
                    const { jumpToIndex, scene, previousScene } = tab;
                    if (previousScene.key !== 'ShowListPage') {
                        jumpToIndex(scene.index);
                        TrackApi.WatchXiuChang({moduleSource:1})
                    }
                }
            }
        },
        MyShop_RecruitPage: {
            screen: MyShop_RecruitPage,
            navigationOptions: {
                tabBarIcon: ({ focused }) => {
                    return <SpellShopTab focused={focused} normalSource={res.tab.group_n}
                                         activeSource={res.tab.group_s}/>;
                }
            }
        },
        ShopCartPage: {
            screen: ShopCart,
            navigationOptions: ({ navigation }) => ({
                tabBarIcon: ({ focused }) => <Tab focused={focused} normalSource={res.tab.cart_n}
                                                  activeSource={res.tab.cart_s} title={'购物车'}/>
            })
        },
        MinePage: {
            screen: Mine,
            navigationOptions: ({ navigation }) => ({
                tabBarIcon: ({ focused }) => <Tab focused={focused} normalSource={res.tab.mine_n}
                                                  activeSource={res.tab.mine_s} title={'我的'}/>,
                tabBarOnPress: (tab) => {
                    const { jumpToIndex, scene } = tab;
                    if (user && user.isLogin) {
                        jumpToIndex(scene.index);
                    } else {
                        navigation.navigate(RouterMap.LoginPage);
                    }
                }
            })
        }
    },
    {
        tabBarOptions: {
            showIcon: true,
            showLabel: false,
            //showLabel - 是否显示tab bar的文本，默认是true
            //是否将文本转换为大小，默认是true
            upperCaseLabel: false,
            //material design中的波纹颜色(仅支持Android >= 5.0)
            pressColor: '#788493',
            //按下tab bar时的不透明度(仅支持iOS和Android < 5.0).
            pressOpacity: 0.8,
            //tab bar的样式
            style: {
                backgroundColor: '#fff',
                paddingBottom: ScreenUtils.safeBottomMax + 1,
                height: 48,
                borderTopWidth: 0.2,
                borderTopColor: '#ccc'
            },
            allowFontScaling: false,
            //tab 页指示符的样式 (tab页下面的一条线).
            indicatorStyle: { height: 0 }
        },
        //tab bar的位置, 可选值： 'top' or 'bottom'
        tabBarPosition: 'bottom',
        //是否允许滑动切换tab页
        swipeEnabled: false,
        //是否在切换tab页时使用动画
        animationEnabled: false,
        //是否懒加载
        lazy: true,
        //返回按钮是否会导致tab切换到初始tab页？ 如果是，则设置为initialRoute，否则为none。 缺省为initialRoute。
        backBehavior: 'none'
    });
const styles = StyleSheet.create({
    tabBarIcon: {
        width: 24,
        height: 24
    },
    home: {
        width: 44,
        height: 44
    },
    store: {
        width: 40,
        height: 40
    },
    text: {
        color: '#666',
        fontSize: 11,
        marginTop: 4,
        width: 60,
        textAlign: 'center'
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    activeText: {
        color: DesignRule.mainColor,
        fontSize: 11,
        marginTop: 4,
        width: 60,
        textAlign: 'center'
    },
    shopFlag: {
        position: 'absolute',
        bottom: 45 + ScreenUtils.safeBottom,
        left: (ScreenUtils.width - 76) / 2,
        width: 76,
        height: 23
    },
    flagBg: {
        width: 76,
        height: 23,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 4
    },
    flagText: {
        color: '#fff',
        fontSize: 12
    }
});
