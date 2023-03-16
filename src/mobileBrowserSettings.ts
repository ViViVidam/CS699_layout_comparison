import {join} from "path";
export var optFireFox = {
    path: '/wd/hub',
    port: 4723,
    capabilities: {
        platformName: 'Android'
        , platformVersion: '10.0'
        , deviceName: 'Android Emulator'
        , automationName: 'UIAutomator2'
        //, browserName: 'Browser'//'Browser' //Chrome
        //, appPackage:"org.mozilla.firefox"
        //, appActivity: "org.mozilla.firefox.HomeActivity"
        , app: join(process.cwd(),"app//org.mozilla.firefox_2015920443_apps.evozi.com.apk")
    }
};
export var optChrome = {
    path: '/wd/hub',
    port: 4723,
    capabilities: {
        platformName: 'Android'
        , platformVersion: '10.0'
        , deviceName: 'Android Emulator'
        , automationName: 'UIAutomator2'
        , browserName: 'Chrome'
        //, appPackage:"org.mozilla.firefox"
        //, appActivity: "org.mozilla.firefox.HomeActivity"
        //, app: "D://BaiduNetdiskDownload//org.mozilla.firefox_2015920443_apps.evozi.com.apk"
    }
}