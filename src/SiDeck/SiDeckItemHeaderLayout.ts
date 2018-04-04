


import * as ko from "knockout";
import { KoLayout, KnockoutTemplateBindingHandlerOptions } from "si-kolayout";

import { observable, propergate } from "si-decorators";

import * as SiDeckLayoutTemplate from "template!./templates/SiDeckItemHeaderLayoutTemplate.html";
import "css!./content/SiDeckItemHeaderLayout.less";

import { SiDeckItemLayout } from "./SiDeckItemLayout";
import { defaults, Factory } from "si-decorators";


import "css!./content/SiDeckItemEditableTitle.less";


export interface SiDeckItemHeaderLayoutOptions {
    title?: string;
    subtitle?: string;
    layout: SiDeckItemLayout;
}

const SiDeckItemHeaderLayoutDefaults: Factory<Partial<SiDeckItemHeaderLayoutOptions>> = {
    title: () => "My Dummy Title",
    subtitle: () => undefined,
}





@defaults(SiDeckItemHeaderLayoutDefaults, true)
export class SiDeckItemHeaderLayout extends KoLayout {

    @observable title: string;
    @observable subtitle: string;

    layout: SiDeckItemLayout;

    width = "154px";

    constructor(protected attributes: SiDeckItemHeaderLayoutOptions) {
        super(
            {
                name: SiDeckLayoutTemplate,
                as: "$SiDeckItemHeaderLayout"
            } as KnockoutTemplateBindingHandlerOptions);


    }

    @propergate(function (this: SiDeckItemHeaderLayout) { return this.attributes.layout })
    close(item: SiDeckItemHeaderLayout, event: MouseEvent) {

    };
}

