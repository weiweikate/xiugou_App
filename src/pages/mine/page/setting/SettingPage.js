import React from 'react';
import {
    StyleSheet,
    View,
    Image,
    NativeModules,
    TouchableOpacity, Alert, Switch, Text, Platform, AsyncStorage,
    Linking
} from 'react-native';

const { CachesModule } = NativeModules;
import BasePage from '../../../../BasePage';
import CommonTwoChoiceModal from '../../model/CommonTwoChoiceModal';
import UIText from '../../../../components/ui/UIText';
import { color } from '../../../../constants/Theme';
import ScreenUtils from '../../../../utils/ScreenUtils';
import user from '../../../../model/user';
import MineApi from '../../api/MineApi';
import shopCartStore from '../../../shopCart/model/ShopCartStore';
import DeviceInfo from 'react-native-device-info';
import bridge from '../../../../utils/bridge';
import CommModal from 'CommModal';
import DesignRule from 'DesignRule';
import QYChatUtil from '../helper/QYChatModel';
import res from '../../res';
import { getSizeFromat } from '../../../../utils/FileSizeFormate';
import { homeModule } from '../../../home/Modules'
 
/**
 * @author luoyongming
 * @date on 2018/9/13
 * @describe 设置页面
 * @org www.sharegoodsmall.com
 * @email luoyongming@meeruu.com
 */

const arrow_right = res.button.arrow_right;

class SettingPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            phone: '',
            pwd: '',
            thirdType: 1,
            passwordDis: false,
            phoneError: false,
            passwordError: false,
            isShowLoginOutModal: false,
            updateData: {},
            showUpdate: false,
            version: DeviceInfo.getVersion(),
            updateContent: '',
            value: true
        };
    }

    $navigationBarOptions = {
        title: '设置',
        show: true // false则隐藏导航
        // hiddenNav:false
    };

    //CachesModule
    componentDidMount() {
        this.getAllCachesSize();
        if (Platform.OS === 'android') {
            bridge.isPushStopped((value) => {
                this.setState({
                    value: !value
                });
            });
        }
    }


    //**********************************ViewPart******************************************
    _render = () => {
        return (
            <View style={styles.container}>

                {this.renderWideLine()}
                <View style={{ backgroundColor: 'white' }}>
                    <TouchableOpacity style={styles.viewStyle} onPress={() => this.jumpToAccountSettingPage()}>
                        <UIText value={'账号与安全'} style={styles.blackText}/>
                        <Image source={arrow_right}/>
                    </TouchableOpacity>
                    {this.renderLine()}
                    <TouchableOpacity style={styles.viewStyle} onPress={() => this.jumpToAddressManagePage()}>
                        <UIText value={'收货地址管理'} style={styles.blackText}/>
                        <Image source={arrow_right}/>
                    </TouchableOpacity>
                    {this.renderLine()}
                    {Platform.OS === 'ios' ? null :
                        <View>
                            <TouchableOpacity style={styles.viewStyle}>
                                <UIText value={'消息推送'} style={styles.blackText}/>
                                <Switch value={this.state.value}
                                        onTintColor={'#00D914'}
                                        thumbTintColor={Platform.OS === 'android' ? 'white' : ''}
                                        tintColor={DesignRule.textColor_hint}
                                        onValueChange={(value) => {
                                            this.setState({
                                                value: value
                                            });
                                            if (value) {
                                                bridge.resumePush();
                                            } else {
                                                bridge.stopPush();
                                            }
                                        }}/>
                            </TouchableOpacity>
                            {this.renderLine()}
                        </View>}
                    <TouchableOpacity style={styles.viewStyle} onPress={() => this.clearAllCaches()}>
                        <UIText value={'清除缓存'} style={styles.blackText}/>
                        <UIText value={this.state.memorySize}
                                style={{ fontSize: 13, color: DesignRule.textColor_secondTitle }}/>
                    </TouchableOpacity>
                    {this.renderLine()}
                    <TouchableOpacity style={styles.viewStyle} onPress={() => this.jumptToAboutUsPage()}>
                        <UIText value={'关于我们'} style={styles.blackText}/>
                        <Image source={arrow_right}/>
                    </TouchableOpacity>
                    {this.renderLine()}
                    <TouchableOpacity style={styles.viewStyle}
                                      onPress={() => this.getNewVersion()}>
                        <UIText value={'版本检测'} style={[styles.blackText, { flex: 1 }]}/>
                        <UIText value={'当前版本v' + this.state.version}
                                style={{ fontSize: 13, color: DesignRule.textColor_secondTitle }}/>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={{
                    marginTop: 42,
                    backgroundColor: color.red,
                    width: ScreenUtils.width - 84,
                    height: 50,
                    marginLeft: 42,
                    marginRight: 42,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 25
                }} onPress={() => this.toLoginOut()}>
                    <Text style={{ fontSize: 17, color: 'white' }}
                          onPress={() => this.toLoginOut()}>退出登录</Text>
                </TouchableOpacity>

                {this.renderModal()}
                {this.renderUpdateModal()}
            </View>
        );
    };
    clearAllCaches = () => {
        Alert.alert('提示', '确定清理缓存?',
            [
                {
                    text: '取消', onPress: () => {
                    }
                },
                {
                    text: '确定', onPress: () => {
                        if (ScreenUtils.isIOS) {
                            CachesModule.clearCaches(() => {
                                this.getAllCachesSize();
                            });
                        } else {
                            bridge.clearAllCache(() => {
                                this.getAllCachesSize();
                            });
                        }
                    }
                }
            ]
        );
    };

    getAllCachesSize = () => {
        if (ScreenUtils.isIOS) {
            CachesModule && CachesModule.getCachesSize((allSize) => {
                let temp = getSizeFromat(allSize);
                this.setState({
                    memorySize: temp
                });
            });
        } else {
            bridge.getTotalCacheSize((allSize) => {
                let temp = getSizeFromat(allSize);
                this.setState({
                    memorySize: temp
                });
            });
        }
    };
    renderWideLine = () => {
        return (
            <View style={{ height: 10, backgroundColor: DesignRule.bgColor }}/>
        );
    };
    renderLine = () => {
        return (
            <View style={{
                height: 0.5,
                backgroundColor: DesignRule.lineColor_inColorBg,
                marginLeft: 15,
                marginRight: 15
            }}/>
        );
    };
    toLoginOut = () => {
        this.setState({ isShowLoginOutModal: true });
        this.loginOutModal && this.loginOutModal.open();
    };
    renderModal = () => {
        return (

            <CommonTwoChoiceModal
                isShow={this.state.isShowLoginOutModal}
                ref={(ref) => this.loginOutModal = ref}
                detail={{ title: '', context: '是否确认退出登录', no: '取消', yes: '确认' }}
                closeWindow={() => {
                    this.setState({ isShowLoginOutModal: false });
                }}
                yes={() => {
                    this.setState({ isShowLoginOutModal: false });
                    AsyncStorage.removeItem('lastMessageTime').catch(e => {
                    });
                    this.$loadingShow();
                    // 正常退出，或者登录超时，都去清空数据
                    user.clearUserInfo();
                    user.clearToken();
                    //清空购物车
                    shopCartStore.data = [];
                    this.$navigateBackToHome();
                    homeModule.loadHomeList()
                    MineApi.signOut();
                    QYChatUtil.qiYULogout();
                    this.$loadingDismiss();

                }}
                no={() => {
                    this.setState({ isShowLoginOutModal: false });
                }}
            />


        );
    };

    renderUpdateModal = () => {
        return (
            <CommModal
                animationType='fade'
                transparent={true}
                ref={(ref) => {
                    this.updateModal = ref;
                }}
                visible={this.state.showUpdate}>
                <View style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignContent: 'center',
                    backgroundColor: '#fff',
                    width: ScreenUtils.width - 84,
                    borderRadius: 10,
                    borderWidth: 0
                }}>
                    <UIText value={this.state.updateContent}
                            style={{
                                fontSize: 17,
                                color: DesignRule.textColor_mainTitle,
                                marginTop: 40,
                                marginBottom: 40,
                                alignSelf: 'center'
                            }}/>
                    <View style={{ height: 0.5, backgroundColor: DesignRule.lineColor_inColorBg }}/>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity
                            style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: 45 }}
                            onPress={() => {
                                this.setState({ showUpdate: false });
                            }}>
                            <UIText value={'以后再说'} style={{ color: DesignRule.textColor_instruction }}/>
                        </TouchableOpacity>
                        <View style={{ width: 0.5, backgroundColor: DesignRule.lineColor_inColorBg }}/>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: 45,
                                backgroundColor: DesignRule.mainColor,
                                borderBottomRightRadius: 10
                            }}
                            onPress={() => {
                                this.toUpdate();
                            }}>
                            <UIText value={'立即更新'} style={{ color: '#fff' }}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </CommModal>
        );
    };

    //**********************************BusinessPart******************************************
    jumpToAddressManagePage = () => {
        this.$navigate('mine/address/AddressManagerPage');
    };
    jumptToAboutUsPage = () => {
        this.$navigate('mine/setting/AboutUsPage');
    };
    // 账户设置
    jumpToAccountSettingPage = () => {
        this.$navigate('mine/setting/AccountSettingPage');
    };

    // 版本检测
    getNewVersion = () => {
        // Android调用原生检测版本
        MineApi.getVersion({ version: DeviceInfo.getVersion() }).then((res) => {
            if (res.data.upgrade === 1) {
                this.setState({
                    updateData: res.data,
                    showUpdate: true,
                    updateContent: '是否更新为V' + res.data.version + '版本？'
                });
                this.updateModal && this.updateModal.open();
            } else {
                bridge.$toast('当前已是最新版本');
            }
        }).catch((data) => {
            bridge.$toast(data.msg);
        });
    };

    toUpdate = () => {
        this.setState({
            showUpdate: false
        });
        if (Platform.OS === 'ios') {
            // 前往appstore
            Linking.openURL('https://itunes.apple.com/cn/app/id1439275146');
        } else {
            // 更新app
            NativeModules.commModule.updateable(JSON.stringify(this.state.updateData), false);
        }
    };
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: DesignRule.bgColor,
        flexDirection: 'column',
        flex: 1
    },
    viewStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 21,
        paddingRight: 23,
        backgroundColor: 'white',
        height: 44,
        alignItems: 'center'
    },
    blackText: {
        fontSize: 13,
        color: DesignRule.textColor_mainTitle
    }
});

export default SettingPage;
