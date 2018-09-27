import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text,
    Image,
    Modal,
    TextInput,
    Animated,
    StyleSheet,
    Dimensions,
    TouchableOpacity
} from 'react-native';

const MIN_SCREEN = Math.min(Dimensions.get('window').width, Dimensions.get('window').height);
const MAX_SCREEN = Math.max(Dimensions.get('window').width, Dimensions.get('window').height);
const PANNELHEIGHT = 340;
const Animated_Duration = 300; //默认的动画持续时间
import KeFuIcon from '../src/jbtk_03.png';

export default class ReportAlert extends Component {

    static propTypes = {
        confirmCallBack: PropTypes.func //点击确定的回调函数
    };

    static defaultProps = {
        confirmCallBack: () => {
            console.warn('DelAnnouncementAlert miss confirmCallBack func');
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            text: '',
            height: PANNELHEIGHT,
            title: props.title,
            confirmCallBack: props.confirmCallBack,
            //私有state
            modalVisible: false, //是否显示
            top: new Animated.Value(-PANNELHEIGHT), //白色面板顶部距离屏幕底部
            backOpacity: new Animated.Value(0) //背景颜色
        };
    }

    show = ({ confirmCallBack, title, height }) => {
        this.setState({
            height: height || PANNELHEIGHT,
            title: title || this.state.title,
            confirmCallBack: confirmCallBack || this.state.confirmCallBack,
            modalVisible: true
        }, this._startAnimated);
    };

    //开始动画
    _startAnimated = () => {
        //底部到顶部的
        Animated.parallel([
            Animated.timing(
                //透明度
                this.state.top,
                {
                    toValue: (MAX_SCREEN - this.state.height) / 2,
                    duration: Animated_Duration
                }
            ),
            Animated.timing(
                //透明度
                this.state.backOpacity,
                {
                    toValue: 1,
                    duration: Animated_Duration
                }
            )
        ]).start();
    };

    /**
     * 关闭动画
     * @callBack 动画结束的回到函数
     **/
    _closeAnimated = (cb) => {
        Animated.parallel([
            Animated.timing(
                //透明度
                this.state.top,
                {
                    toValue: -this.state.height,
                    duration: (Animated_Duration * 2) / 3
                }
            ),
            Animated.timing(
                //透明度
                this.state.backOpacity,
                {
                    toValue: 0,
                    duration: (Animated_Duration * 2) / 3
                }
            )
        ]).start(() => {
            this.setState({ modalVisible: false }, () => {
                if (cb && typeof cb === 'function') {
                    cb();
                }
            });
        });
    };

    _clickOk = () => {
        if (!this.state.text) {
            return;
        }
        this._closeAnimated(() => {
            this.state.confirmCallBack && this.state.confirmCallBack(this.state.text);
        });
    };

    _onChangeText = (text) => {
        this.setState({ text });
    };

    render() {
        if (!this.state.modalVisible) {
            return null;
        }
        return (
            <Modal onRequestClose={this._closeAnimated} transparent={true} style={styles.container}>
                <View style={[styles.container, { backgroundColor: 'transparent' }]}>
                    <Animated.View
                        style={[
                            styles.container,
                            {
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                opacity: this.state.backOpacity
                            }
                        ]}
                    />

                    <Animated.View
                        style={[
                            styles.whitePanel,
                            {
                                top: this.state.top,
                                opacity: this.state.backOpacity,
                                height: this.state.height
                            }
                        ]}
                    >
                        <Image style={{ marginTop: -45 }} source={KeFuIcon}/>
                        <View style={styles.inputContainer}>
                            <TextInput
                                autoFocus
                                multiline
                                underlineColorAndroid={'transparent'}
                                placeholder='请输入其他举报内容'
                                placeholderTextColor='#c8c8c8'
                                value={this.state.text}
                                onChangeText={this._onChangeText}
                                style={styles.input}/>
                        </View>
                        <View style={styles.btnContainer}>
                            <TouchableOpacity onPress={this._clickOk} style={styles.submitContainer}>
                                <Text style={styles.submitTitle}>提交</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this._closeAnimated} style={styles.cancelContainer}>
                                <Text style={styles.cancelTitleText}>取消</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </View>
            </Modal>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    titleContainer: {
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50,
        backgroundColor: 'white',
        flexDirection: 'row',
        paddingHorizontal: 20
    },
    title: {
        textAlign: 'center',
        fontSize: 15,
        color: '#333'
    },
    whitePanel: {
        position: 'absolute',
        left: 40,
        right: 40,
        height: PANNELHEIGHT,
        backgroundColor: 'white',
        alignItems: 'center',
        borderRadius: 5
    },
    inputContainer: {
        flex: 1,
        backgroundColor: '#eeeeee',
        padding: 10
    },
    input: {
        textAlignVertical: 'top',
        width: 235 / 375 * MIN_SCREEN,
        height: 185,
        borderRadius: 2,
        backgroundColor: '#eeeeee',
        color: '#333'
    },
    btnContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
        marginTop: 25
    },
    submitContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e60012',
        marginRight: 36,
        width: 99,
        height: 32,
        borderRadius: 5
    },
    submitTitle: {
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 16,
        color: '#ffffff'
    },
    cancelContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#dddddd',
        width: 99,
        height: 32,
        borderRadius: 5
    },
    cancelTitleText: {
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 16,
        color: "#999999"
    }
});
