

import { SiDeckItemLayout, SiDeckItemLayoutOptions } from "./SiDeckItemLayout";
import { SiDeckItemContentLayout } from "./SiDeckItemContentLayout";
import { defaults, Factory, observable } from "si-decorators";
import { KnockoutJsxFactory } from "si-kolayout-jsx";
import { JSXLayout } from "si-kolayout-jsx";
import { KoLayout, IKoLayout, KnockoutTemplateBindingHandlerOptions } from "si-kolayout";
import { PortalLayout } from "../index";
import * as ko from "knockout";

import * as i from "template!./templates/ListResourcesDeckLayoutTemplate.html";
import { ioc } from "si-dependency-injection";

import "css!./content/ListResourcesDeckLayout.less";

import { createTemplate } from "si-kolayout";
import { propergateToParent } from "../Utils/propergateToParent";

const noop = () => void 0;

export interface TableColumnOptions {
    table: TableModel,
    name: string;
    width: string;
}
@defaults({ name: noop, table: noop, css: () => ({}) }, true)
export class TableColumn {
    @observable name;
    table: TableModel;
    @observable css;

    constructor(options: TableColumnOptions) {

    }

    width = "32%";
    hiddenInCollapsed = false;
    sortable = false;
    sortOrder() { }
    columnId = "";

  
    attr = {}
    enableEllipsis = true;
}
export class ContextMenu {
    width = "2%";
    shortcutsVisible = false;
}
export class Sorting {

    getSortClasses() {

    }
    getAriaSort() {

    }
}

const tmp1 = createTemplate(
    <span class="fxc-grid-cellContent si-ellipsis" data-bind="css: { 'si-ellipsis': column.enableEllipsis }">
        <span class="siportalfx-gridcolumn-assetsvg-icon" aria-hidden="true">
            <svg viewBox="0 0 50 50" focusable="false" class="si-portal-svg" role="presentation" width="100%" height="100%">
                <g>
                    <path class="siportalfx-svg-c16" d="M25.047 22.647a.428.428 0 0 1-.22-.064l-14.711-8.49a.445.445 0 0 1 0-.771l14.616-8.435a.452.452 0 0 1 .442 0l14.714 8.495a.447.447 0 0 1 .221.382.45.45 0 0 1-.221.387l-14.619 8.433a.438.438 0 0 1-.222.063"></path><path class="siportalfx-svg-c15" d="M22.932 43.284a.444.444 0 0 1-.226-.059L8.042 34.761a.436.436 0 0 1-.226-.386V17.39a.45.45 0 0 1 .226-.389.463.463 0 0 1 .448 0l14.662 8.464a.45.45 0 0 1 .218.387v16.987a.445.445 0 0 1-.218.386.44.44 0 0 1-.22.059m4.149 0a.444.444 0 0 1-.446-.445V25.962c0-.159.084-.305.22-.387l14.66-8.461a.458.458 0 0 1 .448 0c.134.08.22.227.22.385v16.877a.446.446 0 0 1-.22.386l-14.665 8.464a.401.401 0 0 1-.217.058"></path><path class="siportalfx-svg-c01" d="M27.081 43.284a.444.444 0 0 1-.446-.445V25.962c0-.159.084-.305.22-.387l14.66-8.461a.458.458 0 0 1 .448 0c.134.08.22.227.22.385v16.877a.446.446 0 0 1-.22.386l-14.665 8.464a.401.401 0 0 1-.217.058" opacity=".5"></path><path class="siportalfx-svg-c04" d="M9.558 45.171a1.45 1.45 0 0 1-.726-.195l-6.845-3.952C.835 40.358 0 38.911 0 37.582V12.418c0-1.329.835-2.777 1.987-3.441l6.845-3.952a1.455 1.455 0 0 1 1.455 2.519l-6.845 3.952c-.243.141-.532.641-.532.922v25.164c0 .281.289.782.532.922l6.845 3.952a1.454 1.454 0 0 1-.729 2.715zM40.442 4.829c.247 0 .497.063.726.195l6.845 3.952C49.165 9.642 50 11.089 50 12.418v25.164c0 1.329-.835 2.777-1.987 3.441l-6.845 3.952a1.455 1.455 0 0 1-1.455-2.519l6.845-3.952c.243-.141.532-.641.532-.922V12.418c0-.281-.289-.782-.532-.922l-6.845-3.952a1.454 1.454 0 0 1 .729-2.715z"></path>
                </g>
            </svg>
        </span>
        <ko if="isPreview"></ko>
        <span class="siportalfx-gridcolumn-assetsvg-text" data-bind="text:value, asyncClick:cellClicked,clickBubble:false" ></span>
        <ko if="externalLink"></ko>
    </span> as HTMLElement);

