import res from '../../../../comm/res';
import detailNavView from './detailNavView';
import xpProduct from './xpProduct/index';
import productScore from './productScore';
import service from './service';

const product = {
    ...res,
    detailShowBg: require('./detailShowBg.png'),
    home: require('./home.png'),
    icon_close: require('./icon_close.png'),
    jiarugouwuche_no: require('./jiarugouwuche_no.png'),
    message: require('./message_black.png'),
    share: require('./share.png'),
    detail_search: require('./detail_search.png'),
    detail_kefu: require('./detail_kefu.png'),
    xiangqing_btn_dingbu_nor: require('./xiangqing_btn_dingbu_nor.png'),
    xiangqing_btn_gouwuche_nor: require('./xiangqing_btn_gouwuche_nor.png'),
    detailNavView: {
        ...detailNavView
    },
    xpProduct: {
        ...xpProduct
    },
    productScore: {
        ...productScore
    },
    service: {
        ...service
    }
};
export default product;
