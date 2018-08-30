//
//  AppDelegate+ConfigVC.m
//  jure
//
//  Created by Max on 2018/8/13.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "AppDelegate+ConfigVC.h"
#import <React/RCTRootView.h>
#import <React/RCTBundleURLProvider.h>
#import <SandBoxPreviewTool/SuspensionButton.h>

@implementation AppDelegate (ConfigVC)

-(void)JR_ConfigVC:(UIApplication *)application  didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  //TODO: 应用根控制器的view指向了RCTRootView。但RCTRootView加载jsCodeLocation对应的js代码是耗时操作。
  //未了避免白屏，可以添加launchscreen一样的view强行覆盖window.等待js代码被真正执行时，再出发native移除此view.
  NSURL *jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
  
  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"jure"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  JRBaseVC *rootViewController = [JRBaseVC new];
  rootViewController.view = rootView;
  JRBaseNavVC * nav = [[JRBaseNavVC alloc] initWithRootViewController:rootViewController];
  self.window.rootViewController = nav;
  [self.window makeKeyAndVisible];
//  [self createDebugSuspensionButton];
}
// 创建悬浮球按钮
- (void)createDebugSuspensionButton
{
  SuspensionButton *button = [[SuspensionButton alloc] initWithFrame:CGRectMake(-5, [UIScreen mainScreen].bounds.size.height / 2 - 100, 50, 50) color:[UIColor colorWithRed:135 / 255.0 green:216 / 255.0 blue:80 / 255.0 alpha:1]];
  button.leanType = SuspensionViewLeanTypeEachSide;
  [button addTarget:self action:@selector(testA) forControlEvents:UIControlEventTouchUpInside];
  //  [button addTarget:SandBoxPreviewTool.sharedTool action:@selector(autoOpenCloseApplicationDiskDirectoryPanel) forControlEvents:UIControlEventTouchUpInside];
  [self.window.rootViewController.view addSubview:button];
}
- (void)testA {
  NSLog(@"testa");
//  [[JRShareManager sharedInstance]shareWithPlatefrom:nil Title:nil SubTitle:nil Image:nil LinkUrl:nil];
//  [[JRShareManager sharedInstance]shareImage:nil imageUrl:nil];
//  [JRLoadingAndToastTool showToast:@"你好你好你好你好你好你好你好你好" andDelyTime:3];
//   long long allSize =  [[JRCacheManager sharedInstance]getAllCache];
  
  [[JRCacheManager sharedInstance]getAllCachesWithFinshBlock:^(unsigned long long memorySise) {
    
  }];
}
@end
