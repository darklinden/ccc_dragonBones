export function unloadBundle(b: cc.AssetManager.Bundle) {
    b.releaseAll();
    cc.assetManager.removeBundle(b);
}

export async function asyncLoadBundle(
    b: string
): Promise<cc.AssetManager.Bundle> {
    return new Promise((resolve, reject) => {
        cc.assetManager.loadBundle(b, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

export async function asyncLoadBundleDir(
    b: cc.AssetManager.Bundle,
    res: string
): Promise<cc.Asset[]> {
    return new Promise((resolve, reject) => {
        b.loadDir(res, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}
