import React, { Component } from 'react';
import {
    Text, View, ScrollView, TouchableHighlight, StyleSheet, Platform, Image, TextInput, TouchableWithoutFeedback,
} from 'react-native';
import RouterMap from '../../RouterMap';
import ViewPager from '../../components/ui/ViewPager';
import ScreenUtils from '../../utils/ScreenUtils';
import UIImage from '../../components/ui/UIImage';

const imageUrls = [
    'https://yanxuan.nosdn.127.net/2ac89fb96fe24a2b69cae74a571244cb.jpg?imageView&quality=75&thumbnail=750x0',
    'https://yanxuan.nosdn.127.net/8f283dd0ad76bb48ef9c29a04690816a.jpg?imageView&quality=75&thumbnail=750x0',
    'https://yanxuan.nosdn.127.net/a9e80a3516c99ce550c7b5574973c22f.jpg?imageView&quality=75&thumbnail=750x0',
    'https://yanxuan.nosdn.127.net/11b673687ae33f87168cc7b93250c331.jpg?imageView&quality=75&thumbnail=750x0',
];
const DemoList = [
    {
        title: '登录页面',
        uri: 'login/login/LoginPage'
    },
    {
        title: '我的订单',
        uri: 'order/order/MyOrdersListPage',
        params: {
            index: 0
        }
    },
    {
        title: '搜索页面',
        uri: RouterMap.SearchPage,
    }
];
export default class HomePage extends Component {

    constructor() {
        super();
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.navbar}>
                    <Image source={require('./res/icons/logo.png')} style={styles.logo}/>
                    <View style={styles.searchBox}>
                        <Image source={require('./res/icon_search.png')} style={styles.searchIcon}/>
                        <TextInput
                            keyboardType='web-search'
                            placeholder='请输入关键词搜索'
                            style={styles.inputText}/>
                    </View>
                    <Image source={require('./res/icons/msg.png')} style={styles.scanIcon}/>

                </View>
                <ScrollView>

                    <ViewPager style={{
                        height: 220,
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        width: ScreenUtils.width
                    }}
                               arrayData={imageUrls}
                               renderItem={(item) => this.renderViewPageItem(item)}
                               dotStyle={{
                                   height: 5,
                                   width: 5,
                                   borderRadius: 5,
                                   backgroundColor: '#ffffff',
                                   opacity: 0.4
                               }}
                               activeDotStyle={{ height: 5, width: 30, borderRadius: 5, backgroundColor: '#ffffff' }}
                               autoplay={true}
                    />

