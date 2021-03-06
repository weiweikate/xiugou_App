/**
 * @author xzm
 * @date 2019/1/23
 */

var Client = require('ftp');
var fs = require("fs");
var c = new Client();
var config = {
    host:'172.16.10.253',
    port:21,
    user:'ziming.x',
    password:'XIEziming123.'
}
var args = process.argv.splice(2);
var type = args[0]? args[0] : 'test';
var remoatPath = `/package/${type}/android`;
var currDate = new Date();
var dirName = `/${currDate.getFullYear()}.${currDate.getMonth()+1}.${currDate.getDate()}-${currDate.getHours()}.${currDate.getMinutes()}.${currDate.getMinutes()}`;
var dir = remoatPath+dirName;

var localfile = '../android/app/build/outputs/apk/releaseStaging/app-releaseStaging.apk';

function cdRemoteDir() {
    c.cwd(dir,function(error,currDir) {
        if(error){
            console.error(error);
            return;
        }
        upload();
    })
}

function upload() {
    let remoteFile = 'release.apk';
    c.put(localfile,remoteFile,function(error) {
        if(error){
            console.error(error);
            throw error;
            c.end();
        }else {
            console.log('上传成功');
            c.end();
        }
    })
}

function makeDir (){
    c.mkdir(dir,function() {
        fs.exists(localfile,function(exists) {
            if(!exists){
                throw new Error('本地apk文件不存在');
                c.end();
            }else {
                console.log('上传中');
                cdRemoteDir();
            }
        })
    })
}
c.on('ready',function() {
    makeDir();
});
c.connect(config);

