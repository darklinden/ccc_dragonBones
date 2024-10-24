import { DBList } from "./DBList";
import AnimationCell from "./AnimationCell";
import SlotList from "./SlotList";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AnimationList extends cc.Component {
    @property(cc.Layout)
    layout: cc.Layout = null;

    @property(AnimationCell)
    cellPrefab: AnimationCell = null;

    @property(SlotList)
    slotList: SlotList = null;

    public async refreshList() {
        let armatureName = DBList.selectedArmatureName;
        let dragonBonesName = DBList.selectedDragonBonesName;
        if (!dragonBonesName) {
            cc.error("DragonBones name is empty");
            return;
        }
        if (!armatureName) {
            cc.error("Armature name is empty");
            return;
        }

        let factory = dragonBones.CCFactory.getInstance();
        let armatureData = factory.getArmatureData(
            armatureName,
            dragonBonesName
        );
        if (!armatureData) {
            cc.error("Armature data is empty");
            return;
        }

        let animationNames = armatureData.animationNames;

        let maxCount = Math.max(
            animationNames.length,
            this.layout.node.childrenCount
        );
        for (let i = 0; i < maxCount; i++) {
            if (i < animationNames.length) {
                let dbName = animationNames[i];
                let cell = this.layout.node.children[i];
                if (!cell) {
                    cell = cc.instantiate(this.cellPrefab.node);
                    this.layout.node.addChild(cell);
                }
                cell.getComponent(AnimationCell).setData(
                    dbName,
                    this.onDBSelected.bind(this)
                );
                cell.active = true;
            } else {
                this.layout.node.children[i].active = false;
            }
        }
    }

    onDBSelected(animationName: string) {
        cc.log("onAnimationSelected", animationName);
        DBList.selectedAnimationName = animationName;
        this.slotList.refreshList();
    }
}
