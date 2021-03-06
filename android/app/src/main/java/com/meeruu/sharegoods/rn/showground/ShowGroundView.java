package com.meeruu.sharegoods.rn.showground;

import android.content.Context;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v7.widget.RecyclerView;
import android.support.v7.widget.SimpleItemAnimator;
import android.support.v7.widget.StaggeredGridLayoutManager;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.TypeReference;
import com.chad.library.adapter.base.BaseQuickAdapter;
import com.facebook.infer.annotation.Assertions;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.meeruu.sharegoods.R;
import com.meeruu.sharegoods.rn.showground.bean.NewestShowGroundBean;
import com.meeruu.sharegoods.rn.showground.event.onEndScrollEvent;
import com.meeruu.sharegoods.rn.showground.event.onItemPressEvent;
import com.meeruu.sharegoods.rn.showground.event.onStartRefreshEvent;
import com.meeruu.sharegoods.rn.showground.event.onStartScrollEvent;
import com.meeruu.sharegoods.rn.showground.presenter.ShowgroundPresenter;
import com.meeruu.sharegoods.rn.showground.view.IShowgroundView;
import com.meeruu.sharegoods.rn.showground.widgets.CustomLoadMoreView;
import com.meeruu.sharegoods.rn.showground.widgets.RnRecyclerView;

