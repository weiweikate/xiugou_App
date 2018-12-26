/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JuRe Group Holding Ltd. All Rights Reserved
 *
 * @flow
 *
 * Created by xzm on 2018/12/25.
 *
 */


'use strict';
import React from 'react';
import {
    StyleSheet,
    View
} from 'react-native';
import BasePage from '../../../../BasePage';
import { MRText as Text } from '../../../../components/ui';
// import RefreshFlatList from '../../../../comm/components/RefreshFlatList';
import ScreenUtils from '../../../../utils/ScreenUtils';
import DesignRule from '../../../../constants/DesignRule';
import ImageLoad from '@mr/image-placeholder'

type Props = {};
export default class MyShowFansPage extends BasePage<Props> {
    constructor(props) {
        super(props);
        this.state = {};
    }

    $navigationBarOptions = {
        title: '我的秀迷',
        show: true// false则隐藏导航
    };


    componentDidMount() {
        this.loadPageData();
    }

    loadPageData() {
    }

    _listItemRender = () => {
        let noActivate = (
            <View style={[styles.typeWrapper,{ borderColor: DesignRule.mainColor,borderWidth:1, backgroundColor: '#fcf5f9'}]}>
                <Text style={styles.activateTextStyle}>
                    未激活
                </Text>
            </View>
        )
        // let activate = (
        //     <View style={[styles.typeWrapper,{ borderColor: '#e0e1e0', borderWidth:1,backgroundColor: '#f1f1f1'}]}>
        //         <Text style={styles.noActivateTextStyle}>
        //             已激活
        //         </Text>
        //     </View>
        // )

        return(
            <View style={styles.itemWrapper}>
                <ImageLoad style={styles.fansIcon} cacheable={true} source={{uri: ''}}/>
                <Text style={styles.fansNameStyle}>
                    anglebaby
                </Text>
                {noActivate}
            </View>
        )
    };

    _render() {
        return (
            <View style={styles.container}>
                <Text style={styles.headerTextWrapper}>
                    激活人数：<Text style={{color:DesignRule.textColor_mainTitle_222,fontSize:18}}>12</Text>/<Text>12</Text>
                </Text>

                {this._listItemRender()}
                {/*<RefreshFlatList*/}
                {/*style={styles.container}*/}
                {/*url={orderApi.afterSaleList}*/}
                {/*renderItem={this.renderItem}*/}
                {/*params={params}*/}
                {/*totalPageNum={(result)=> {return result.data.isMore ? 10 : 0}}*/}
                {/*handleRequestResult={(result)=>{return result.data.list}}*/}
                {/*// ref={(ref) => {this.list = ref}}*/}
                {/*/>*/}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    itemWrapper: {
        height: 66,
        width: ScreenUtils.width - DesignRule.margin_page * 2,
        flexDirection: 'row',
        backgroundColor: DesignRule.white,
        alignItems: 'center',
        paddingHorizontal:DesignRule.margin_page,
        marginTop:DesignRule.margin_listGroup,
        alignSelf:'center',
        borderRadius:8,
        elevation:3
    },
    fansIcon: {
        height: 40,
        width: 40,
        borderRadius:20
    },
    fansNameStyle:{
        color:DesignRule.textColor_mainTitle_222,
        fontSize:DesignRule.fontSize_mainTitle,
        flex:1,
        marginLeft:8
    },
    typeWrapper:{
        width:55,
        height:20,
        borderRadius:10,
        justifyContent:'center',
        alignItems:'center',
    },
    noActivateTextStyle:{
        fontSize:DesignRule.fontSize_20,
        color:DesignRule.textColor_secondTitle
    },
    activateTextStyle:{
        fontSize:DesignRule.fontSize_20,
        color:DesignRule.mainColor
    },
    headerTextWrapper:{
        marginLeft:DesignRule.margin_page,
        marginTop:12
    }

});