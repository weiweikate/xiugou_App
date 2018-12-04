/*
* 首页查询
*/

import React from "react";
import { View, StyleSheet, Image, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import ScreenUtils from "../../utils/ScreenUtils";

const { px2dp, statusBarHeight } = ScreenUtils;
import UIText from "../../components/ui/UIText";
import DesignRule from "DesignRule";
import User from "../../model/user";
import res from "./res";

const logoRed = res.home_icon_logo_red;
const logoWhite = res.home_icon_logo_white;
const searchImg = res.icon_search;
const msgBlack = res.message_black;
const msgWhite = res.message_white;

export default ({ navigation, whiteIcon, hasMessage }) =>
    <View style={styles.navBar}>
        <View style={styles.navContent}>
            <Image source={whiteIcon ? logoWhite : logoRed} style={styles.logo}/>
            <TouchableOpacity style={[styles.searchBox, { backgroundColor: whiteIcon ? "white" : "#E4E5E6" }]}
                              onPress={() => {
                                  navigation("home/search/SearchPage");
                              }}>
                <Image source={searchImg} style={styles.searchIcon}/>
                <UIText style={styles.inputText} value={"请输入关键词搜索"}/>
            </TouchableOpacity>
            <TouchableWithoutFeedback onPress={() => {
                if (!User.isLogin) {
                    navigation("login/login/LoginPage");
                    return;
                }
                navigation("message/MessageCenterPage");
            }}>
                <View style={{ height: 32, width: 32, justifyContent: "center", alignItems: "center" }}>
                    <Image source={whiteIcon ? msgWhite : msgBlack} style={styles.msgIcon}/>
                    {hasMessage ? <View style={{
                        width: 10,
                        height: 10,
                        backgroundColor: DesignRule.mainColor,
                        position: "absolute",
                        top: 2,
                        right: 2,
                        borderRadius: 5
                    }}/> : null}
                </View>
            </TouchableWithoutFeedback>
        </View>
        {
            whiteIcon ? null :
                <View style={{ height: 0.5, backgroundColor: "#ccc" }}/>}
    </View>

let styles = StyleSheet.create({
    navBar: {
        flexDirection: "column",
        height: statusBarHeight + 44 - (ScreenUtils.isIOSX ? 10 : 0),
        position: "absolute",
        left: 0,
        right: 0,
        zIndex: 4
    },
    navContent: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "transparent",
        justifyContent: "center",
        paddingTop: statusBarHeight - (ScreenUtils.isIOSX ? 10 : 0),
        marginLeft: px2dp(15),
        marginRight: px2dp(11)
    },
    logo: {
        height: 22,
        width: 30
    },
    searchBox: {
        height: 30,
        flexDirection: "row",
        flex: 1,  // 类似于android中的layout_weight,设置为1即自动拉伸填充
        borderRadius: 15,  // 设置圆角边
        alignItems: "center",
        marginLeft: px2dp(10),
        marginRight: px2dp(6),
        opacity: 0.8
    },
    msgIcon: {
        height: 24,
        width: 24
    },
    searchIcon: {
        marginLeft: 10,
        marginRight: 10,
        width: 16,
        height: 16
    },
    inputText: {
        flex: 1,
        color: DesignRule.textColor_secondTitle,
        fontSize: 14
    }
});
