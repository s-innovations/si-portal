


import * as ko from "knockout";
import { KoLayout, IKoLayout, KnockoutTemplateBindingHandlerOptions } from "si-kolayout";

 

import * as SiDeckItemContentLayoutTemplate from "template!./templates/SiDeckItemContentLayoutTemplate.html";
import "css!./content/SiDeckItemContentLayout.less";
import { JSXLayout,KnockoutJsxFactory } from "si-kolayout-jsx";
import { defaults, Factory, observable } from "si-decorators";


export interface SiDeckItemContentLayoutOptions<T extends IKoLayout> {
    deckSize?: string;
    deckStyle?: string;
    content?: T;
}

const SiDeckItemContentLayoutDefaults = {
    deckSize: () => "" ,
    deckStyle: () => "default"

} as Factory<SiDeckItemContentLayoutOptions<any>>;


function templateFactory(options: SiDeckItemContentLayoutOptions<any>) {
    return (
        
        <div class={`si-deck-item-content si-deck-item-content-${options.deckStyle} ${options.deckSize}`}>
            <div class="si-deck-item-content-wrapper">
                    <ko layout="contentLayout"></ko>
            </div>
        </div>
    );
}


@defaults(SiDeckItemContentLayoutDefaults)
export class SiDeckItemContentLayout<T extends IKoLayout> extends KoLayout {


    @observable contentLayout: T;   

    constructor(options: SiDeckItemContentLayoutOptions<T> = {}) {
        super(
            {
                nodes: [templateFactory(options)],
                as: "$SiDeckItemContentLayout"

            } as KnockoutTemplateBindingHandlerOptions);

        this.contentLayout = options.content;

    }

}

export class SiDeckItemSepratorLayout extends JSXLayout<any> {

    constructor() {
        super({}, <div class="splitter"></div>);
    }


    afterRender(elements: Array<HTMLElement>, model: any) {
        console.log(elements);
        let splitter = elements[0];
        let left = splitter.parentElement.querySelector(".si-deck-item-content") as HTMLElement;
        console.log(left);
        console.log(left.clientWidth);
        let startwidth = left.clientWidth;
        let minWidth = left.clientWidth;
        left.style.width = left.clientWidth + "px";
        let moving = false;
        let start = [0, 0];
        function moved(evt: MouseEvent) {
            let dx = start[0] - evt.clientX;
            left.style.width = Math.max(startwidth - dx, minWidth) + "px";
        }
        function end() {
            moving = false;
            document.removeEventListener("mousemove", moved);
            document.removeEventListener("mouseup", end);
        }
        splitter.addEventListener("mousedown", (evt) => {
            moving = true;
            console.log(evt.offsetX);
            start[0] = evt.clientX + 3-evt.offsetX;
            start[1] = evt.clientY;
            startwidth = left.clientWidth;
            document.addEventListener("mousemove", moved);
            document.addEventListener("mouseup", end);
        });
        
    }

    
}

