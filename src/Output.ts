const fs = require('fs');
const path = "./output";

export function outputCanvas(canvas, frameID: number, runName: string)
{
    const buffer = canvas.toBuffer("image/png");
    const num = ("000" + frameID).slice(-4)
    fs.writeFile(path + "/" + runName+ "/" + num + ".png", buffer, () => {});
}

export function prepareFolder(run: string): Promise<void>
{
    return new Promise<void>((resolve: () => void, reject: (error) => void)  =>
    {
        fs.access(path, (error) => {
            if (error)
                fs.mkdir(path, (error) => {
                    if (error)
                        reject(error);
                    else
                        prepareInner(run).then(resolve);
                });
            else
                prepareInner(run).then(resolve);
        });
    });
}

function prepareInner(run: string): Promise<void>
{
    return new Promise<void>((resolve, reject) =>
    {
        fs.access(path+ "/" +run, (error) => {
            if (error)
                fs.mkdir(path+ "/" +run, (error) => {
                    if (error)
                        reject(error);
                    else
                        resolve();
                });
            else
                resolve();
        });
    });
}

