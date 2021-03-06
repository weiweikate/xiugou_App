import React, { Component } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import ScreenUtils from '../../utils/ScreenUtils';
import EmptyUtils from '../../utils/EmptyUtils';
import { track, trackEvent } from '../../utils/SensorsTrack';
const { px2dp } = ScreenUtils;
import { homeModule } from './Modules';
import DesignRule from '../../constants/DesignRule';
import ImageLoader from '@mr/image-placeholder';
import { MRText as Text } from '../../components/ui';
import StringUtils from '../../utils/StringUtils';
import { homePoint } from './HomeTypes';

export const kHomeGoodsViewHeight = px2dp(246);
const goodsWidth = (ScreenUtils.width - px2dp(35)) / 2;

const MoneyItems = ({ money }) => {
    if (EmptyUtils.isEmpty(money)) {
        return <View/>;
    }
    let unitStr = '¥';
    let moneyStr = money;

    return <Text style={styles.unit}>{unitStr}<Text style={styles.money}>{moneyStr}</Text> 起</Text>;
};

const Goods = ({ goods, press }) => <TouchableWithoutFeedback onPress={() => press && press()}>
    <View style={styles.container}>
        <View style={styles.image}>
            <ReuserImage style={styles.image} source={{ uri: goods.imgUrl ? goods.imgUrl : '' }}/>
            {
                StringUtils.isEmpty(goods.title)
                    ?
                    null
                    :
                    <View style={styles.titleView}>
                        <Text style={styles.title} numberOfLines={1} allowFontScaling={false}>{goods.title}</Text>
                    </View>
            }
        </View>
        <Text style={styles.dis} numberOfLines={2} allowFontScaling={false}>{goods.name}</Text>
        <View style={{ flex: 1 }}/>
        <MoneyItems money={goods.price}/>
    </View>
</TouchableWithoutFeedback>;

export default class GoodsCell extends Component {
    _goodsAction(data) {
        track(trackEvent.bannerClick, homeModule.bannerPoint(data, homePoint.homeForyou))
        let route = homeModule.homeNavigate(data.linkType, data.linkTypeCode);
        const { navigate } = this.props;
        let params = homeModule.paramsNavigate(data);
        navigate(route, params);
    }

    render() {
        const { data } = this.props;
        if (!data || data.length === 0) {
            return null;
        }
        return <View style={styles.cell}>
            {
                data[0]
                    ?
                    <Goods goods={data[0]} press={() => this._goodsAction(data[0])}/>
                    :
                    null
            }
            <View style={styles.space}/>
            {
                data[1]
                    ?
                    <Goods goods={data[1]} press={() => this._goodsAction(data[1])}/>
                    :
                    <View style={styles.uncontainer}/>
            }
        </View>;
    }
}

class ReuserImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imagePath: this.props.source.uri
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.source && nextProps.source &&
            this.props.source.uri !== nextProps.source.uri
        ) {
            this.fetchImage(nextProps.source.uri);
        }
    }

    fetchImage(url) {
        this.setState({
            imagePath: ''
        }, () => {
            this.setState({
                imagePath: url
            });
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.state.imagePath !== nextState.imagePath;
    }

    render() {
        return <ImageLoader
            {...this.props}
            source={{ uri: this.state.imagePath }}
            showPlaceholder={false}
        />;
    }
}

let styles = StyleSheet.create({
    container: {
        height: px2dp(240),
        width: goodsWidth,
        backgroundColor: 'white',
        borderRadius: px2dp(5),
        overflow: 'hidden'
    },
    uncontainer: {
        height: px2dp(240),
        width: goodsWidth
    },
    image: {
        height: goodsWidth,
        width: goodsWidth
    },
    titleView: {
        height: px2dp(25),
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        position: 'absolute',
        left: 0,
        bottom: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    dis: {
        color: DesignRule.textColor_mainTitle,
        fontSize: px2dp(12),
        marginTop: px2dp(10),
        marginLeft: px2dp(7),
        marginRight: px2dp(7)
    },
    title: {
        color: '#fff',
        fontSize: px2dp(12),
        marginLeft: px2dp(5),
        marginRight: px2dp(5)
    },
    cell: {
        width: ScreenUtils.width,
        height: kHomeGoodsViewHeight,
        flexDirection: 'row',
        paddingRight: px2dp(15),
        paddingLeft: px2dp(15),
        alignItems: 'center',
        justifyContent: 'center'
    },
    space: {
        width: px2dp(5)
    },
    unit: {
        color: DesignRule.mainColor,
        marginBottom: px2dp(5),
        marginLeft: px2dp(7)
    },
    money: {
        fontSize: px2dp(16),
        fontWeight: '600'
    }
});
