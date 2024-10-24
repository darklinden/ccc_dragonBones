import { DBList } from "./DBList";
import DragonBonesList from "./DragonBonesList";
import FileCell from "./FileCell";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FileList extends cc.Component {
    @property(cc.Layout)
    layout: cc.Layout = null;

    @property(FileCell)
    cellPrefab: FileCell = null;

    @property(DragonBonesList)
    dragonBonesList: DragonBonesList = null;

    public async refreshList() {
        let folders = await DBList.refreshList();
        let maxCount = Math.max(folders.length, this.layout.node.childrenCount);
        for (let i = 0; i < maxCount; i++) {
            if (i < folders.length) {
                let key = folders[i];
                let cell = this.layout.node.children[i];
                if (!cell) {
                    cell = cc.instantiate(this.cellPrefab.node);
                    this.layout.node.addChild(cell);
                }
                cell.getComponent(FileCell).setData(
                    key,
                    this.onFolderSelected.bind(this)
                );
                cell.active = true;
            } else {
                this.layout.node.children[i].active = false;
            }
        }
    }

    onFolderSelected(folderName: string) {
        DBList.selectedFolder = folderName;
        this.dragonBonesList.refreshList();
    }
}
