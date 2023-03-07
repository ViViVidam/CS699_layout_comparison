import fs from 'fs';
import pixelmatch from 'pixelmatch';
import jimp from 'jimp';

// Use PixelMatch
export async function pixelMatchDiff(imgpath1:string, imgpath2:string, diffpath:string){
    if (!fs.existsSync(imgpath1)){
      console.log(`${imgpath1} does not exist!`);
      return -1;
    }
    if (!fs.existsSync(imgpath2)){
      console.log(`${imgpath2} does not exist!`);
      return -1;
    }
    // add assertion width and length and img path exist
    try {
      const expectDiffRate = 0.001;
      const img1 = (await jimp.read(fs.readFileSync(imgpath1)));
      const img2 = (await jimp.read(fs.readFileSync(imgpath2)));
      const diff = img1;
      const { width, height } = img1.bitmap;
      const failPixel = await pixelmatch(img1.bitmap.data, img2.bitmap.data, diff.bitmap.data, width, height, {
        diffMask: true,
        threshold: 0.5
      });
      const failRate = failPixel / (width * height);

      (await jimp.read(diff)).scale(1).quality(100).write(diffpath);

      if (failRate >= expectDiffRate) {
        console.log('fail');
      } else {
        console.log('pass');
      }
      // console.log(`SC: ${failRate}`);
      return failRate;
    } catch (error) {
      console.log(error);
      return -1;
    }
}


