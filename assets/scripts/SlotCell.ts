const { ccclass, property } = cc._decorator;

@ccclass
export default class SlotCell extends cc.Component {
    @property(cc.Label)
    label: cc.Label = null;

    private _folderName: string = "";
    private _callback: (string) => void = null;

    setData(folderName: string, callback: (string) => void) {
        this._folderName = folderName;
        this._callback = callback;
        this.label.string = folderName;
    }

    onCellClicked() {
        // cc.log("onCellClicked", this.label.string);
        this._callback(this._folderName);
    }
}
