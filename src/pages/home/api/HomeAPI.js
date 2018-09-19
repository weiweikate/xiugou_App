const api = {
    // 搜索框关键词匹配
    getKeywords: ['/product/getKeywords',{method:'get'}],
    // 产品列表页
    productList: '/product/productList',
    // 获取产品详情
    getProductDetail: ['/product/getProductDetail',{method:'get'}],
    // 获取产品规格信息
    getProductSpec: ['/product/getProductSpec',{method:'get'}],

    // 加入购物车
    addItem: '/user/shoppingcart/addItem',

    // 热门搜索
    queryHotName: ['/config/sysHotWord/queryHotName',{method:'get'}],

};
import ApiUtils from '../../../api/network/ApiUtils';

const HomeAPI = ApiUtils(api);

export default HomeAPI;
