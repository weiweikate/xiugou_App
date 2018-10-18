package com.meeruu.commonlib.umeng;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Rect;
import android.net.Uri;
import android.os.Environment;
import android.util.Log;
import android.widget.Toast;

import com.facebook.common.executors.CallerThreadExecutor;
import com.facebook.common.references.CloseableReference;
import com.facebook.datasource.DataSource;
import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.imagepipeline.datasource.BaseBitmapDataSubscriber;
import com.facebook.imagepipeline.image.CloseableImage;
import com.facebook.imagepipeline.request.ImageRequest;
import com.facebook.imagepipeline.request.ImageRequestBuilder;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.google.gson.Gson;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.meeruu.commonlib.bean.WXLoginBean;
import com.meeruu.commonlib.umeng.ShareImageBean;
import com.umeng.socialize.ShareAction;
import com.umeng.socialize.UMAuthListener;
import com.umeng.socialize.UMShareAPI;
import com.umeng.socialize.UMShareListener;
import com.umeng.socialize.bean.SHARE_MEDIA;
import com.umeng.socialize.media.UMImage;
import com.umeng.socialize.media.UMWeb;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Hashtable;
import java.util.Map;

public class LoginAndSharingModule extends ReactContextBaseJavaModule {
    private ReactApplicationContext mContext;
    public static final String MODULE_NAME = "LoginAndShareModule";
    private UMShareListener umShareListener = new UMShareListener() {
        /**
         * @descrption 分享开始的回调
         * @param platform 平台类型
         */
        @Override
        public void onStart(SHARE_MEDIA platform) {
        }
        /**
         * @descrption 分享成功的回调
         * @param platform 平台类型
         */
        @Override
        public void onResult(SHARE_MEDIA platform) {
            Toast.makeText(getCurrentActivity(),"成功了",Toast.LENGTH_LONG).show();
        }
        /**
         * @descrption 分享失败的回调
         * @param platform 平台类型
         * @param t 错误原因
         */
        @Override
        public void onError(SHARE_MEDIA platform, Throwable t) {
            Toast.makeText(getCurrentActivity(),"失败"+t.getMessage(),Toast.LENGTH_LONG).show();
        }
        /**
         * @descrption 分享取消的回调
         * @param platform 平台类型
         */
        @Override
        public void onCancel(SHARE_MEDIA platform) {
            Toast.makeText(getCurrentActivity(),"取消了",Toast.LENGTH_LONG).show();
        }
    };

    /**
     * 构造方法必须实现
     *
     * @param reactContext
     */
    public LoginAndSharingModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.mContext = reactContext;
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

