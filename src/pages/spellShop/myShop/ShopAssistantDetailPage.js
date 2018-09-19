//店员详情页面
import React from 'react';
import {
    View,
    Text,
    Image,
    Dimensions,
    StyleSheet,
    ScrollView,
    RefreshControl,
    ImageBackground
} from 'react-native';
//Source
const SCREEN_WIDTH = Dimensions.get('window').width;
import HeaderBarBgImg from './res/txbg_02.png';
import RingImg from './res/headBg.png';
import RmbIcon from './res/zje_11.png';
import ZuanIcon from './res/cs_12.png';
import MoneyIcon from './res/fhje_14.png';
import QbIcon from './res/dzfhj_03-03.png';
//icon
import NameIcon from './res/icon_03.png';
import StarIcon from './res/icon_03-02.png';
import CodeIcon from './res/icon_03-03.png';
import PhoneIcon from './res/icon_03-04.png';
import BasePage from '../../../BasePage';


export default class ShopAssistantDetailPage extends BasePage {

    $navigationBarOptions = {
        title: '店员详情'
    };
    state = {
        refreshing: false,
        userInfo: {},
        loading: true,
        netFailedInfo: null
    };

    loadPageData() {
        // const {id} = this.params || {};
        // SpellShopApi.getMemberDetail({id}).then((response)=>{
        //     if(response.ok){
        //         this.setState({
        //             refreshing: false,
        //             userInfo: response.data,
        //             loading: false,
        //             netFailedInfo: null,
        //         });
        //     } else {
        //         this.setState({
        //             refreshing: false,
        //             userInfo: null,
        //             loading: false,
        //             netFailedInfo: response,
        //         });
        //     }
        // })
    }

    _imgLoadFail = (url, error) => {
        console.warn(url + '\n' + error);
    };


    _formatDate = (auzBeginTime) => {
        //auzBeginTime
        if (auzBeginTime) {
            const date = new Date(auzBeginTime);
            const y = date.getFullYear();
            let m = date.getMonth() + 1;
            m = m < 10 ? ('0' + m) : m;
            let d = date.getDate();
            d = d < 10 ? ('0' + d) : d;
            return y + '年' + m + '月' + d + '日';
        } else {
            return '';
        }
    };

    _onRefresh = () => {
        this.setState({ refreshing: true }, this.loadPageData);
    };

    _renderDescRow = (icon, title, style = { marginBottom: 15 }) => {
        return <View style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>
            <Image source={icon}/>
            <Text style={styles.rowTitle}>{title}</Text>
        </View>;
    };

    renderContent = () => {
        // if(!this.state.userInfo)return null;
        const { userInfo } = this.state;
        const storeBonusDto = userInfo.storeBonusDto || {};
        const headerWidth = 65 / 375 * SCREEN_WIDTH;

        return (<ScrollView style={{ flex: 1 }}
                            refreshControl={<RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this._onRefresh}
                            />}>
            <ImageBackground source={HeaderBarBgImg} style={styles.imgBg}>
                <ImageBackground source={RingImg}
                                 style={styles.headerBg}>
                    {
                        userInfo.headImg ?
                            <Image style={{ width: headerWidth, height: headerWidth, borderRadius: headerWidth / 2 }}
                                   onError={({ nativeEvent: { error } }) => this._imgLoadFail(userInfo.headImg, error)}
                                   source={{ uri: userInfo.headImg }}/> : null
                    }
                </ImageBackground>
                <View style={styles.shopInContainer}>
                    {this._renderDescRow(NameIcon, `名称：${userInfo.nickname || ''}`)}
                    {this._renderDescRow(StarIcon, `级别：${userInfo.levelName || ''}`)}
                    {this._renderDescRow(CodeIcon, `授权号：${userInfo.code || ''}`)}
                    {this._renderDescRow(PhoneIcon, `手机号：${userInfo.phone || ''}`, null)}
                </View>
            </ImageBackground>

            {this._renderRow(RmbIcon, '加入店铺时间', this._formatDate(userInfo.addStoreTime))}
            {this.renderSepLine()}
            {this._renderRow(ZuanIcon, '参与店铺分红次数', `${storeBonusDto.dealerTotalBonusCount || 0}次`)}
            {this.renderSepLine()}
            {this._renderRow(MoneyIcon, '共获得分红总额', `${storeBonusDto.dealerTotalBonus || 0}元`)}
            {this.renderSepLine()}
            {this._renderRow(QbIcon, '总体贡献度', this._totalContribution(storeBonusDto))}
            {this.renderSepLine()}
            {this._renderRow(MoneyIcon, '本次贡献值', this._currContribution(storeBonusDto))}
        </ScrollView>);
    };

    // 本次贡献度
    _currContribution = (storeBonusDto) => {
        const dealerThisTimeBonus = storeBonusDto.dealerThisTimeBonus || 0;
        const storeThisTimeBonus = storeBonusDto.storeThisTimeBonus || 0;
        if (!storeThisTimeBonus) {
            return '0%';
        }
        return (dealerThisTimeBonus / storeThisTimeBonus * 100).toFixed(2);
    };

    // 总体贡献度
    _totalContribution = (storeBonusDto) => {
        const dealerTotalBonus = storeBonusDto.dealerTotalBonus || 0;
        const dealerThisTimeBonus = storeBonusDto.dealerThisTimeBonus || 0;

        const storeThisTimeBonus = storeBonusDto.storeThisTimeBonus || 0;
        const storeTotalBonus = storeBonusDto.storeTotalBonus || 0;

        if (!(storeThisTimeBonus + storeTotalBonus)) {
            return '0%';
        }
        return ((dealerTotalBonus + dealerThisTimeBonus) / (storeThisTimeBonus + storeTotalBonus) * 100).toFixed(2);
    };

    _clickReloadBtn = () => {
        this.setState({ loading: true, netFailedInfo: null }, this.loadPageData);
    };

    renderII = () => {
        // if(this.state.loading){
        //     return <LoadingView />;
        // } else if(this.state.netFailedInfo){
        //     return (<NetFailedView netFailedInfo={this.state.netFailedInfo} clickReloadBtn={this._clickReloadBtn}/>);
        // } else {
        return this.renderContent();
        // }
    };

    _render() {
        return (
            <View style={styles.container}>
                {this.renderII()}
            </View>
        );
    }

    _renderRow = (icon, title, desc) => {
        return (<View style={styles.row}>
            <Image style={styles.icon} source={icon}/>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.desc}>{desc}</Text>
        </View>);
    };

    renderSepLine = () => {
        return (<View style={styles.line}/>);
    };

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    imgBg: {
        width: SCREEN_WIDTH,
        height: 182 / 375 * SCREEN_WIDTH,
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerBg: {
        marginLeft: 16,
        marginRight: 23,
        width: 105 / 375 * SCREEN_WIDTH,
        height: 105 / 375 * SCREEN_WIDTH,
        justifyContent: 'center',
        alignItems: 'center'
    },
    shopInContainer: {
        height: 105 / 375 * SCREEN_WIDTH,
        justifyContent: 'center'
    },
    rowTitle: {
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 13,
        color: '#ffffff',
        marginLeft: 5
    },
    line: {
        height: StyleSheet.hairlineWidth,
        borderColor: '#fdfcfc'
    },
    row: {
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    icon: {
        marginLeft: 25
    },
    title: {
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 13,
        color: '#222222',
        marginLeft: 4
    },
    desc: {
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 12,
        color: '#666666',
        flex: 1,
        textAlign: 'right',
        marginRight: 21
    }
});
