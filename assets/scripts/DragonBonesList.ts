import AnimationList from "./AnimationList";
import { DBList } from "./DBList";
import DragonBonesCell from "./DragonBonesCell";
import { asyncLoadBundleDir } from "./Tools";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DragonBonesList extends cc.Component {
    @property(cc.Layout)
    layout: cc.Layout = null;

    @property(cc.EditBox)
    dbName: cc.EditBox = null;

    @property(DragonBonesCell)
    cellPrefab: DragonBonesCell = null;

    @property(AnimationList)
    animationList: AnimationList = null;

    public async refreshList() {
        let folderContent = DBList.dbFolders[DBList.selectedFolder];

        if (!folderContent) {
            cc.error("Folder content is empty");
            return;
        }

        await asyncLoadBundleDir(DBList.dbBundle, DBList.selectedFolder);

        let db_asset: dragonBones.DragonBonesAsset;
        let db_tex: dragonBones.DragonBonesAtlasAsset;

        for (var f of folderContent) {
            let a = DBList.dbBundle.get<dragonBones.DragonBonesAsset>(
                f,
                dragonBones.DragonBonesAsset
            );
            if (a) {
                db_asset = a;
                continue;
            }
            let t = DBList.dbBundle.get<dragonBones.DragonBonesAtlasAsset>(
                f,
                dragonBones.DragonBonesAtlasAsset
            );
            if (t) {
                db_tex = t;
            }
        }

        if (!db_asset || !db_tex) {
            cc.error("DB asset or DB texture is empty");
            return;
        }

        DBList.selectedDragonBonesAsset = db_asset;
        DBList.selectedDragonBonesAtlasAsset = db_tex;

        // @ts-ignore
        let db_data = db_asset._buffer
            ? // @ts-ignore
              db_asset._buffer
            : JSON.parse(db_asset.dragonBonesJson);
        let db_tex_data = JSON.parse(db_tex.atlasJson);

        let factory = dragonBones.CCFactory.getInstance();
        factory.parseTextureAtlasData(db_tex_data, db_tex.texture);
        let dbData = factory.parseDragonBonesData(db_data);

        this.dbName.string = dbData.name;
        DBList.selectedDragonBonesName = dbData.name;

        cc.log("dbData", dbData);
        let dbNames = dbData.armatureNames;
        let maxCount = Math.max(dbNames.length, this.layout.node.childrenCount);
        for (let i = 0; i < maxCount; i++) {
            if (i < dbNames.length) {
                let dbName = dbNames[i];
                let cell = this.layout.node.children[i];
                if (!cell) {
                    cell = cc.instantiate(this.cellPrefab.node);
                    this.layout.node.addChild(cell);
                }
                cell.getComponent(DragonBonesCell).setData(
                    dbName,
                    this.onDBSelected.bind(this)
                );
                cell.active = true;
            } else {
                this.layout.node.children[i].active = false;
            }
        }
    }

    onDBSelected(armatureName: string) {
        cc.log("onDBSelected", armatureName);
        DBList.selectedArmatureName = armatureName;
        this.animationList.refreshList();
    }
}
