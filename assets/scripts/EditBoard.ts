import { DBList } from "./DBList";
import { asyncLoadBundle, asyncLoadBundleDir } from "./Tools";

const { ccclass, property } = cc._decorator;

@ccclass
export default class EditBoard extends cc.Component {
    @property(cc.Node)
    dbNode: cc.Node = null;

    showEdit() {
        cc.log("showEdit");
        this.node.active = true;
    }

    hideEdit() {
        cc.log("hideEdit");
        this.node.active = false;
    }

    async showDb() {
        cc.log("showDb");
        this.dbNode.destroyAllChildren();

        let dbRunNode = new cc.Node("dbNode");
        dbRunNode.parent = this.dbNode;
        dbRunNode.setPosition(0, 0);

        let dbComp = dbRunNode.addComponent(dragonBones.ArmatureDisplay);

        dbComp.dragonAsset = DBList.selectedDragonBonesAsset;
        dbComp.dragonAtlasAsset = DBList.selectedDragonBonesAtlasAsset;
        dbComp.armatureName = DBList.selectedArmatureName;
        cc.log("armatureName", DBList.selectedArmatureName);
        dbComp.playAnimation(DBList.selectedAnimationName, 0);

        let slotMarker = await asyncLoadBundle("slotMarker");
        await asyncLoadBundleDir(slotMarker, "");

        let ex_db_asset = slotMarker.get<dragonBones.DragonBonesAsset>(
            "cat_ske",
            dragonBones.DragonBonesAsset
        );
        let ex_db_data = JSON.parse(ex_db_asset.dragonBonesJson);
        cc.log("ex_db_data", ex_db_data);

        let ex_db_tex = slotMarker.get<dragonBones.DragonBonesAtlasAsset>(
            "cat_tex",
            dragonBones.DragonBonesAtlasAsset
        );
        let ex_db_tex_data = JSON.parse(ex_db_tex.atlasJson);
        cc.log("ex_db_tex_data", ex_db_tex_data);

        let factory = dragonBones.CCFactory.getInstance();

        factory.parseDragonBonesData(ex_db_data);
        factory.parseTextureAtlasData(ex_db_tex_data, ex_db_tex.texture);

        // ------------------------------ dragonBones.CCFactory ------------------------------
        // BaseFactory.prototype.replaceSlotDisplay = function (dragonBonesName, armatureName, slotName, displayName, slot, displayIndex) {
        //     if (displayIndex === void 0) { displayIndex = -1; }
        //     var armatureData = this.getArmatureData(armatureName, dragonBonesName || "");
        //     if (!armatureData || !armatureData.defaultSkin) { // <=== [ Check! ]
        //         return false;
        //     }
        //     var displayData = armatureData.defaultSkin.getDisplay(slotName, displayName);
        //     if (!displayData) { // <=== [ Check! ]
        //         return false;
        //     }
        //     this.replaceDisplay(slot, displayData, displayIndex);
        //     return true;
        // };
        // -----------------------------------------------------------------------------------

        // check armature to exchange
        let ex_armature = factory.getArmatureData("Armature", "cat");
        cc.log("ex_armature", ex_armature);

        // check display to exchange
        let ex_armatureDisplay = ex_armature.defaultSkin.getDisplay(
            "cat",
            "cat"
        );
        cc.log("ex_armatureDisplay", ex_armatureDisplay);

        let slot = dbComp.armature().getSlot(DBList.selectedSlotName);

        // replace slot display
        if (factory.replaceSlotDisplay("cat", "Armature", "cat", "cat", slot)) {
            cc.log("replaceSlotDisplay success");
        } else {
            cc.log("replaceSlotDisplay failed");
        }

        this.node.active = false;
    }
}
