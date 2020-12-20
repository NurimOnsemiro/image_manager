import jimp from 'jimp';
import path from 'path';
import mkdirp from 'mkdirp';

if (process.argv.length >= 3 && (process.argv[2] === '--help' || process.argv[2] === '-h')) {
    console.warn('./image_manager.exe [filename = test] [extname = jpg] [length = 1] [startCnt = 0]');
    process.exit(0);
}

let filename: string = 'test';
if (process.argv.length >= 3) {
    filename = process.argv[2];
}
let extname: string = 'jpg';
if (process.argv.length >= 4) {
    extname = process.argv[3];
}
let fileLength: number = 1;
if (process.argv.length >= 5) {
    fileLength = Number(process.argv[4]);
}
let startCnt: number = 0;
if (process.argv.length >= 6) {
    startCnt = Number(process.argv[5]);
}
let saveCnt: number = startCnt;

console.log('filename : ' + filename + ', fileLength : ' + fileLength);

async function changeImageData(index: number, brightType: number = 0): Promise<void> {
    return new Promise(async (resolve, reject) => {
        let loadFilename: string = filename + ` (${index}).${extname}`;
        let saveFilename: string = filename + ` (${saveCnt++}).${extname}`;
        //console.log('saveFilename: ' + saveFilename);

        jimp.read(loadFilename, async (err, lenna) => {
            if (err) {
                reject(err);
            }

            if (brightType !== 0) {
                let brightness: number = -0.2;
                if (brightType === 1) {
                    brightness = 0.4;
                }
                lenna
                    .brightness(brightness) //INFO: 밝기 -1~1
                    .contrast(0.4) //INFO: 대조 -1~1
                    .resize(416, 416)
                    .write(path.join('./result', saveFilename), err => {
                        if (err) {
                            reject(err);
                        }
                        resolve();
                    });
            } else {
                lenna.resize(416, 416).write(path.join('./result', saveFilename), err => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                });
            }
        });
    });
}

async function main() {
    try {
        await mkdirp('./result');
        for (let i = 0; i < fileLength; i++) {
            await changeImageData(startCnt + i, 0);
            console.log(`Image Processing (Original) Finish(${i + 1}/${fileLength})`);
        }
        for (let i = 0; i < fileLength; i++) {
            await changeImageData(startCnt + i, 1);
            console.log(`Image Processing (Bright Up) Finish(${i + 1}/${fileLength})`);
        }
        for (let i = 0; i < fileLength; i++) {
            await changeImageData(startCnt + i, -1);
            console.log(`Image Processing (Bright Down) Finish(${i + 1}/${fileLength})`);
        }
    } catch (ex) {
        console.error(ex);
        process.exit(0);
    }
}
main();
