import { StyleSheet, PixelRatio, Dimensions ,Platform} from 'react-native';

const isIos = Platform.OS === 'ios';
const SW = Dimensions.get('window').width - 80;

function getRealDP(designPx) {
    return PixelRatio.roundToNearestPixel(designPx / 3);
}

// 验证码输入组件样式
export default StyleSheet.create({
    // textInput样式
    textInput: {
        height: isIos ? 0 : getRealDP(1),
        width: 0,
        position: 'absolute',
        bottom: 0,
        left: 0,
        color:'#fff'
    },
    // 验证码输入框总容器
    verifyContainer: {
        width: SW,
        height: getRealDP(150),
    },
    // 验证码带下划线输入格
    textInputItem: {
        width: getRealDP(120),
        borderBottomWidth: getRealDP(2),
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomColor: '#e4e4e4',

    },
    textInputItemIn: {
        width: getRealDP(120),
        borderBottomWidth: getRealDP(2),
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomColor: '#333333'
    },
    // 输入验证码样式
    verifyText: {
        fontSize: getRealDP(72),
        color: '#282828'
    },
    // 验证码文本框容器
    verifyTextContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: SW,
        height: getRealDP(150),
        paddingHorizontal: getRealDP(74),
        position: 'absolute',
        left: 0,
        top: 0,
    }
});
