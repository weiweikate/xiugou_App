import SearchPage from './SearchPage';
import SearchResultPage from './SearchResultPage';
import CategorySearchPage from './CategorySearchPage';

export default {
    moduleName: 'search',    //模块名称
    childRoutes: {          //模块内部子路由
        SearchPage,
        SearchResultPage,
        CategorySearchPage,
    }
};