    @ReactMethod
    public void share(ReadableMap params){
        /**
         * api参考地址：https://developer.umeng.com/docs/66632/detail/66639
         jsonData 参数

         shareType : 0 图文链接分享  1图片分享
         platformType: 0 朋友圈 1 会话
         title:分享标题(当为图文分享时候使用)
         dec:内容(当为图文分享时候使用)
         linkUrl:(图文分享下的链接)
         thumImage:(分享图标小图(http链接)图文分享使用)
         shareImage:分享的大图(本地URL)图片分享使用
         **/
        int shareType=params.getInt("shareType");
        SHARE_MEDIA platform=params.getInt("platformType")==1?SHARE_MEDIA.WEIXIN:SHARE_MEDIA.WEIXIN_CIRCLE;
        switch (shareType){
            case 0:
                UMImage image = new UMImage(getCurrentActivity(), params.getString("thumImage"));//网络图片
                UMWeb web = new UMWeb("http://www.baidu.com");
                web.setTitle(params.getString("title"));//标题
                web.setThumb(image);  //缩略图
                web.setDescription("my description");//描述
                new ShareAction(getCurrentActivity())
                        .setPlatform(platform)//传入平台
                        .withMedia(web)
                        .withText(params.getString("dec"))//分享内容
                        .setCallback(umShareListener)//回调监听器
                        .share();
                break;
            case 1:
                image = new UMImage(getCurrentActivity(), params.getString("thumImage"));//网络图片
                new ShareAction(getCurrentActivity())
                        .setPlatform(platform)//传入平台
                        .withMedia(image)
                        .setCallback(umShareListener)//回调监听器
                        .share();
                break;
        }
    }
    @ReactMethod
    public void loginWX(final Callback callback){
        final String TAG="";
        UMShareAPI.get(getCurrentActivity()).getPlatformInfo(getCurrentActivity(), SHARE_MEDIA.WEIXIN, new UMAuthListener() {
            @Override
            public void onStart(SHARE_MEDIA share_media) {
                Log.e(TAG, "onStart授权开始: ");
            }

            @Override
            public void onComplete(SHARE_MEDIA share_media, int i, Map<String, String> map) {
                //sdk是6.4.5的,但是获取值的时候用的是6.2以前的(access_token)才能获取到值,未知原因
                String uid = map.get("uid");
                String openid = map.get("openid");//微博没有
                String unionid = map.get("unionid");//微博没有
                String access_token = map.get("access_token");
                String refresh_token = map.get("refresh_token");//微信,qq,微博都没有获取到
                String expires_in = map.get("expires_in");
                String name = map.get("name");//名称
                String gender = map.get("gender");//性别
                String iconurl = map.get("iconurl");//头像地址

                Log.e(TAG, "onStart授权完成: " + openid);
                Log.e(TAG, "onStart授权完成: " + unionid);
                Log.e(TAG, "onStart授权完成: " + access_token);
                Log.e(TAG, "onStart授权完成: " + refresh_token);
                Log.e(TAG, "onStart授权完成: " + expires_in);
                Log.e(TAG, "onStart授权完成: " + uid);
                Log.e(TAG, "onStart授权完成: " + name);
                Log.e(TAG, "onStart授权完成: " + gender);
                Log.e(TAG, "onStart授权完成: " + iconurl);
                umengDeleteOauth(SHARE_MEDIA.WEIXIN);
                WXLoginBean bean=new WXLoginBean();
                bean.setDevice(android.os.Build.DEVICE);
                bean.setOpenid(openid);
                bean.setSystemVersion(android.os.Build.VERSION.RELEASE);
                Gson gson=new Gson();
                String s=gson.toJson(bean);
                callback.invoke(s);
            }

            @Override
            public void onError(SHARE_MEDIA share_media, int i, Throwable throwable) {
                Toast.makeText(getCurrentActivity(), "授权失败", Toast.LENGTH_LONG).show();
                Log.e(TAG, "onError: " + "授权失败");
            }

            @Override
            public void onCancel(SHARE_MEDIA share_media, int i) {
                Toast.makeText(getCurrentActivity(), "授权取消", Toast.LENGTH_LONG).show();
                Log.e(TAG, "onError: " + "授权取消");
            }
        });
    }

    private void umengDeleteOauth(SHARE_MEDIA share_media_type) {
        final String TAG="";
        UMShareAPI.get(getCurrentActivity()).deleteOauth(getCurrentActivity(), share_media_type, new UMAuthListener() {
            @Override
            public void onStart(SHARE_MEDIA share_media) {
                //开始授权
                Log.e(TAG, "onStart: ");
            }

            @Override
            public void onComplete(SHARE_MEDIA share_media, int i, Map<String, String> map) {
                //取消授权成功 i=1
                Log.e(TAG, "onComplete: ");
            }

            @Override
            public void onError(SHARE_MEDIA share_media, int i, Throwable throwable) {
                //授权出错
                Log.e(TAG, "onError: ");
            }

            @Override
            public void onCancel(SHARE_MEDIA share_media, int i) {
                //取消授权
                Log.e(TAG, "onCancel: ");
            }
        });
    }
    @ReactMethod
    public void shareScreen(final Callback callback){

    }


