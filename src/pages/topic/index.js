import DownPricePage from './DownPricePage';
import TopicPage  from './TopicPage'
import TopicDetailPage  from './TopicDetailPage'

export default {
    moduleName: 'topic',    //模块名称
    childRoutes: {          //模块内部子路由
        DownPricePage,
        TopicPage,
        TopicDetailPage
    }
};