const tmp2 = createTemplate(<span class="fxc-grid-cellContent si-ellipsis" data-bind="css: {'si-ellipsis': column.enableEllipsis }, text:value"></span> as HTMLElement) ;

export interface TableCellOptions {
    value: string;
    item: any;
}
export class TableCell implements IKoLayout {
    @observable value;
    item = null;

    get column() {
        return this.row.table.columns()[this.index];
    }
    constructor(public row: TableRow, public index: number, value: TableCellOptions|string = "") {
        if (typeof (value) === "string") {

            this.value = value;
            this.item = value;
        } else {
            this.item = value.item;
            this.value = value.value;
        }
    }

    isPreview = false;
    externalLink = "";

    attr = {}

    templateOptions(element?: HTMLElement): KnockoutTemplateBindingHandlerOptions {
        return { name: this.index === 0 ? tmp1:tmp2 };
    }

    @propergateToParent()
    cellClicked(vm:TableCell, event) {
        console.log(arguments);

       
    }
}


export interface TableRowOptions {
    table: TableModel,
    cells: Array<any>;
}
@defaults({ table: noop }, true)
export class TableRow {
    table: TableModel;
    cells = ko.observableArray([]);

    constructor(options: TableRowOptions) {
        this.cells(options.cells.map((c, i) => new TableCell(this, i, c)));
    }

    groupHeader = false;
    attr = {}
    css = {}
    @observable isFocused = false;

    rowClicked(vm, event) {
        console.log(arguments);
    }
    cellClicked(vm: TableCell, event:Event) {
        console.log(arguments);
        location.hash = `/deck${vm.item.subscription}/resourcegroups/${vm.item.container}/${vm.item.name}`
    }
}
export class TableGrouping {
    groupBy = undefined;
}
export class TableModel {
    columns = ko.observableArray([]);
    rows = ko.observableArray([]);

    constructor(columns: Array<any>, rows: Array<Array<any>>) {
        this.columns(columns.map(d => new TableColumn(Object.assign({ table: this }, d))));
        this.rows(rows.map(d => new TableRow({ table: this, cells: d })));
    }
    @observable loading = false;


    contextMenu = new ContextMenu();
    isFireFox = false;
    isCheckPopulated = false;
    isRequired = false;
    balloonTextElemId = "a";
    isChecked = false;
    grouping = new TableGrouping();
    sorting = new Sorting();
}

export class Selection {
    @observable activation = false;
    @observable multiselect = false;
    @observable hiddenInCollapsed = false;

}
export class GridLayout extends KoLayout {


    @observable table;
    selection = new Selection();

    @observable isEmptyGrid = false;


    countMessage = "22 items";

    data = {
        balloonVisible: false,
        balloonId: "a",
        validationState: 1,
        dirty: false,
        focused: false,
        disabled: false,
    }

    constructor(private portalLayout: PortalLayout) {
        super({ name: i, as: "$grid" })

     
    }


}


export interface ListResourcesDeckLayoutOptions {
    app: PortalLayout
}

const ListResourcesDeckLayoutDefaults = {
    app: () => ioc("PortalLayout")
} as Factory<ListResourcesDeckLayoutOptions>;

@defaults(ListResourcesDeckLayoutDefaults)
export class ListResourcesDeckLayout extends SiDeckItemLayout {

    constructor(options?: ListResourcesDeckLayoutOptions) {
        super({ layout: options.app.deck, titleOptions: { title: "Pimetr Tables", subtitle: "Thanks for using Pimetr by EarthML.com" } });

        this.isMaximized = true;

        this.contentLayouts.push(new SiDeckItemContentLayout({ content: new GridLayout(options.app) }));
        //this.contentLayouts.push(new CreateNewMapContentLayout());
        //this.contentLayouts.push(new test());
        //this.contentLayouts.push(new test());
        //this.contentLayouts.push(new test());
        //this.contentLayouts.push(new test());
        //this.contentLayouts.push(new test());
        //this.contentLayouts.push(new test());
        //this.contentLayouts.push(new test());
    }

}

export default ListResourcesDeckLayout;