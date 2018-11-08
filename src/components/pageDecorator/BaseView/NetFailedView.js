/**
 * 网络错误控件
 *
 * a.后台接口或http网络层级的错误，此时netFailedInfo 为网络库的返回值
 * b.业务代码catch到的错误  此时netFailedInfo 为try-catch中的error
 *
 * //最简使用示例：
 * <NetFailedView reloadBtnClick={点击重新加载的回调函数} netFailedInfo={'出错的信息'}/>
 *
 * //高度自定义示例：
 * <NetFailedView
 *      style={'这里是style，可以自定义'}
 *      imageStyle={'这里自定义图片的样式'}
 *      source={'自定义图片资源'}
 *      showReloadBtn={'是否展示重新加载按钮'}
 *      netFailedInfo={'出错的信息'}
 *      reloadBtnClick={() => {console.warn('在这里做点击回调，回调包括后面的参数都是可省的，不传使用默认');}}
 *      buttonText={'这是按钮上的文字'}
 * />
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text,
    Image,
    Keyboard,
    Platform,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';
import NetNotConnectImage from './source/net_error.png'; //用于断网，超时展示
import ServerErrorImage from './source/server_error.png'; //用于其他网络请求展示
const BugErrorCode = -20000;       //异常错误，请稍后再试 js bug error
const NetUnKnowErrorCode = -20001; //未知错误,请稍后再试 (网络错误，但是没有错误码)

export default class NetFailedView extends Component {

    static propTypes = {
        netFailedInfo: PropTypes.object.isRequired,         // 错误，来自网络的错误    或者 标准error
        reloadBtnClick: PropTypes.func.isRequired,          // 点击重新加载的回调函数
        showReloadBtn: PropTypes.bool,// 是否展示重新加载按钮
        buttonText: PropTypes.string,   // 重新加载按钮title
        //图片以及样式
        style: PropTypes.any,           // 样式
        source: PropTypes.any,          // 图片素材
        imageStyle: PropTypes.any,      // 图片样式
    };

    // 默认属性
    static defaultProps = {
        buttonText: '重新加载', // 重新加载按钮title
        showReloadBtn: true,
    };

    // 解析失败原因
    _getErrorInfo = () => {
        const netFailedInfo = this.props.netFailedInfo || {};
        if (netFailedInfo instanceof Error) {
            return {
                code: BugErrorCode,
                msg: '异常错误，请稍后再试',
            };
        } else {
            return {
                code: netFailedInfo.code || NetUnKnowErrorCode,
                msg: netFailedInfo.msg || '未知错误,请稍后再试',
            };
        }
    };


    // 获取需要展示的图片资源,如果是网络问题，展示断网图片，否则返回外部设置的，或者默认的错误图片
    _getImgSource = (source, code) => {
        if (Platform.OS === 'ios') {
            // ios -1001 连接超时 -1005 tcp断开 -1009 网络无连接
            return (code === BugErrorCode || code === -1001 || code === -1005 || code === -1009) ? NetNotConnectImage : (source || ServerErrorImage);
        } else {
            // android 1006 连接超时 1007 网络无连接
            return (code === BugErrorCode || code === 1006 || code === 1007) ? NetNotConnectImage : (source || ServerErrorImage);
        }
    };


    ///渲染按钮
    _renderReloadButton = (buttonText) => {
        ///按钮样式
        const btnStyle = [styles.btn];
        ///按钮文字样式
        const btnTextStyle = [styles.btnText];
        return (<TouchableOpacity activeOpacity={0.5} style={btnStyle} onPress={this.props.reloadBtnClick}>
            <Text style={btnTextStyle}>
                {buttonText}
            </Text>
        </TouchableOpacity>);
    };

    render() {
        const {
            style,
            source,
            imageStyle,
            buttonText,
            showReloadBtn
        } = this.props;
        const imgS = [styles.img, imageStyle];

        const {
            code,
            msg
        } = this._getErrorInfo();

        return (<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={[styles.container, style]}>

                <Image source={this._getImgSource(source, code)} style={imgS}/>

                <Text style={styles.titleStyle}>
                    {BugErrorCode === code ? '' : `（${code}）`}{msg}
                </Text>

                {showReloadBtn ? this._renderReloadButton(buttonText) : null}

            </View>
        </TouchableWithoutFeedback>);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#f6f6f6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    img: {
        // marginTop: 116,
    },
    titleStyle: {
        fontSize: 15,
        color: '#999',
        marginTop: 28,
    },
    btn: {
        width: 150,
        height: 44,
        borderRadius: 5,
        marginTop: 27,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: "#e60012",
        backgroundColor: 'transparent',
    },
    btnText: {
        fontSize: 16,
        color: '#e60012',
        textAlign: 'center',
    },
});