    @ReactMethod
    public void creatShareImage(ReadableMap options, Callback success, Callback error){
        ShareImageBean shareImageBean = parseCreatShareImageOptions(options);
        if(shareImageBean == null){
            error.invoke("creatShareImage options is error");
            return;
        }

        downloadImage(shareImageBean,success,error);

    }

    /**
     * 商品图片下载
     * @param shareImageBean
     * @param success
     * @param error
     */
    private void downloadImage(final ShareImageBean shareImageBean, final Callback success, final Callback error) {
        Fresco.initialize(mContext);

        ImageRequest imageRequest = ImageRequestBuilder.newBuilderWithSource(Uri.parse(shareImageBean.imageUrlStr))
                .setProgressiveRenderingEnabled(true).build();


        DataSource<CloseableReference<CloseableImage>> dataSource = Fresco.getImagePipeline()
                .fetchDecodedImage(imageRequest, mContext);

        dataSource.subscribe(new BaseBitmapDataSubscriber() {

            @Override
            public void onNewResultImpl(Bitmap bitmap) {
                drawBitmap(mContext,bitmap,shareImageBean,success,error);
            }

            @Override
            public void onFailureImpl(DataSource dataSource) {
                error.invoke("download fail");
            }
        }, CallerThreadExecutor.getInstance());
    }

    /**
     * 分享图片绘制
     * @param context
     * @param bitmap
     * @param shareImageBean
     * @param success
     * @param error
     */
    public static void drawBitmap(Context context,Bitmap bitmap,ShareImageBean shareImageBean,Callback success,Callback error){

        String title = shareImageBean.getTitleStr();
        String price = shareImageBean.getPriceStr();
        String info = shareImageBean.getQRCodeStr();

        int bitmapWidth = bitmap.getWidth();
        int bitmapHeight = bitmap.getHeight();
        int titleSize = dp2px(context,26);
        int priceSize = dp2px(context,24);
        int titleCount  = (int) ((bitmapWidth*0.57)/titleSize);
        if(title.length() > titleCount*2){
            title = title.substring(0,titleCount*2-3)+"...";
        }

        Bitmap result =  Bitmap.createBitmap(bitmapWidth,
                (int) (bitmapHeight+dp2px(context,160)), Bitmap.Config.ARGB_8888);

        Canvas canvas = new Canvas(result);
        Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG);

        canvas.drawBitmap(bitmap,0,0,paint);

        //在图片下边画一个白色矩形块用来放文字，防止文字是透明背景，在有些情况下保存到本地后看不出来

        paint.setColor(Color.WHITE);
        canvas.drawRect(0,bitmapHeight,bitmapWidth,
                (bitmapHeight+dp2px(context,160)),paint);
        paint.setColor(Color.BLACK);

        //绘制文字
        paint.setColor(Color.BLACK);
        paint.setTextSize(titleSize);
        Rect bounds = new Rect();
        for(int i = 0;i<2;i++){
            String s;
//            if (i == 1) {//如果是最后一行，则结束位置就是文字的长度，别下标越界哦
//                s = title.substring(i*titleCount, (i+1)*titleCount);
//            } else {//不是最后一行
//                s = title.substring(i*titleCount, (i+1)*titleCount);
//            }
            s = title.substring(i*titleCount, (i+1)*titleCount);
            //获取文字的字宽高以便把文字与图片中心对齐
            paint.getTextBounds(s,0,s.length(),bounds);
            //画文字的时候高度需要注意文字大小以及文字行间距
            canvas.drawText(s,dp2px(context,12),
                    bitmapHeight+dp2px(context,30)+i*titleSize+i*8+bounds.height()/2,paint);
        }

        paint.setColor(Color.RED);
        paint.setTextSize(priceSize);
        Rect boundsPrice = new Rect();
        paint.getTextBounds(price,0,price.length(),boundsPrice);
        canvas.drawText(price,dp2px(context,12),bitmapHeight+dp2px(context,110),paint);

