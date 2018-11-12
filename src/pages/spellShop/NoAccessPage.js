import React, { Component } from 'react';
import {
    View, ScrollView,
    Image,
    RefreshControl, ImageBackground
} from 'react-native';
import SpellStatusModel from './model/SpellStatusModel';
import ScreenUtils from '../../utils/ScreenUtils';
import NavigatorBar from '../../components/pageDecorator/NavigatorBar/NavigatorBar';
import pindianzhaojilingbgd from './src/pindianzhaojilingbgd.png';
import pindianzhaojiling from './src/pindianzhaojiling.png';
import DesignRule from 'DesignRule';

export default class NoAccessPage extends Component {
    render() {
        const imgWidth = ScreenUtils.width;
        const imgHeight = ScreenUtils.height - ScreenUtils.headerHeight - (this.props.leftNavItemHidden ? ScreenUtils.tabBarHeight : 0);
        return (
            <View style={{ flex: 1 }}>
                <NavigatorBar leftNavItemHidden={this.props.leftNavItemHidden}
                              leftPressed={() => {
                                  this.props.navigation.goBack();
                              }}
                              title={'拼店'}/>
                <ScrollView showsVerticalScrollIndicator={false}
                            refreshControl={<RefreshControl title="下拉刷新"
                                                            tintColor={DesignRule.textColor_instruction}
                                                            titleColor={DesignRule.textColor_instruction}
                                                            refreshing={SpellStatusModel.refreshing}
                                                            onRefresh={() => {
                                                                SpellStatusModel.getUser(1);
                                                            }}/>}>
                    <View style={{ flex: 1 }}>
                        <ImageBackground style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: imgWidth,
                            height: imgHeight
                        }} source={pindianzhaojilingbgd}>
                            <Image style={{
                                width: ScreenUtils.autoSizeWidth(imgWidth),
                                height: ScreenUtils.autoSizeWidth(imgHeight)
                            }} source={pindianzhaojiling} resizeMode='stretch'/>
                        </ImageBackground>
                    </View>
                </ScrollView>
            </View>
        );
    }
}
