import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import Layout from "@/layout/harvest-layout.json";
import { generateCellFromSetting, generateSelectionCellFromSetting } from "../../utils/style-utils";

@Module
export default class CellBase extends VuexModule {
  _column = 42;
  _row = 42;
  _size = 20;

  _textColor = ["purple", "yellow", "blue", "grey", "pink", "green"];
  _placementColor = ["156, 39, 176", "245, 127, 23", "33, 150, 243"];
  _connectionColor = ["#EA6AFF", "#FF9B43", "#56B4FF"];

  _cellColor = {
    color: [null, "green", "pink", "blue", "brown"],
    greyscale: [null, "#303030", "#999999", "#E5E5E5", "#E5E5E5"]
  };
  _cellLayout = Layout;

  _cellStyle: CSSStyleDeclaration[][] = [];

  _selectionStyle: CSSStyleDeclaration[][] = generateSelectionCellFromSetting(this._column, this._row, this._size);

  @Mutation
  setCellStyle(cellStyle: CSSStyleDeclaration[][]) {
    this._cellStyle = cellStyle;
  }

  @Action({ commit: "setCellStyle" })
  regenerateCellStyle(greyscale: boolean) {
    return generateCellFromSetting(
      this._column,
      this._row,
      this._size,
      this._cellLayout,
      greyscale ? this._cellColor.greyscale : this._cellColor.color
    );
  }

  get cellStyle() {
    return this._cellStyle;
  }

  get selectionStyle() {
    return this._selectionStyle;
  }

  get row() {
    return this._row;
  }
  get column() {
    return this._column;
  }
  get size() {
    return this._size;
  }
  get placementColor() {
    return this._placementColor;
  }
  get connectionColor() {
    return this._connectionColor;
  }

  get textColor() {
    return this._textColor;
  }
}
