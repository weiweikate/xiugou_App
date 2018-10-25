import React, {Component} from 'react'
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native'
import ScreenUtils from '../../utils/ScreenUtils'
const { px2dp, onePixel } = ScreenUtils
import { homeModule } from './Modules'

const Goods = ({goods, press}) => <TouchableOpacity style={styles.container} onPress={()=> press && press()}>
    <View style={styles.image}>
        <Image style={styles.image} source={{uri: goods.imgUrl}}/>
        <View style={styles.titleView}>
            <Text style={styles.title} numberOfLines={1}>{goods.title}</Text>
        </View>
    </View>
    <Text style={styles.dis}  numberOfLines={2}>{goods.name}</Text>
    <Text style={styles.money}>¥ {goods.price}</Text>
</TouchableOpacity>

export default class GoodsCell extends Component {
    _goodsAction(data) {
        let route = homeModule.homeNavigate(data.linkType, data.linkTypeCode)
        const { navigation } = this.props
        let params = homeModule.paramsNavigate(data)
        navigation.navigate(route,  params)
    }
    render() {
        const {data} = this.props
        if (!data) {
            return <View/>
        }
        return <View style={styles.cell}>
        {
            data[0]
            ?
            <Goods goods={data[0]} press={()=> this._goodsAction(data[0])}/>
            :
            null
        }
        <View style={styles.space}/>
        {
            data[1]
            ?
            <Goods goods={data[1]} press={()=> this._goodsAction(data[1])}/>
            :
            null
        }
        </View>
    }
}

let styles = StyleSheet.create({
    container: {
        height: px2dp(267),
        width: px2dp(172),
        backgroundColor: '#fff',
        borderRadius: px2dp(5),
        borderColor: '#EDEDED',
        borderWidth: onePixel,
        overflow: 'hidden'
    },
    image: {
        height: px2dp(172),
        width: px2dp(172)
    },
    titleView: {
        height: px2dp(25),
        backgroundColor: '#F0F0F0',
        opacity: 0.75,
        position: 'absolute',
        left: 0,
        bottom: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    dis: {
        color: '#666',
        fontSize: px2dp(12),
        marginTop: px2dp(20),
        marginLeft: px2dp(7),
        marginRight: px2dp(7)
    },
    title: {
        color: '#666',
        fontSize: px2dp(12)
    },
    money: {
        color: '#D51234',
        fontSize: px2dp(14),
        marginTop: px2dp(10),
        marginLeft: px2dp(7)
    },
    cell: {
        backgroundColor: '#fff',
        height: px2dp(273),
        flexDirection: 'row',
        marginRight: px2dp(15),
        marginLeft: px2dp(15)
    },
    space: {
        width: px2dp(5)
    }
})
