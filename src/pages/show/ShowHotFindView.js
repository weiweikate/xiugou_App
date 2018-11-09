/**
 * 热门发现
 */
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import Waterfall from '../../components/ui/WaterFall';
import { observer } from 'mobx-react';
import { ShowRecommendModules, tag } from './Show';
import ScreenUtils from '../../utils/ScreenUtils';

const { px2dp } = ScreenUtils;
import ItemView from './ShowHotItem';

const imgWidth = px2dp(168);

@observer
export default class ShowHotView extends Component {
    constructor(props) {
        super(props);
        this.recommendModules = new ShowRecommendModules();
    }

    componentDidMount() {
        this.recommendModules.loadRecommendList().then(data => {
            this.waterfall.addItems(data);
        });
    }

    infiniting(done) {
        setTimeout(() => {
            this.recommendModules.getMoreRecommendList().then(data => {
                console.log('infiniting'.data);
                if (data.length !== 0) {
                    this.waterfall.addItems(data);
                }
            });
            done();
        }, 1000);
    }

    refreshing(done) {
        setTimeout(() => {
            this.recommendModules.loadRecommendList().then(data => {
                this.waterfall.clear();
                this.waterfall.addItems(data);
            });
            done();
        }, 1000);
    }

    _gotoDetail(data) {
        const { navigation } = this.props;
        navigation.navigate('show/ShowDetailPage', { id: data.id });
    }

    renderItem = (data) => {
        let imgWide = 1
        let imgHigh = 1
        let img = ''
        if (data.generalize === tag.New) {
            imgWide = data.imgWide ? data.imgWide : 1;
            imgHigh = data.imgHigh ? data.imgHigh : 1;
            img = data.coverImg
        } else {
            imgWide = data.coverImgWide ? data.coverImgWide : 1;
            imgHigh = data.coverImgHigh ? data.coverImgHigh : 1;
            img = data.img
        }
        let imgHeight = (imgHigh / imgWide) * imgWidth;
        // const itemHeight = this._getHeightForItem({item})
        return <ItemView imageStyle={{ height: imgHeight }} data={data} press={() => this._gotoDetail(data)} imageUrl={ img }/>;
    };
    _keyExtractor = (data) => data.id + '' + data.currentDate;

    render() {
        return (
            <View style={styles.container}>
                <Waterfall
                    space={10}
                    ref={(ref) => {
                        this.waterfall = ref;
                    }}
                    columns={2}
                    infinite={true}
                    hasMore={true}
                    renderItem={item => this.renderItem(item)}
                    containerStyle={{ marginLeft: 15, marginRight: 15 }}
                    keyExtractor={(data) => this._keyExtractor(data)}
                    infiniting={(done) => this.infiniting(done)}
                    refreshing={(done) => this.refreshing(done)}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        );
    }
}

let styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: px2dp(12)
    }
});
