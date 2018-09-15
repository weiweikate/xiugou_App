/*
* 垂直展示的row
* */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    Image,
    Text
} from 'react-native';
import ScreenUtils from '../../../../utils/ScreenUtils';
import gwc from '../res/gwc.png';

export default class SearchBar extends Component {

    static propTypes = {
        onPressAtIndex: PropTypes.func.isRequired,
        storeProduct: PropTypes.func.isRequired,
        itemData: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {};
    }


    render() {
        return (
            <TouchableWithoutFeedback onPress={() => {
                this.props.onPressAtIndex(this.props.itemData.product.id);
            }}>
                <View style={{ backgroundColor: 'white' }}>
                    <View style={[styles.container]}>
                        <Image style={styles.img} source={{ uri: this.props.itemData.product.imgUrl }}/>
                        <View style={styles.textContentView}>
                            <Text style={{ color: '#222222', fontSize: 13 }}
                                  numberOfLines={2}>{this.props.itemData.product.name}</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{
                                    color: '#D51243',
                                    fontSize: 17
                                }}>{`￥${this.props.itemData.originalPrice}`}<Text style={{ fontSize: 12 }}>起</Text>
                                </Text>
                            </View>
                        </View>
                        <TouchableWithoutFeedback onPress={()=>{this.props.storeProduct(this.props.itemData.product.id)}}>
                            <View style={{
                                width: 35,
                                height: 35,
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Image source={gwc}/>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        marginLeft: 16,
        marginRight: 22,
        flexDirection: 'row'
    },
    img: {
        backgroundColor: '#eeeeee',
        height: 120,
        width: 120
    },
    textContentView: {
        width: ScreenUtils.width - 150 - 22,
        marginLeft: 14,
        marginTop: 6,
        marginBottom: 9,
        justifyContent: 'space-between'
    }
});

