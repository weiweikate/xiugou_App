/**
 * 超值热卖
 */

import React, {Component} from 'react'
import {View , ScrollView, StyleSheet, Text, Image, TouchableOpacity} from 'react-native'
import ScreenUtil from '../../utils/ScreenUtils'
const { px2dp, onePixel } = ScreenUtil
import {observer} from 'mobx-react'
import { subjectModule } from './Modules'
import goodsImg from './res/goods.png'

const GoodItems = ({img, title, money}) => <View style={styles.goodsView}>
    <Image style={styles.goodImg} source={img}/>
    <Text style={styles.goodsTitle} numberOfLines={2}>{title}</Text>
    <Text style={styles.money}>¥ {money}</Text>
</View>

const MoreItem = () => <View style={styles.moreView}>
    <View style={styles.backView}>
        <Text style={styles.seeMore}>查看更多</Text>
        <View style={styles.line}/>
        <Text style={styles.seeMoreEn}>View More</Text>
    </View>
</View>

const goods = [
    {title: '是离开的肌肤收到了空间飞来峰', img: goodsImg,  money: '232.00' },
    {title: '是离开的肌肤收到了空间飞来峰', img: goodsImg,  money: '232.00' },
    {title: '是离开的肌肤收到了空间飞来峰', img: goodsImg,  money: '232.00' },
    {title: '是离开的肌肤收到了空间飞来峰', img: goodsImg,  money: '232.00' },
    {title: '是离开的肌肤收到了空间飞来峰', img: goodsImg,  money: '232.00' },
    {title: '是离开的肌肤收到了空间飞来峰', img: goodsImg,  money: '232.00' }
]

const AcitivyItem = ({data, press}) => {
    const {imgUrl} = data
    let goodsItem = []
    goods.map((value,index) => {
        goodsItem.push(<GoodItems key={index} title={value.title} money={value.money} img={value.img}/>)
    })
    return <View>
        <TouchableOpacity style={styles.bannerBox} onPress={()=>{press && press()}}>
            <View style={styles.bannerView}>
                <Image style={styles.banner} source={{url: imgUrl}}/>
            </View>
        </TouchableOpacity>
        <ScrollView style={styles.scroll} horizontal={true} showsHorizontalScrollIndicator={false}>
            {goodsItem}
            <MoreItem/>
            <View style={styles.space}/>
        </ScrollView>
    </View>
}

@observer
export default class HomeSubjectView extends Component {
    constructor(props) {
        super(props)
        subjectModule.loadSubjectList()
    }
    _subjectActions(item) {
        console.log('_subjectActions', item)
        subjectModule.selectedSubjectAction(item)
        const { navigation } = this.props
        navigation.navigate('topic/DownPricePage')
    }
    render() {
        const { subjectList } = subjectModule
        let items = []
        subjectList.map((item, index) => {
            items.push(<AcitivyItem data={item} key={index} press={()=>this._subjectActions(item)}/>)
        })
        return <View style={styles.container}>
            <View style={styles.titleView}>
                <Text style={styles.title}>超值热卖</Text>
            </View>
            {items}
        </View>
    }
}

let styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        marginTop: px2dp(10)
    },
    space: {
        width: px2dp(15)
    },
    titleView: {
        height: px2dp(53),
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        color: '#333',
        fontSize: px2dp(19),
        fontWeight: '600'
    },
    bannerBox: {
        height: px2dp(181),
        alignItems: 'center',
        justifyContent: 'center'
    },
    bannerView: {
        width: px2dp(345),
        height: px2dp(181),
        borderRadius: px2dp(5),
        overflow: 'hidden'
    },
    banner: {
        width: px2dp(345),
        height: px2dp(181),
    },
    scroll: {
        height: px2dp(170),
        marginLeft: px2dp(17),
        marginTop: px2dp(5),
        marginBottom: px2dp(20)
    },
    goodsView: {
        width: px2dp(100),
        height: px2dp(170)
    },
    goodImg: {
        width: px2dp(100),
        height: px2dp(100)
    },
    goodsTitle: {
        color: '#666',
        fontSize: px2dp(12),
        marginTop: px2dp(8)
    },
    money: {
        color: '#D51234',
        fontSize: px2dp(14),
        marginTop: px2dp(8)
    },
    moreView: {
        width: px2dp(100),
        height: px2dp(170),
        alignItems: 'center',
        justifyContent: 'center'
    },
    backView: {
        backgroundColor: '#F7F7F7',
        width: px2dp(75),
        height: px2dp(75),
        borderRadius: px2dp(75) / 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    seeMore: {
        color: '#666',
        fontSize: px2dp(11)
    },
    seeMoreEn: {
        color: '#666',
        fontSize: px2dp(9)
    },
    line: {
        height: onePixel,
        width: px2dp(43),
        backgroundColor: '#e3e3e3',
        margin: px2dp(2.5)
    }
})