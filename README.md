# Web Layout Crawler #

This project uses the Playwright library to crawl a specified webpage with Chrome and Firefox with WebAssembly enabled and disabled. The downloaded webpage files are downloaded to the folder `JSOutput`. Screenshots are saved to the `Screenshots` folder. The playwright will emulate as an android device.

## How to set up ###

### Prequisites
* Node.js
* MySQL
* Android Studio/ Real Android Device

### Project Installation with Android Virtual Device
1. Run the `found_page_schema.sql` under the `Database` folder to set up the schema and table for metadata logging.
2. Run the command `npm install` in the root directory of this project (same as this README).
3. Run `npm update` to update all the packages
4. Run `npm run build`
5. Download Android Studio from the website, installed it with virtual devices support.
6. Create a virtual device using device manager in Android device, and installing firefox on your virtual device.
7. Setting the environment variable to get adb work, type `adb` to check if it works.
8. Setting environment variable `ANDROID_HOME` to where you installed your Android Studio, `JAVA_HOME` to your jdk
9. `npm install -g appium@next`, this will install appium v2.x
10. Run `appium driver install uiautomator2`, `appium driver install chromium`, `appium driver install gecko`, this will get you the required driver
11. Download geckodriver from [geckodriver download website](https://github.com/mozilla/geckodriver/releases), extra the downloaded file and add the path to your environment.

### Usage
1. Run the virtual devices through Android Studio Device Manager or through terminal
2. Run Appium in the root directory. To do this, open up  a new terminal and type `appium --base-path /wd/hub`
3. Open another terminal and run the command `node ./build/index.js --url <url_to_san>` to scan the `<url_to_san>` and all of its first-level subpages. For example, try running the command `node ./build/index.js --url https://jkumara.github.io/pong-wasm/` as this site contains WebAssembly. 
4. To scan a list of urls with the crawler, run the command `node ./build/index.js --file <file_path>` to read in the file at `<file_path>`. For example, to use the included file `sites.txt`, run the command `node ./build/index.js --file sites.txt`
5. To generate visual analysis report, run `python scripts/ScreenshotAnalysis.py`

### TroubleShooting
1. If in the emulator device open the browser but never goto the url, shut down appium terminal, and run `adb uninstall io.appium.uiautomator2.server` and `adb uninstall io.appium.uiautomator2.server.test`, then relaunch appium