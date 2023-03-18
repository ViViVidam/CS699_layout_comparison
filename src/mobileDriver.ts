import {optFireFox,optChrome} from "./mobileBrowserSettings";
import fs from "fs";
import fse from "fs-extra";
var wdio = require('webdriverio');
export class MobileDriver{
    driver:any;
    settings = [optChrome,optFireFox]
    browserNames = ["",""]
    browserIndex : number;
    width = 0;
    height = 0;
    constructor() {
        this.driver = null;
        this.browserIndex = 0;
    }
    async setWidthAndHeight(){
        let driver = await wdio.remote(optFireFox);
        let windowsz = await driver.getWindowSize();
        this.width = windowsz.width;
        this.height = windowsz.height;
    }
    async takeScreenShot(url:string, browserName:string, savePath:string){
        if (!fse.existsSync(savePath)) {
            fs.mkdirSync(savePath,{recursive:true});
        }
        if(browserName==="Chrome" || browserName === "FireFox"){
            if(browserName !== this.browserNames[this.browserIndex]) {
                if (this.driver) {
                    await this.driver.deleteSession();
                    this.browserIndex = (this.browserIndex + 1) % 2;
                    this.driver = await wdio.remote(this.settings[this.browserIndex]);
                } else {
                    if (browserName === "Chrome") {
                        this.browserNames[0] = "Chrome";
                        this.browserNames[1] = "FireFox";
                        this.settings[0] = optChrome;
                        this.settings[1] = optFireFox;
                        this.browserIndex = 0;
                    } else {
                        this.browserNames[1] = "Chrome";
                        this.browserNames[0] = "FireFox";
                        this.settings[1] = optChrome;
                        this.settings[0] = optFireFox;
                        this.browserIndex = 0;
                    }
                    this.driver = await wdio.remote(this.settings[this.browserIndex]);
                }
            }
            console.log(browserName+"  "+this.browserNames[this.browserIndex]);
            await this.driver.url(url);
            await this.driver.pause(3 * 1000);
            let prevImg = await this.driver.takeScreenshot();
            let presentImg;
            let endOfPage = false;
            let counter = 0;
            while(!endOfPage)
            {
                await this.driver.touchScroll(Math.floor(10),Math.floor(this.height/3));
                await this.driver.pause(1.5 * 1000);
                presentImg = await this.driver.takeScreenshot();
                if(prevImg === presentImg){
                    endOfPage = true;
                }
                prevImg = presentImg;
                await this.driver.pause(1 * 1000);
                await this.driver.saveScreenshot(savePath + "/screenshot" + counter + ".png");
                counter+=1;
            }
            await this.driver.deleteSession();
        }
        else{
            console.log("wrong name");
        }

    }
}