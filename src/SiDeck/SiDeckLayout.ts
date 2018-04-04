


import * as ko from "knockout";
import { KoLayout, KnockoutTemplateBindingHandlerOptions } from "si-kolayout";

import { observable, subscribe } from "si-decorators";

import * as SiDeckLayoutTemplate from "template!./templates/SiDeckLayoutTemplate.html";
import "css!./content/SiDeckLayout.less";

import { SiDeckItemLayout } from "./SiDeckItemLayout";
import { SiDeckItemHeaderLayout } from "./SiDeckItemHeaderLayout";



export interface SiDeckLayoutOptions {

}

const SiTopBarLayoutDefaults = {

}



export class SiDeckLayout extends KoLayout {


    @observable item: SiDeckItemLayout;

    constructor(protected attributes: SiDeckLayoutOptions = {}) {
        super(
            {
                name: SiDeckLayoutTemplate,
                as: "$SiDeckLayout",
                if: ko.observable(false)
            } as KnockoutTemplateBindingHandlerOptions);

        subscribe(() => this.item, (v) => this.options.if(typeof v !== "undefined"));
    }


    closeItem(vm: SiDeckItemHeaderLayout, event: MouseEvent) {
        location.hash = "";
        this.item = undefined;


    }
}