        Bitmap qrBitmap = createQRImage(info,dp2px(context,110),dp2px(context,110));
        canvas.drawBitmap(qrBitmap,bitmapWidth-dp2px(context,140),bitmapHeight+dp2px(context,20),paint);
        saveImage(context,result,error);
    }

    /**
     * 参数解析
     * @param options
     * @return
     */
    private ShareImageBean parseCreatShareImageOptions(ReadableMap options){
        ShareImageBean shareImageBean = new ShareImageBean();
        if (options.hasKey("imageUrlStr")) {
            shareImageBean.setImageUrlStr(options.getString("imageUrlStr"));
        }else {
            return null;
        }

        if (options.hasKey("titleStr")) {
            shareImageBean.setImageUrlStr(options.getString("titleStr"));
        }else {
            return null;
        }

        if (options.hasKey("priceStr")) {
            shareImageBean.setImageUrlStr(options.getString("priceStr"));
        }else {
            return null;
        }

        if (options.hasKey("QRCodeStr")) {
            shareImageBean.setImageUrlStr(options.getString("QRCodeStr"));
        }else {
            return null;
        }

        return shareImageBean;
    }

    /**
     * 生成二维码 要转换的地址或字符串,可以是中文
     *
     * @param url
     * @param width
     * @param height
     * @return
     */
    public static Bitmap createQRImage(String url, final int width, final int height) {
        try {
            // 判断URL合法性
            if (url == null || "".equals(url) || url.length() < 1) {
                return null;
            }
            Hashtable<EncodeHintType, String> hints = new Hashtable<EncodeHintType, String>();
            hints.put(EncodeHintType.CHARACTER_SET, "utf-8");
            // 图像数据转换，使用了矩阵转换
            BitMatrix bitMatrix = new QRCodeWriter().encode(url,
                    BarcodeFormat.QR_CODE, width, height, hints);
            int[] pixels = new int[width * height];
            // 下面这里按照二维码的算法，逐个生成二维码的图片，
            // 两个for循环是图片横列扫描的结果
            for (int y = 0; y < height; y++) {
                for (int x = 0; x < width; x++) {
                    if (bitMatrix.get(x, y)) {
                        pixels[y * width + x] = 0xff000000;
                    } else {
                        pixels[y * width + x] = 0xffffffff;
                    }
                }
            }
            // 生成二维码图片的格式，使用ARGB_8888
            Bitmap bitmap = Bitmap.createBitmap(width, height,
                    Bitmap.Config.ARGB_8888);
            bitmap.setPixels(pixels, 0, width, 0, 0, width, height);
            return bitmap;
        } catch (WriterException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * convert dp to its equivalent px
     *
     * 将dp转换为与之相等的px
     */
    public static int dp2px(Context context,float dipValue) {
        final float scale = context.getResources().getDisplayMetrics().density;
        return (int) (dipValue * scale + 0.5f);
    }

    /**
     * 图片保存
     * @param context
     * @param bitmap
     * @param error
     * @return
     */
    private static String saveImage(Context context,Bitmap bitmap,Callback error) {

        String path = getDiskCachePath(context);

        String fileName = "shareImage.png";

        File file = new File(path, fileName);

        if (file.exists()) {
            file.delete();
        }

        FileOutputStream fos = null;

        try {
            fos = new FileOutputStream(file);
            bitmap.compress(Bitmap.CompressFormat.PNG, 100, fos);
            fos.flush();
            fos.close();
        } catch (FileNotFoundException e) {
            error.invoke(e.getMessage());
            e.printStackTrace();
        } catch (IOException e) {
            error.invoke(e.getMessage());
            e.printStackTrace();
        }

        return file.getAbsolutePath();
    }

    /**
     * 获取cache路径
     *
     * @param context
     * @return
     */
    public static String getDiskCachePath(Context context) {
        if (Environment.MEDIA_MOUNTED.equals(Environment.getExternalStorageState())
                || !Environment.isExternalStorageRemovable()) {
            return context.getExternalCacheDir().getPath();
        } else {
            return context.getCacheDir().getPath();
        }
    }
}
