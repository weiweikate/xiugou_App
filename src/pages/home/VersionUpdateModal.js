import React from 'react';
import CommModal from '../../comm/components/CommModal';
import { DeviceEventEmitter, NativeModules, Platform, TouchableOpacity, View, ProgressBarAndroid } from 'react-native';
import ScreenUtils from '../../utils/ScreenUtils';
import UIText from '../../components/ui/UIText';

export default class VersionUpdateModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showBtn: true,
            progress: 0,
            exist: false
        };
    }

    componentWillReceiveProps(nextProps) {
        if (Platform.OS !== 'ios' && nextProps.updateData) {
            this.currProgress = 0;
            this.setState({
                positiveTxt: nextProps.apkExist ? '立即安装' : '立即更新',
                updateContent: nextProps.apkExist ? '是否安装V' + nextProps.updateData.version + '版本？' : '是否更新为V' + nextProps.updateData.version + '版本？'
            });
        }
    }

    componentWillMount() {
        if (Platform.OS !== 'ios') {
            DeviceEventEmitter.addListener('UpdateEvent', (progress) => {
                if (progress < 100) {
                    this.currProgress = progress;
                } else {
                    this.setState({
                        showBtn: true
                    });
                    this.currProgress = 100;
                }
                this.setState({
                    progress: this.currProgress,
                    positiveTxt: '立即安装',
                    updateContent: '是否安装V' + this.props.updateData.version + '版本？'
                });
            });
        }
    }

    render() {
        return (<CommModal
            animationType='fade'
            transparent={true}
            visible={this.props.showUpdate}>
            <View style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignContent: 'center',
                backgroundColor: '#fff',
                width: ScreenUtils.width - 84,
                borderRadius: 10,
                borderWidth: 0
            }}>{this.state.showBtn ?
                <UIText value={this.state.updateContent}
                        style={{
                            fontSize: 17,
                            color: '#333',
                            marginTop: 40,
                            marginBottom: 40,
                            alignSelf: 'center'
                        }}/> :
                <View style={{ flexDirection: 'column', justifyContent: 'center', borderRadius: 2 }}>
                    <ProgressBarAndroid
                        styleAttr={'Horizontal'}
                        indeterminate={false}
                        color={'#d51243'}
                        style={{
                            marginTop: 50,
                            marginLeft: 20,
                            marginRight: 20,
                            borderRadius: 10
                        }}
                        progress={this.state.progress / 100}
                    />
                    <UIText value={this.state.progress + '%'}
                            style={{ alignSelf: 'center', marginBottom: 40, marginTop: 5 }}/>
                </View>}
                {this.state.showBtn ?
                    <View style={{ height: 0.5, backgroundColor: '#eee' }}/> : null}
                <View style={{ flexDirection: 'row' }}>
                    {
                        this.props.forceUpdate ? null :
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <TouchableOpacity
                                    style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: 45 }}
                                    onPress={() => {
                                        this.props.onDismiss();
                                    }}>
                                    <UIText value={'以后再说'} style={{ color: '#999' }}/>
                                </TouchableOpacity>
                                < View style={{ width: 0.5, backgroundColor: '#eee' }}/>
                            </View>
                    }{
                    this.state.showBtn ?
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: 45,
                                backgroundColor: '#d51243',
                                borderBottomRightRadius: 10,
                                borderBottomLeftRadius: this.props.forceUpdate ? 10 : 0
                            }}
                            onPress={() => {
                                this.toUpdate();
                            }}>
                            <UIText value={this.state.positiveTxt} style={{ color: '#fff' }}/>
                        </TouchableOpacity> : null
                }
                </View>
            </View>
        </CommModal>);
    }

    toUpdate = () => {
        if (Platform.OS === 'ios') {
            // TODO 前往appstore
        } else {

            if (this.props.updateData.forceUpdate === 1) {
                // 强制更新app
                NativeModules.commModule.updateable(JSON.stringify(this.props.updateData), true, (exist) => {
                    if (this.state.positiveTxt !== '立即安装') {
                        this.setState({
                            showBtn: false,
                            positiveTxt: exist ? '立即安装' : '立即更新',
                            updateContent: exist ? '是否安装V' + this.props.updateData.version + '版本？' : '是否更新为V' + this.props.updateData.version + '版本？'
                        });
                    }
                });
            } else {
                // 关闭弹框
                this.props.onDismiss();
                // 更新app
                NativeModules.commModule.updateable(JSON.stringify(this.props.updateData), false, null);
            }
        }
    };
}