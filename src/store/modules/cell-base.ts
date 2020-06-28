import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import Layout from "@/layout/harvest-layout.json";
import { generateCellFromSetting, generateSelectionCellFromSetting } from "../../utils/style-utils";

@Module
export default class CellBase extends VuexModule {
  _column = 42;
  _row = 42;
  _size = 20;

  _cellColor = {
    color: [null, "green", "pink", "blue", "b_rown"],
    greyscale: [null, "#303030", "#999999", "#E5E5E5", "#E5E5E5"]
  };
  _cellLayout = Layout;

  _cellStyle: CSSStyleDeclaration[][] = generateCellFromSetting(
    this._column,
    this._row,
    this._size,
    this._cellLayout,
    this._cellColor.greyscale
  );

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
}
