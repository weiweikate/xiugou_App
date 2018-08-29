import {AppRegistry} from 'react-native';
import App from './src/App';


(function numberPolyfill() {
    //填充，弥补兼容性
    if (!Number.parseFloat) {
        Number.parseFloat = parseFloat;
    }
    if (!Number.parseInt) {
        Number.parseInt = parseInt;
    }
    if (!Number.isInteger) {
        Number.isInteger = function (value) {
            return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
        };
    }
})();

AppRegistry.registerComponent('crm_app_xiugou', () => App);
