
                                                               

import * as ko from "knockout";
import { KoLayout, KnockoutTemplateBindingHandlerOptions } from "si-kolayout";
import { defaults, Factory } from "si-decorators";
//import { WithDefaultProperties } from "Utils/WithDefaultProperties";
import { WithKoClasses, ClassHandlingExtensionConstructable, ClassHandlingExtension } from "../Utils/KoLayout/WithKoClasses";
import { SiDashboardItemLayout } from "./SiDashboardItemLayout";

import * as SiDashboardItemActionBarContainerLayoutTemplate from "template!./templates/SiDashboardItemActionBarContainerLayoutTemplate.html";



export interface SiDashboardItemActionBarContainerLayoutOptions {
    tileLayout: SiDashboardItemLayout;
}

const SiDashboardItemActionBarContainerLayoutDefaults = {
    tileLayout:()=> undefined
} as Factory<SiDashboardItemActionBarContainerLayoutOptions>;

@defaults(SiDashboardItemActionBarContainerLayoutDefaults, true)
export class SiDashboardItemActionBarContainerLayout extends WithKoClasses( KoLayout ) {

    tileLayout: SiDashboardItemLayout;

    _actionsForUi = ko.observableArray([]);
    fxContextMenuItemTemplate = "";
    afterRender() {

    }
    orderedMenuItemsCommands = ko.observableArray([]);
    orderedMenuItems = ko.observableArray([]);

    constructor(opt?: SiDashboardItemActionBarContainerLayoutOptions) {
        super({
            name: SiDashboardItemActionBarContainerLayoutTemplate,
            as: "$SiDashboardItemActionBarContainerLayout"
        });

    }

    className = "dummy";

    _click(container: this, mouseEvent: Event) {
       
        mouseEvent.preventDefault();
        mouseEvent.stopPropagation();

        this.tileLayout.close(mouseEvent);

    }
    openTile() {
        this.tileLayout.configure();
    }

    command= {icon:()=>""}
     

    get handleVisible() {
        console.log([this.tileLayout.selected ,this.tileLayout.selectedFromHover() ,this.tileLayout.dragging]);
        return (this.tileLayout.selected || this.tileLayout.selectedFromHover() || this.tileLayout.dragging) ? 'visible' : 'hidden';
    }

    protected onMouseDown(evt: Event) {
       
        //  this.draggable(true);
        //  this.tileLayout.dragHandler().draggie.dragStart.apply(this.tileLayout.dragHandler().draggie._dragStart, [arguments[1],arguments[2]]);
    }
}

export default SiDashboardItemActionBarContainerLayout;