                    <View style={styles.menuView}>
                        <TouchableWithoutFeedback onPress={() => {

                        }}>
                            <View style={{ alignItems: 'center', flex: 1 }}>
                                <Image style={styles.iconImg} source={require('./res/icons/zq.png')}/>
                                <Text style={styles.showText}>赚钱</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => {

                        }}>
                            <View style={{ alignItems: 'center', flex: 1 }}>
                                <Image style={styles.iconImg} source={require('./res/icons/sq.png')}/>
                                <Text style={styles.showText}>省钱</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => {

                        }}>
                            <View style={{ alignItems: 'center', flex: 1 }}>
                                <Image style={styles.iconImg} source={require('./res/icons/fx.png')}/>
                                <Text style={styles.showText}>分享</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => {

                        }}>
                            <View style={{ alignItems: 'center', flex: 1 }}>
                                <Image style={styles.iconImg} source={require('./res/icons/xy.png')}/>
                                <Text style={styles.showText}>学院</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => {

                        }}>
                            <View style={{ alignItems: 'center', flex: 1 }}>
                                <Image style={styles.iconImg} source={require('./res/icons/cx.png')}/>
                                <Text style={styles.showText}>促销</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>

                    <View style={styles.box}>
                        <View style={styles.featureBox}>
                            <View style={[styles.featureBox1]}>
                                <Text>1</Text>
                            </View>
                            <View style={[styles.featureBox2]}>
                                <Text>2</Text>
                            </View>
                            <View style={[styles.featureBox3]}>
                                <Text>3</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.demoBox}>
                        {
                            DemoList.map(item => {
                                const { title, uri, params } = item;
                                return (
                                    <View key={title} style={styles.rowCell}>
                                        <TouchableHighlight
                                            style={{ flex: 1 }}
                                            underlayColor="#e6e6e6"
                                            onPress={() => {
                                                this.redirect(uri, params);
                                            }}
                                        >
                                            <View style={styles.eventRowsContainer}>
                                                <Text style={{ color: '#474747' }}>{title}</Text>
                                            </View>
                                        </TouchableHighlight>
                                    </View>
                                );
                            })
                        }
                    </View>
                </ScrollView>
            </View>

        );
    }

    renderViewPageItem = (item) => {
        return (
            <UIImage
                source={{ uri: item }}
                style={{ height: 220, width: ScreenUtils.width }}
                onPress={() => {

                }}
                resizeMode="cover"
            />);
    };
    redirect = (uri, params) => {
        this.props.navigation.navigate(uri, params || {});
    };

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
    },
    box: {
        backgroundColor: '#ffffff',
        marginBottom: 10,
    },
    rowBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 200,
    },
    imgBox: {},
    colBox: {
        height: 180,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },

    // header
    navbar: {
        flexDirection: 'row',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: Platform.OS === 'ios' ? 20 : 0,   // 处理iOS状态栏
        height: Platform.OS === 'ios' ? 68 : 48,   // 处理iOS状态栏
        backgroundColor: '#d51243',
        alignItems: 'center'
    },
    logo: {
        height: 38,
        width: 52,
        resizeMode: 'stretch'  // 设置拉伸模式
    },
    searchBox: {
        height: 30,
        flexDirection: 'row',
        flex: 1,  // 类似于android中的layout_weight,设置为1即自动拉伸填充
        borderRadius: 15,  // 设置圆角边
        backgroundColor: 'white',
        alignItems: 'center',
        marginLeft: 8,
        marginRight: 12
    },
    scanIcon: {
        height: 26.7,
        width: 26.7,
        resizeMode: 'stretch'
    },
    searchIcon: {
        marginLeft: 6,
        marginRight: 6,
        width: 16.7,
        height: 16.7,
        resizeMode: 'stretch'
    },
    voiceIcon: {
        marginLeft: 5,
        marginRight: 8,
        width: 15,
        height: 20,
        resizeMode: 'stretch'
    },
    inputText: {
        flex: 1,
        backgroundColor: 'transparent',
        fontSize: 14
    },

    // banner
    banner: {},

    // menu
    menuView: {
        flexDirection: 'row',
        paddingTop: 10,
        backgroundColor: '#ffffff',
        paddingBottom: 10,
        marginBottom: 10,
    },
    iconImg: {
        width: 45,
        height: 45,
        marginBottom: 5
    },
    showText: {
        fontSize: 12
    },

    // demoBox
    demoBox: {
        backgroundColor: '#ffffff',
    },
    featureBox: {
        position: 'relative',
        height: ScreenUtils.px2dp(200),
        marginLeft:ScreenUtils.px2dp(15),
        marginRight:ScreenUtils.px2dp(15),
    },
    featureBox1: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: ScreenUtils.px2dp(185),
        height: ScreenUtils.px2dp(200),
        backgroundColor: 'red',
        borderRadius:5,
    },
    featureBox2: {
        position: 'absolute',
        right: 0,
        top: 0,
        width: ScreenUtils.px2dp(153),
        height: ScreenUtils.px2dp(96),
        backgroundColor: '#888888',
        borderRadius:5,
    },
    featureBox3: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: ScreenUtils.px2dp(153),
        height: ScreenUtils.px2dp(96),
        backgroundColor: '#888888',
        borderRadius:5,
    },

    // 行样式
    rowCell: {
        paddingLeft: 10,
        minHeight: 50,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        justifyContent: 'space-between',
        borderBottomColor: '#dedede'
    }
});
