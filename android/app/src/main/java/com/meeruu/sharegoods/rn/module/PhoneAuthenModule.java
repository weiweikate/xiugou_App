package com.meeruu.sharegoods.rn.module;
import android.content.pm.PackageManager;
import android.os.Build;
import android.support.v4.content.ContextCompat;
import android.util.SparseArray;
import com.alicom.phonenumberauthsdk.gatewayauth.AlicomAuthHelper;
import com.alicom.phonenumberauthsdk.gatewayauth.TokenResultListener;
import com.alicom.phonenumberauthsdk.gatewayauth.model.InitResult;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;

public class PhoneAuthenModule extends ReactContextBaseJavaModule {

    private ReactApplicationContext mContext;
    public static final String MODULE_NAME = "PhoneAuthenModule";
    private AlicomAuthHelper mAlicomAuthHelper;
    private InitResult mAutInitResult;
    private Promise authPromise;

    private int mCurrentPermissionRequestCode = 0;
    private SparseArray<PermissionCallback> mPerMissionCallbackCache;

    /**
     * 构造方法必须实现
     *
     * @param reactContext
     */
    public PhoneAuthenModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.mContext = reactContext;
        mAlicomAuthHelper = AlicomAuthHelper.getInstance(reactContext, new TokenResultListener() {
            @Override
            public void onTokenSuccess(String s) {
                if(authPromise != null){
                    WritableMap map = Arguments.createMap();
                    map.putInt("isCanAuthen",1);
                    map.putInt("resultCode",6666);
                    map.putString("data",s);
                    map.putString("phoneNum",mAutInitResult.getSimPhoneNumber());
                    authPromise.resolve(map);
                }
            }

            @Override
            public void onTokenFailed(String s) {
                if(authPromise != null){
                    WritableMap map = Arguments.createMap();
                    map.putInt("isCanAuthen",-1);
                    map.putString("phoneNum",mAutInitResult.getSimPhoneNumber());
                    authPromise.resolve(map);
                }
            }
        });
            mAutInitResult = mAlicomAuthHelper.init();
    }
    /**
     * 在rn代码里面是需要这个名字来调用该类的方法
     *
     * @return
     */
    @Override
    public String getName() {
        return MODULE_NAME;
    }

    /**
     * 初始化sdk
     *
     * @param promise
     */
    @ReactMethod
    public void isCanPhoneAuthen(Promise promise) {
        //1代表可以本地认证 其他代表不可以
        this.authPromise = promise;
        mAlicomAuthHelper.getAuthToken(5000);
    }

    @ReactMethod
    public void startPhoneAuthenWithPhoneNum(String phoneNum, Promise promise) {
        // accessCode = "eyAgImsiIDogIk0xOTJYT3lYR0Y1QWdRTWhuMitucENrYmxjZDFPemxRemxzUWdESTRjYjlOWE5Pc1k1NVNRcHpJTmFLZ2F0eCtTTkYydGx0NWVqNE5cL1wvNGhDWDFWcWg3ZnNhUGQrRG9JMDlBN2htdmR4MmVONVJWaE4wb0F6K3VpcFRqVW9TVWVjRFlFTzVXbzhNOXE0eWFUWHZJUktEbUt4VERqUzcwalNBWDhpOHN3NUZETXVxWFlWSFN6MVZ3NW9jdlZKMkJzV1VZMkN1SHZDNTZEazRIRXpMZkpzcFh2d0E4TTZKNEpETUR4THh3dWprVzZBbkw5SjJRMTJEUDFuVmZcL2VzYkJ6MGhpOXp3Q1BUMFAxQjkyRmJlTFEreElyZmdUNkJvZ1FDeVpTbFpzZmJHb2VLU3Q0d2pKOEFwR3FpVncwc3kwQllEM1NiRVVVMUt6ckQ3eDhzOWJ5dz09IiwgICJ1IiA6ICIiLCAgImMiIDogIldiYmlHaUErcU5CeFFVbHVvdDczUTlUN0FwR1FBODZ1OWQySUhWb2JPbkx6d290eUVBUVlUaVExNUljS3FDUHhGaEFXRzJaR0h0T0ZiS1wvVktoalF3ZjU0OUZRdXAzQWNZczg3Z3h6cVlBdUJFc1NGeGYzNm1CdzhGeVhMT1lVU0MrR3Z5b3pZeGQ2U3ZJQWdzTEpHWVdFdGkydVdHaitXUzIxVUVWeVh1R1dsQ1R3QTc5Mk1Sdnp3RHdGV1lIaG00RzB5Q0d1UkZ5b0dJNEFzejcwdDljM0NKUENoUkxnWEw2WXV4YWN6UjhtZmxJQ00yaUVRTmh1U1JDbllOUDJZYm1TZFlLRXdncW5ZOGIzZWU4akJTS2J6VGh1VGF1b3pjbURncHZlS0JBXC9DZ3I3a05BZFdsSzFQK2p0Yk1mVHlGRk9sdHRKUVEwd3NqdHh6VjJrbHFzc3paUXh1S2N0NlwvM0M3cUFrdlppRE5GaFJOSmtBYzh3SVVTaWZ6amQ5eGNGVElLQVYrSityMHZMZmZvQlI0SDc2MVRpM285TG03eFdNOUd3d3c4eldzV1FqVlVsMVNYVGVcL1hJSllkUXlWelhxa2RQeVBuZDJEOWNYOWJkQ1wvNHBxZDZLZEZBcjRFcmdYWjZEZ2IrR0E9IiwgICJvIiA6ICJpT1MifQ==";
        // msg = "";
        // resultCode = 6666; 666代表成功
//        new PhoneAuthenTool().startPhoneAuthen(phoneNum,promise);
        WritableMap map = Arguments.createMap();
        map.putInt("resultCode", 6666);
        promise.resolve(map);
    }

    /*
     *  Dynamic request application permissions
     */
    protected void requestPermission(String[] permissions, PermissionCallback callback) {
        int result = PackageManager.PERMISSION_GRANTED;
        for (String s : permissions) {
            if (ContextCompat.checkSelfPermission(this.mContext, s) != PackageManager.PERMISSION_GRANTED)
                result = PackageManager.PERMISSION_DENIED;
        }

        if (result == PackageManager.PERMISSION_GRANTED && callback != null) {
            callback.onPermissionGranted(false);
        } else {
            if (Build.VERSION.SDK_INT >= 23) {
                if (mPerMissionCallbackCache == null)
                    mPerMissionCallbackCache = new SparseArray<PermissionCallback>();
                mPerMissionCallbackCache.put(mCurrentPermissionRequestCode, callback);
//                this.mContext.requestPermissions(permissions, mCurrentPermissionRequestCode++);
            } else if (callback != null) {
                callback.onPermissionDenied(false);
            }
        }
    }
    public interface PermissionCallback {
        void onPermissionGranted(boolean isRequestUser);
        void onPermissionDenied(boolean isRequestUser);
    }
}


