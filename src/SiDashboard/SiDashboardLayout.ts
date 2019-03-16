
import * as ko from "knockout";
import { KoLayout, KnockoutTemplateBindingHandlerOptions } from "si-kolayout";


 
import { observable, subscribe } from "si-decorators";
import isDefined from "../Utils/isDefined";

import { SiDashboardItemLayout, TileModel } from "./SiDashboardItemLayout";
import { Coords } from "./Coords";

import * as SiDashboardLayoutTemplate from "template!./templates/SiDashboardLayoutTemplate.html";
import { defaults, Factory } from "si-decorators";


export interface SiDashboardOptions {
    tiles: any[];
    inEditMode: boolean | KnockoutObservable<boolean>;
}

const SiDashboardDefaults = { inEditMode: () => false, minContainerHeight: () => 350, containerHeight: () => 350 };


@defaults(SiDashboardDefaults, true, false)
export class SiDashboardLayout extends KoLayout {
   
  //  private itemTemplateName = "siTileTemplate";
    items: KnockoutObservableArray<SiDashboardItemLayout> = ko.observableArray([]);
    removedItems = ko.observableArray<SiDashboardItemLayout>([]);
    selectedItems = ko.observableArray<SiDashboardItemLayout>([]);

    @observable inEditMode: boolean;

    @observable private containerHeight: number
    @observable private minContainerHeight: number

    collision_api: any;

    toJSON() {
        return this.items().map(k => k.toJSON());
    }

    initializeDefaults() {
       


        if (isDefined(this.attributes.tiles)) {

            for (let i in this.attributes.tiles) {
                var tileModel = this.attributes.tiles[i];
                this.items.push(new SiDashboardItemLayout(Object.assign({}, {
                    flowLayout: this
                }, tileModel)));
            }
        }

        subscribe(() => this.inEditMode, (v) => {
            if (!v) {
                let items = this.items();
                for (var i in items)
                    items[i].selected = false;


            }


        });


        this.selectedItems.subscribe((changes) => {
            var old = this.selectedItems();
            var added = [] as any[];
            changes.forEach((change => {

                if (change.status === 'added') {

                    added.push(change.value);

                } else if (change.status === "deleted") {


                }

            }));
            if (added.length) {
                for (let i in old) {
                    if (added[0] !== old[i]) {
                        old[i].selected = false;
                    }
                }
            }

        }, null, "arrayChange");
    }

    constructor(private attributes?: SiDashboardOptions) {
        super({
            name: SiDashboardLayoutTemplate
        });  
    }
    addTile(tile: Partial<TileModel>): SiDashboardItemLayout
    addTile(...tiles: Partial<TileModel>[]): SiDashboardItemLayout[]
    addTile(...tileModels: Partial<TileModel>[]) {
        let models =tileModels.map(tileModel => new SiDashboardItemLayout(Object.assign({}, {
            flowLayout: this
        }, tileModel)));

        this.items.push(...models);
        if (models.length === 1)
            return models[0];
        return models;
    }
    removeTile(item: SiDashboardItemLayout) {
        this.items.remove(item);
        this.removedItems.push(item);
        this.dropPlacementStyle = null;
        this.inEditMode = true;
    }

    setContainerHeight(height: number) {
        var heightReduced = this.items().reduce<number>((p, c, i, arr) => Math.max(p, c.getTop()), height);
      
        this.containerHeight = heightReduced;
    }


    @observable dropPlacementStyle = null as any;

    dragOptions = {
       // grid: [90, 90],
        handle: '.si-tile-actionbar'
        // options...
    }
    faux_grid: any;
    gridmap: any;

    generate_faux_grid_for_items() {
        let grid = [];
       
        for (let item of this.items()) {
          
            let cc = item.left / this.min_widget_width + Math.round(item.width / this.min_widget_width);
            let rr = item.top / this.min_widget_height + Math.round(item.height / this.min_widget_height);
            for (let c = item.left / this.min_widget_width; c < cc; c++) {
                for (let r = item.top / this.min_widget_height; r < rr; r++) {
                   
                    this.add_faux_cell(r+1, c+1, grid);
                }
            }
        }
        return grid;
    }
    generate_faux_grid(rows: number, cols: number) {
        this.faux_grid = [];
        this.gridmap = [];
        var col;
        var row;
        for (col = cols; col > 0; col--) {
            this.gridmap[col] = [];
            for (row = rows; row > 0; row--) {
                this.add_faux_cell(row, col, this.faux_grid, this.gridmap);
            }
        }
        return this.faux_grid;
    };
    baseX = 0;
    baseY = 0;
    min_widget_width = 90;
    min_widget_height = 90;
    add_faux_cell(row: number, col: number,grid,gridmap=null) {
      
        let c = new Coords({
            data: {
                left: this.baseX + ((col - 1) * this.min_widget_width),
                top: this.baseY + (row - 1) * this.min_widget_height,
                width: this.min_widget_width,
                height: this.min_widget_height,
                col: col,
                row: row,
                original_col: col,
                original_row: row
            }
        });
       

        if (gridmap) {
            if (!Array.isArray(this.gridmap[col])) {
                gridmap[col] = [];
            }

            gridmap[col][row] = false;
        }
        grid.push(c);

        return this;
    };

    //  editable = ko.observable(false);
}

export default SiDashboardLayout;