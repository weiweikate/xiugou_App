import React, {Component} from 'react'
import { View, Image, Text, StyleSheet } from 'react-native'
import ScreenUtils from '../../utils/ScreenUtils'
const { px2dp, onePixel } = ScreenUtils
import PropTypes from 'prop-types'

const Goods = ({goods}) => <View style={styles.container}>
    <View style={styles.image}>
        <Image style={styles.image} source={{uri: goods.imgUrl}}/>
        <View style={styles.titleView}>
            <Text style={styles.title}>{goods.title}</Text>
        </View>
    </View>
    <Text style={styles.dis}>{goods.discribe}</Text>
    <Text style={styles.money}>¥ {goods.money}</Text>
</View>

export default class GoodsCell extends Component {
    static propTypes = {
        data: PropTypes.array.isRequired
    }
    render() {
        const {data} = this.props
        return <View style={styles.cell}>
        {
            data[0]
            ?
            <Goods goods={data[0]}/>
            :
            null
        }
        <View style={styles.space}/>
        {
            data[1]
            ?
            <Goods goods={data[1]}/>
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
        marginTop: px2dp(20)
    },
    title: {
        color: '#666',
        fontSize: px2dp(12)
    },
    money: {
        color: '#D51234',
        fontSize: px2dp(14),
        marginTop: px2dp(10)
    },
    cell: {
        width: ScreenUtils.width,
        backgroundColor: '#fff',
        height: px2dp(273),
        flexDirection: 'row',
        justifyContent: 'center'
    },
    space: {
        width: px2dp(5)
    }
})