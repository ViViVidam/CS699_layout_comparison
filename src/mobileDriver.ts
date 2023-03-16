import {optFireFox,optChrome} from "./mobileBrowserSettings";
import fs from "fs";
import fse from "fs-extra";
var wdio = require('webdriverio');
export class MobileDriver{
    constructor() {
    }
    async takeScreenShot(url:string, browserName:string, savePath:string){
        console.log("*****************")
        console.log(browserName)
        console.log("*****************")
        if (!fse.existsSync(savePath)) {
            fs.mkdirSync(savePath,{recursive:true});
        }
        if(browserName==="Chrome"){
           let chromeDriver = await wdio.remote(optChrome);
            await chromeDriver.url(url);
            console.log("goto "+url);
            await chromeDriver.pause(4*1000);
            await chromeDriver.saveScreenshot(savePath+"/screenshot.png");
            await chromeDriver.deleteSession();
        }
        else if(browserName === "FireFox"){
            let FireFoxDriver = await wdio.remote(optFireFox);
            await FireFoxDriver.url(url);
            console.log("goto "+url);
            await FireFoxDriver.pause(4*1000);
            await FireFoxDriver.saveScreenshot(savePath+"/screenshot.png");
            await FireFoxDriver.deleteSession();
        }
        else{
            console.log("wrong name");
        }

    }
}