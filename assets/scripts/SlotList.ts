import { DBList } from "./DBList";
import EditBoard from "./EditBoard";
import SlotCell from "./SlotCell";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SlotList extends cc.Component {
    @property(cc.Layout)
    layout: cc.Layout = null;

    @property(SlotCell)
    cellPrefab: SlotCell = null;

    @property(EditBoard)
    editBoard: EditBoard = null;

    public async refreshList() {
        let armatureName = DBList.selectedArmatureName;
        let dragonBonesName = DBList.selectedDragonBonesName;
        let animationName = DBList.selectedAnimationName;
        if (!dragonBonesName) {
            cc.error("DragonBones name is empty");
            return;
        }
        if (!armatureName) {
            cc.error("Armature name is empty");
            return;
        }
        if (!animationName) {
            cc.error("Animation name is empty");
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

        let animationData = armatureData.getAnimation(animationName);
        if (!animationData) {
            cc.error("Animation data is empty");
            return;
        }

        let animateSlots = Object.keys(animationData.slotTimelines);
        cc.log("animateSlots", animateSlots);

        let maxCount = Math.max(
            animateSlots.length,
            this.layout.node.childrenCount
        );
        for (let i = 0; i < maxCount; i++) {
            if (i < animateSlots.length) {
                let dbName = animateSlots[i];
                let cell = this.layout.node.children[i];
                if (!cell) {
                    cell = cc.instantiate(this.cellPrefab.node);
                    this.layout.node.addChild(cell);
                }
                cell.getComponent(SlotCell).setData(
                    dbName,
                    this.onDBSelected.bind(this)
                );
                cell.active = true;
            } else {
                this.layout.node.children[i].active = false;
            }
        }
    }

    onDBSelected(slotName: string) {
        cc.log("onSlotSelected", slotName);
        DBList.selectedSlotName = slotName;
        this.editBoard.showDb();
    }
}