import java.lang.ref.WeakReference;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ShowGroundView implements IShowgroundView, SwipeRefreshLayout.OnRefreshListener {
    private int page = 1;
    private SwipeRefreshLayout swipeRefreshLayout;
    private RnRecyclerView recyclerView;
    private ShowGroundAdapter adapter;
    private ShowgroundPresenter presenter;
    private EventDispatcher eventDispatcher;
    private onItemPressEvent itemPressEvent;
    private onStartRefreshEvent startRefreshEvent;
    private onStartScrollEvent startScrollEvent;
    private onEndScrollEvent endScrollEvent;

    private WeakReference<View> showgroundView;
    public ViewGroup getShowGroundView(ReactContext reactContext){
        eventDispatcher = reactContext.getNativeModule(UIManagerModule.class).getEventDispatcher();
        LayoutInflater inflater = LayoutInflater.from(reactContext);
        View view = inflater.inflate(R.layout.view_showground, null);
        initView(reactContext, view);
        initData();
        return (ViewGroup) view;
    }

    private void initView(Context context, final View view) {
        showgroundView = new WeakReference<>(view);
        swipeRefreshLayout = view.findViewById(R.id.refresh_control);
        swipeRefreshLayout.setColorSchemeResources(R.color.app_main_color);
        recyclerView = view.findViewById(R.id.home_recycler_view);
        swipeRefreshLayout.setOnRefreshListener(this);
        swipeRefreshLayout.postDelayed(new Runnable() {
            @Override
            public void run() {
                swipeRefreshLayout.setRefreshing(true);
                onRefresh();
            }
        }, 200);
        itemPressEvent = new onItemPressEvent();
        startRefreshEvent = new onStartRefreshEvent();
        startScrollEvent = new onStartScrollEvent();
        endScrollEvent = new onEndScrollEvent();
        adapter = new ShowGroundAdapter();
        adapter.openLoadAnimation(BaseQuickAdapter.ALPHAIN);
        adapter.setPreLoadNumber(3);
        final StaggeredGridLayoutManager layoutManager = new StaggeredGridLayoutManager(2, StaggeredGridLayoutManager.VERTICAL);
        layoutManager.setGapStrategy(StaggeredGridLayoutManager.GAP_HANDLING_NONE);
        recyclerView.setLayoutManager(layoutManager);
        recyclerView.setOnScrollListener(new RecyclerView.OnScrollListener() {
            @Override
            public void onScrollStateChanged(RecyclerView recyclerView, int newState) {
                super.onScrollStateChanged(recyclerView, newState);
                switch (newState) {
                    case RecyclerView.SCROLL_STATE_IDLE: {
                        endScrollEvent.init(view.getId());
                        eventDispatcher.dispatchEvent(endScrollEvent);
                    }
                    break;
                    case RecyclerView.SCROLL_STATE_DRAGGING: {
                        startScrollEvent.init(view.getId());
                        eventDispatcher.dispatchEvent(startScrollEvent);
                    }
                    break;
                    default:
                        break;
                }

            }
        });
        adapter.setEnableLoadMore(true);
        adapter.setOnLoadMoreListener(new BaseQuickAdapter.RequestLoadMoreListener() {
            @Override
            public void onLoadMoreRequested() {
                page++;
                presenter.getShowList(page);
            }
        }, recyclerView);
        adapter.setLoadMoreView(new CustomLoadMoreView());
        adapter.setOnItemClickListener(new BaseQuickAdapter.OnItemClickListener() {
            @Override
            public void onItemClick(final BaseQuickAdapter adapter, View view1,final int position) {
                final List<NewestShowGroundBean.DataBean> data = adapter.getData();

                recyclerView.postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        NewestShowGroundBean.DataBean bean = data.get(position);
                        bean.setClick(bean.getClick()+5);
                        adapter.replaceData(data);

                    }
                },200);

                if (data != null) {
                    NewestShowGroundBean.DataBean item = data.get(position);
                    String json = JSONObject.toJSONString(item);
                    Map map = JSONObject.parseObject(json, new TypeReference<Map>() {
                    });
                    WritableMap realData = Arguments.makeNativeMap(map);
                    if (eventDispatcher != null) {
                        itemPressEvent.init(view.getId());
                        itemPressEvent.setData(realData);
                        eventDispatcher.dispatchEvent(itemPressEvent);
                    }
                }

            }
        });
        recyclerView.addItemDecoration(new SpaceItemDecoration(10));
        recyclerView.setAdapter(adapter);
        ((SimpleItemAnimator) recyclerView.getItemAnimator()).setSupportsChangeAnimations(false);
        recyclerView.addOnScrollListener(new RecyclerView.OnScrollListener() {
            @Override
            public void onScrollStateChanged(RecyclerView recyclerView, int newState) {
                super.onScrollStateChanged(recyclerView, newState);
                StaggeredGridLayoutManager layoutManager = (StaggeredGridLayoutManager) recyclerView.getLayoutManager();
                int[] first = new int[2];
                layoutManager.findFirstCompletelyVisibleItemPositions(first);
                if (newState == RecyclerView.SCROLL_STATE_IDLE && (first[0] == 1 || first[1] == 1)) {
                    layoutManager.invalidateSpanAssignments();
                }
            }
        });
    }

    private void initData() {
        presenter = new ShowgroundPresenter(this);
    }

    @Override
    public void onRefresh() {
        if (eventDispatcher != null) {
            View view = showgroundView.get();
            if (view != null) {
                startRefreshEvent.init(view.getId());
                eventDispatcher.dispatchEvent(startRefreshEvent);
            }
        }
        adapter.setEnableLoadMore(false);
        page = 1;
        presenter.getShowList(page);
    }

    @Override
    public void loadMoreFail() {
        swipeRefreshLayout.setRefreshing(false);
        if (adapter != null) {
            adapter.loadMoreFail();
        }
    }

    @Override
    public void viewLoadMore(final List data) {
        if (data != null) {
            adapter.addData(data);
        }
    }

    @Override
    public void refreshShowground(final List data) {
        if (adapter != null) {
            adapter.setEnableLoadMore(true);
            adapter.setNewData(data);
            swipeRefreshLayout.setRefreshing(false);
        }
    }

    @Override
    public void loadMoreEnd() {
        if (adapter != null) {
            adapter.loadMoreEnd();
        }
    }

    @Override
    public void loadMoreComplete() {
        adapter.loadMoreComplete();
    }

    public void addHeader(View view){
        int i = adapter.getHeaderLayoutCount();
        if (i != 0) {
            adapter.removeAllHeaderView();
        }
        adapter.addHeaderView(view);
        recyclerView.scrollToPosition(0);
    }

    public void setParams(HashMap map){
        if (presenter != null) {
            presenter.setParams(map);
        }
    }
}
