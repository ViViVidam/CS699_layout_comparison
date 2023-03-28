export function makeSetting(browserName:string,enablewasm:boolean):any {
    if (browserName === "FireFox") {
        return {
            path: '/wd/hub',
            port: 4723,
            capabilities: {
                'appium:platformName': 'windows'
                , 'appium:platformVersion': '10.0'
                , 'appium:deviceName': 'Android Emulator'
                , 'appium:automationName': 'Gecko'
                , 'appium:browserName': 'firefox'//'Browser' //Chrome
                , "moz:firefoxOptions": {
                    "androidPackage": "org.mozilla.firefox"
                    , "prefs": {
                        "javascript.options.wasm": enablewasm
                        , "javascript.options.wasm_caching": false
                    }
                }
            }
        };
    } else {
        if (!enablewasm) {
            return {
                path: '/wd/hub',
                port: 4723,
                capabilities: {
                    'appium:platformName': 'Android'
                    , 'appium:platformVersion': '10.0'
                    , 'appium:deviceName': 'Android Emulator'
                    , 'appium:automationName': 'UIAutomator2'
                    , 'appium:browserName': 'Chrome'//'Browser' //Chrome
                    , "appium:chromeOptions": {
                        args: ['--js-flags=--noexpose_wasm']
                    }
                }
            };
        } else {
            return {
                path: '/wd/hub',
                port: 4723,
                capabilities: {
                    'appium:platformName': 'Android'
                    , 'appium:platformVersion': '10.0'
                    , 'appium:deviceName': 'Android Emulator'
                    , 'appium:automationName': 'UIAutomator2'
                    , 'appium:browserName': 'Chrome'//'Browser' //Chrome
                }
            };
        }
    }
}
