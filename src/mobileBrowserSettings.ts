import {join} from "path";
import * as process from "process";
export var optFireFox = {
    services: ['chromedriver', 'appium'],
    path: '/wd/hub',
    port: 4723,
    capabilities: {
        'appium:platformName': 'Android'
        , 'appium:platformVersion': '10.0'
        , 'appium:deviceName': 'Android Emulator'
        , 'appium:automationName': 'UIAutomator2'
        //, browserName: 'Browser'//'Browser' //Chrome
        , 'appium:app': join(process.cwd(),"app//firefox.com.apk")
    }
};
export var optChrome = {
    services: ['chromedriver', 'appium'],
    path: '/wd/hub',
    port: 4723,
    capabilities: {
        'appium:platformName': 'Android'
        , 'appium:platformVersion': '10.0'
        , 'appium:deviceName': 'Android Emulator'
        , 'appium:automationName': 'UIAutomator2'
        , 'appium:browserName': 'Chrome'//'Browser' //Chrome
    }
}