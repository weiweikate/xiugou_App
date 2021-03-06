import React, { Component } from 'react';
import {
    View,
    ImageBackground,
    TouchableOpacity,
    FlatList,
    Platform,
    Image
} from 'react-native';
import { track, trackEvent } from '../../../utils/SensorsTrack';
import { MRText as Text } from '../../../components/ui/index';

import ScreenUtils from '../../../utils/ScreenUtils';
import DesignRule from '../../../constants/DesignRule';
import res from '../res/product';
import Modal from '../../../comm/components/CommModal';

const {
    detailShowBg,
    message,
    detail_search,
    share,
    detail_kefu
} = res;

const bgHeight = ScreenUtils.autoSizeWidth(410 / 2.0);
const bgWidth = 286 / 2.0;

export default class DetailNavShowModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false, //是否显示
            confirmCallBack: null,
            messageCount: 0,
            hiddenShare: false
        };
    }

    show = (messageCount, confirmCallBack, hidden) => {
        this.setState({
            messageCount: messageCount,
            modalVisible: true,
            confirmCallBack: confirmCallBack,
            hiddenShare: hidden
        });
    };

    close = () => {
        this.setState({
            modalVisible: false
        });
    };

    _onPress = (item) => {
        /*点击客服埋点*/
        if (item.index === 3) {
            track(trackEvent.contact, { origin: '在线', questionType: '商品详情' });
        }
        this.setState({
            modalVisible: false
        });
        this.state.confirmCallBack && this.state.confirmCallBack(item);
    };

    _separator = () => {
        return <View
            style={{ height: 0.5, marginLeft: 6, marginRight: 6, backgroundColor: DesignRule.lineColor_inWhiteBg }}/>;
    };

    getImgArr = () => {
        let imgArr;
        if (this.state.hiddenShare) {
            imgArr = [
                { img: message, tittle: '消息', index: 0 },
                { img: detail_search, tittle: '搜索', index: 1 },
                { img: detail_kefu, tittle: '客服', index: 3 }
            ];
        } else {
            imgArr = [
                { img: message, tittle: '消息', index: 0 },
                { img: detail_search, tittle: '搜索', index: 1 },
                { img: share, tittle: '分享', index: 2 },
                { img: detail_kefu, tittle: '客服', index: 3 }
            ];
        }
        return imgArr;
    };

    _renderItem = ({ item }) => {
        return <TouchableOpacity
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                height: (bgHeight - 20) / this.getImgArr().length,
                marginTop: item.index === 0 ? 16 : 0
            }}
            onPress={() => this._onPress(item)}>
            <Image source={item.img} style={{ marginLeft: 23 }}/>
            <Text style={{ color: DesignRule.textColor_mainTitle, fontSize: 15, marginLeft: 15 }}
                  allowFontScaling={false}>{item.tittle}</Text>
            {item.index === 0 && this.state.messageCount > 0 ? <View style={{
                position: 'absolute', justifyContent: 'center', alignItems: 'center',
                top: ScreenUtils.autoSizeWidth(9),
                left: 23 + 12,
                backgroundColor: DesignRule.mainColor,
                borderRadius: 8, width: 16, height: 16
            }}>
                <Text style={{
                    color: DesignRule.white,
                    fontSize: 9
                }} allowFontScaling={false}>{this.state.messageCount > 99 ? 99 : this.state.messageCount}</Text>
            </View> : null}
        </TouchableOpacity>;
    };

    render() {
        return (
            <Modal onRequestClose={this.close}
                   visible={this.state.modalVisible}
                   transparent={true}>
                <TouchableOpacity style={{
                    flex: 1,
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute'
                }} onPress={() => {
                    this.setState({
                        modalVisible: false
                    });
                }} activeOpacity={1}>
                    <ImageBackground
                        resizeMode={'stretch'}
                        style={{
                            top: Platform.OS === 'ios' ? ScreenUtils.headerHeight : 44 + ScreenUtils.statusBarHeight,
                            right: 12,
                            position: 'absolute', width: bgWidth, height: bgHeight
                        }}
                        source={detailShowBg}>
                        <FlatList data={this.getImgArr()}
                                  keyExtractor={(item, index) => `${index}`}
                                  renderItem={this._renderItem}
                                  ItemSeparatorComponent={this._separator}
                                  showsVerticalScrollIndicator={false}
                        />

                    </ImageBackground>
                </TouchableOpacity>
            </Modal>
        );
    }
}

