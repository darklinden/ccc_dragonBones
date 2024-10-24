import { asyncLoadBundle, unloadBundle } from "./Tools";

const DB_DIR_NAME = "dragonBones";

export class DBList {
    static dbBundle: cc.AssetManager.Bundle = null;

    static dbFolders: { [key: string]: string[] } = null;

    // 一套龙骨文件一个文件夹
    static async refreshList(): Promise<string[]> {
        if (DBList.dbBundle) {
            unloadBundle(DBList.dbBundle);
        }

        DBList.dbBundle = await asyncLoadBundle(DB_DIR_NAME);
        // cc.log("DBList.dbBundle", DBList.dbBundle);

        // @ts-ignore
        let config = DBList.dbBundle._config;
        // cc.log("config", config);

        let path_map = config.paths._map;
        let paths = Object.keys(path_map);
        let folders = {};
        for (let i = 0; i < paths.length; i++) {
            let path = paths[i];
            let folder = path.split("/")[0];
            if (!folders[folder]) {
                folders[folder] = [];
            }
            folders[folder].push(path);
        }
        DBList.dbFolders = folders;
        let folderNames = Object.keys(folders);
        return folderNames;
    }

    static selectedFolder: string = null;
    static selectedDragonBonesName: string = null;
    static selectedDragonBonesAsset: dragonBones.DragonBonesAsset = null;
    static selectedDragonBonesAtlasAsset: dragonBones.DragonBonesAtlasAsset =
        null;
    static selectedArmatureName: string = null;
    static selectedAnimationName: string = null;
    static selectedSlotName: string = null;
}
