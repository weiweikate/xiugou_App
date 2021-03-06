/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JURE Group Holding Ltd. All Rights Reserved
 *
 * @flow
 * @format
 * Created by huchao on 2018/11/29.
 *
 */
'use strict';

import React from 'react';

import {
    View
} from 'react-native';

import {
    UIImage
} from '../../../../components/ui';
import ScreenUtils from '../../../../utils/ScreenUtils';
import AddressItem from '../../components/AddressItem';
import res from '../../res';

const {
    addressLine
} = res;

export default class ShippingAddressView extends React.Component {

    constructor(props) {
        super(props);

        this._bind();

        this.state = {};
    }

    _bind() {

    }

    componentDidMount() {
    }


    render() {
        let {
            receiver,
            receiverPhone,
            province,
            city,
            area,
            street,
            address
        } = this.props;

        receiver = receiver || '';
        receiverPhone = receiverPhone || '';
        province = province || '';
        city = city || '';
        area = area || '';
        street = street || '';
        address = address || '';
        return (
            <View style={{ marginBottom: 10 }}>
                <AddressItem
                    name={'收货人：' + receiver}
                    phone={receiverPhone}
                    address={province + city + area + street + address}
                />
                < UIImage source={addressLine} style={{ width: ScreenUtils.width, height: 3 }}/>
            </View>: null
        );
    }
}

