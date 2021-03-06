package com.meeruu.commonlib.callback;

import android.app.Activity;
import android.app.Application;
import android.content.Context;
import android.os.Bundle;

import com.meeruu.commonlib.handler.WeakHandler;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * @author louis
 * @date on 2018/7/2
 * @describe 应用前后台状态监听
 * @org www.sharegoodsmall.com
 * @email luoyongming@meeruu.com
 */
public class ForegroundCallbacks implements Application.ActivityLifecycleCallbacks {
    public static final long CHECK_DELAY = 500;

    public interface Listener {
        void onBecameForeground();

        void onBecameBackground();
    }

    private static ForegroundCallbacks instance;
    private boolean foreground = false, paused = true;
    private WeakHandler handler = new WeakHandler();
    private List<Listener> listeners = new CopyOnWriteArrayList<Listener>();
    private Runnable check;

    public static ForegroundCallbacks init(Application application) {
        if (instance == null) {
            instance = new ForegroundCallbacks();
            application.registerActivityLifecycleCallbacks(instance);
        }
        return instance;
    }

    public static ForegroundCallbacks get(Application application) {
        if (instance == null) {
            init(application);
        }
        return instance;
    }

    public static ForegroundCallbacks get(Context ctx) {
        if (instance == null) {
            Context appCtx = ctx.getApplicationContext();
            if (appCtx instanceof Application) {
                init((Application) appCtx);
            }
        }
        return instance;
    }

    public static ForegroundCallbacks get() {
        if (instance == null) {
        }
        return instance;
    }

    public boolean isForeground() {
        return foreground;
    }

    public boolean isBackground() {
        return !foreground;
    }

    public void addListener(Listener listener) {
        listeners.add(listener);
    }

    public void removeListener(Listener listener) {
        listeners.remove(listener);
    }

    @Override
    public void onActivityResumed(Activity activity) {
        paused = false;
        boolean wasBackground = !foreground;
        foreground = true;
        if (check != null) {
            handler.removeCallbacks(check);
        }
        if (wasBackground) {
            for (Listener l : listeners) {
                try {
                    l.onBecameForeground();
                } catch (Exception exc) {
                }
            }
        }
    }

    @Override
    public void onActivityPaused(Activity activity) {
        paused = true;
        if (check != null) {
            handler.removeCallbacks(check);
        }
        handler.postDelayed(check = new Runnable() {
            @Override
            public void run() {
                if (foreground && paused) {
                    foreground = false;
                    for (Listener l : listeners) {
                        try {
                            l.onBecameBackground();
                        } catch (Exception exc) {
                        }
                    }
                } else {
                }
            }
        }, CHECK_DELAY);
    }

    @Override
    public void onActivityCreated(Activity activity, Bundle savedInstanceState) {
    }

    @Override
    public void onActivityStarted(Activity activity) {
    }

    @Override
    public void onActivityStopped(Activity activity) {
    }

    @Override
    public void onActivitySaveInstanceState(Activity activity, Bundle outState) {
    }

    @Override
    public void onActivityDestroyed(Activity activity) {
    }
}
