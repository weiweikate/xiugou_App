import React from 'react';
import {
    View,
    DeviceEventEmitter
} from 'react-native';
import { observer } from 'mobx-react';
import BasePage from '../../../BasePage';
import ScreenUtils from '../../../utils/ScreenUtils';
import CommRegistView from '../components/CommRegistView';
import LoginAPI from '../api/LoginApi';
import bridge from '../../../utils/bridge';
import { homeRegisterFirstManager, olduser } from '../../home/model/HomeRegisterFirstManager';
import DeviceInfo from 'react-native-device-info/deviceinfo';
import UserModel from '../../../model/user';
import { homeModule } from '../../home/Modules';
import JPushUtils from '../../../utils/JPushUtils';


@observer
export default class SetPasswordPage extends BasePage {
    // 导航配置
    $navigationBarOptions = {
        title: '设置账号及密码'
    };

    _render() {
        return (
            <View style={{ flex: 1 }}>
                <CommRegistView
                    viewType={2}
                    loginClick={(phone, code, password) => this.clickNext(phone, code, password)}
                />
                <View style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginTop: 20,
                    height: 11,
                    width: ScreenUtils.width
                }}/>
            </View>


        );
    }

    $isMonitorNetworkStatus() {
        return false;
    }

    //点击下一步
    clickNext = (phone, code, password) => {
        console.warn(this.params);
        this.$loadingShow();
        LoginAPI.existedUserLogin({
            authcode: this.params.code ? this.params.code : '',
            code: code,
            device: this.params.device ? this.params.device : 'eeeeee',
            headImg: '',
            nickname: '',
            openid: this.params.openid ? this.params.openid : '',
            password: password,
            phone: phone,
            systemVersion: DeviceInfo.getSystemVersion(),
            username: '',
            wechatCode: '',
            wechatVersion: ''
        }).then(data => {
            this.$loadingDismiss();
            UserModel.saveUserInfo(data.data);
            UserModel.saveToken(data.data.token);
            DeviceEventEmitter.emit('homePage_message', null);
            DeviceEventEmitter.emit('contentViewed', null);
            homeModule.loadHomeList();
            // this.$navigate('login/login/GetRedpacketPage');
            bridge.setCookies(data.data);
            //推送
            JPushUtils.updatePushTags();
            JPushUtils.updatePushAlias();
            if (data.give){
                homeRegisterFirstManager.setShowRegisterModalUrl(olduser);
            }
            this.$navigateBackToHome();
        }).catch(data => {
            this.$loadingDismiss();
            if (data.code === 34007) {
                bridge.$toast('该手机号已经注册,请更换新的手机号');
            } else {
                this.$toast(data.msg);
            }
            console.warn(data);

        });
    };

    // toLogin = (phone, code, password) => {
    //     LoginAPI.passwordLogin({
    //         authcode: '22',
    //         code: '',
    //         device: '44',
    //         password: password,
    //         phone: phone,
    //         systemVersion: DeviceInfo.getSystemVersion(),
    //         username: '',
    //         wechatCode: '',
    //         wechatVersion: ''
    //     }).then((data) => {
    //         this.$loadingDismiss();
    //         UserModel.saveUserInfo(data.data);
    //         UserModel.saveToken(data.data.token);
    //         DeviceEventEmitter.emit('homePage_message', null);
    //         DeviceEventEmitter.emit('contentViewed', null);
    //         homeModule.loadHomeList();
    //         // this.$navigate('login/login/GetRedpacketPage');
    //         bridge.setCookies(data.data);
    //         //推送
    //         JPushUtils.updatePushTags();
    //         JPushUtils.updatePushAlias();
    //         homeRegisterFirstManager.setShowRegisterModalUrl(olduser);
    //         this.$navigateBackToHome();
    //     }).catch((data) => {
    //         this.$loadingDismiss();
    //         bridge.$toast(data.msg);
    //     });
    // };
}


