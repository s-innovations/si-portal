

import * as SiDashboardItemLayoutTemplate from "template!./templates/SiDashboardItemLayoutTemplate.html";
import * as ko from "knockout";
import { IKoLayout, KoLayout, KnockoutTemplateBindingHandlerOptions } from "si-kolayout";

//import { WithDefaultProperties } from "Utils/WithDefaultProperties";
import { observable, subscribe, computed } from "si-decorators";

import throttle from "../Utils/throttle";
import isDefined from "../Utils/isDefined";
import { WithKoClasses, ClassHandlingExtension, ClassHandlingExtensionConstructable } from "../Utils/KoLayout/WithKoClasses";


import { SiDashboardLayout } from "./SiDashboardLayout";
import { SiDashboardItemActionBarContainerLayout } from "./SiDashboardItemActionBarContainerLayout";
import { Coords, CoordsModel } from "./Coords";
import { collesions } from "./Collesions";
import Draggabilly = require("draggabilly");

import { SiDeckItemLayout } from "../SiDeck/SiDeckItemLayout";
import { SiDeckItemContentLayout } from "../SiDeck/SiDeckItemContentLayout";
import { defaults, Factory } from "si-decorators";
import { ioc } from "si-dependency-injection";

import "css!./content/dashboard.less";
import "../../Utils/Draggabilly/DraggabillyBindingHandler";


export interface TileModel{
    id: string;
    left: number;
    top: number; width: number;
    height: number;
    tileSize: string;
    content: string;
    
}


export interface SiDashboardItemLayoutOptions {
    flowLayout: SiDashboardLayout,
    coords?: Coords;
}
export interface ContentClickable extends IKoLayout {
    contentClicked(): void;
}
function isContentClickable(content: IKoLayout) : content is ContentClickable {
    return content && "contentClicked" in content;
}

const SiDashboardItemLayoutDefaults: Factory<Partial<SiDashboardItemLayoutOptions> & Partial<TileModel>> = {
    left:()=> 0,
    top: ()=>0,
    tileSize:()=> "si-tilesize-normal",
    width:()=> undefined,
    height: ()=>undefined,
    coords: ()=>undefined
}

const timeout = ms => new Promise(res => setTimeout(res, ms))

@defaults(SiDashboardItemLayoutDefaults, true)
export class SiDashboardItemLayout extends WithKoClasses( KoLayout)  {

    flowLayout: SiDashboardLayout;
    tileActionBar: SiDashboardItemActionBarContainerLayout;

    @observable content: IKoLayout = null;
   
    @observable left: number;
    @observable top: number;
    @observable height: number;
    @observable width: number;
    @observable tileSize: string;

    @observable loading = true;
    
    @observable get resizable() { return this.tileSize === "si-tilesize-custom" };  

    @observable dragging = false;
    @observable selected = false;

    @observable get style() {
       
        return {
            left: this.left + 'px',
            top: this.top + 'px',
            width: this.resizable ? this.width + "px" : null,
            height: this.resizable ? this.height + "px" : null,
        };  
    }

    toJSON() {
        
        return {
            id: this.opt.id,
            content: this.opt.content,
            height: this.height,
            width: this.width,
            left: this.left,
            tileSize: this.tileSize,
            top: this.top
        } as TileModel;
    }
    remove() {
        this.flowLayout.removeTile(this);
    }

    contentClicked() {

        if (isContentClickable(this.content)) {
            this.content.contentClicked();
        } else {

            this.redirect();
                  

        }
    }
    redirect() {
        let path = this.opt.content;

        if (!path.startsWith("/")) {
            path = "/firstmap";
        }

        location.hash = "/deck" + path;
    }

    @observable private coords: Coords;

    setCoords(v: Coords) { this.coords = v; }       
    selectedFromHover = ko.observable(false).extend({ rateLimit: 500 });
                                
    constructor(private opt?: SiDashboardItemLayoutOptions & Partial<TileModel>) {
        super( {
            name: SiDashboardItemLayoutTemplate,
            as: "$SiDashboardItemLayout",
            afterRender : ()=>this.rendered()
        } as KnockoutTemplateBindingHandlerOptions);
                
                
        this.registerClass(()=>this.tileSize);
        this.registerClass(() => this.selectedFromHover() ? "si-tile-selectedfromhover" : "");
        this.registerClass(() => this.selected ? "si-tile-selected" : "");

        this.tileActionBar = new SiDashboardItemActionBarContainerLayout({
            tileLayout: this
        });

        this.flowLayout = opt.flowLayout;
 
         

        subscribe(() => this.selected,v => {
            if (v) {
                this.flowLayout.selectedItems.push(this);
            } else if (isDefined(v)) {
                this.flowLayout.selectedItems.remove(this);
            }    
        });

       

        
    }

    async rendered() {

        
    }

    private collesion_api: collesions;
    dragHandler = ko.computed({
        read: () => {
            return {
                if: ko.computed(() => this.selectedFromHover() || this.selected),
                dragOptions: this.flowLayout.dragOptions,
                draggie: null as Draggabilly,
                onDragStart: () => {
                    this.selected = true;
                    this.flowLayout.inEditMode = true;
                     
                    this.flowLayout.generate_faux_grid(15, 30);
                   
                    this.collesion_api = new collesions(this.coords.update(), this.flowLayout.faux_grid);
                },
                onDragEnd: () => {

                    var pos = this.dragHandler().draggie.position; 
                    this.left = -Infinity;
                    this.left = Math.round(pos.x / 90 + 0.0) * 90;
                    this.top = -Infinity;                      
                    this.top = Math.round(pos.y / 90 + 0.0) * 90;

                    this.selected = false;
     
                },
                onDragMove: throttle(() => {

                    var pos = this.dragHandler().draggie.position;
                    let posX = Math.round(pos.x / 90+0.0) * 90;
                    let posY = Math.round(pos.y / 90 + 0.0) * 90;

                    let e = this.collesion_api.find_collisions({
                        left: posX,
                        top: posY,
                    });
                   
                    let coord = this.coords.get();
                    this.flowLayout.dropPlacementStyle = { left: posX + "px", top: posY + "px", width: coord.width + "px", height: coord.height + "px" };
                    this.flowLayout.setContainerHeight(pos.y + this.coords.get().height);
                }, 100)
            }
        }, deferEvaluation: true
    });

    getTop() {
        var coords = this.coords.update().get();
        var draggie = this.dragHandler().draggie;
        var dragTop = draggie ? draggie.position.y : coords.y1;

        return coords.height + dragTop;
    }

    onMouseOver() {
        this.selectedFromHover(true);
    }
    onMouseOut() {
        this.selectedFromHover(false);
    }

    
     
    onResizeStart(vm: any, event: MouseEvent) {
        let flowLayout = this.flowLayout;
        let coords = this.coords.get();
        let content = this.content;
       
       

        let pane = coords.el as HTMLElement;
       
        pane.classList.add("resizing");

        this.selected = true;
        this.flowLayout.inEditMode = true;
        this.flowLayout.generate_faux_grid(15, 30);          
        let collesion_api =  new collesions(this.coords.update(), this.flowLayout.faux_grid);


        let b: ClientRect;
        let x: number;
        let y: number;
        let redraw = false;


        function calc(e: MouseEvent) {
            b = pane.getBoundingClientRect();
            x = e.clientX - b.left;
            y = e.clientY - b.top;

            //onTopEdge = y < MARGINS;
            //onLeftEdge = x < MARGINS;
            //onRightEdge = x >= b.width - MARGINS;
            //onBottomEdge = y >= b.height - MARGINS;

            //  rightScreenEdge = window.innerWidth - MARGINS;
            // bottomScreenEdge = window.innerHeight - MARGINS;
        }


        calc(event);

        let clicked = {
            isResizing: true,
            x: x,
            y: y,
            cx: event.clientX,
            cy: event.clientY,
            w: b.width,
            h: b.height,
           
        };

        let kill = false;
        let self = this;
        function animate() {
            if (!kill) {
                requestAnimationFrame(animate);
            }

            if (!redraw) return;

            redraw = false;

            if (clicked && clicked.isResizing) {
                //pane.style.width = x + "px";
                //pane.style.height = y + "px";
                self.width = x;
                self.height = y;

                          
                

                let e = collesion_api.find_collisions({
                    left: pane.offsetLeft,
                    top: pane.offsetTop,
                    width: x,
                    height:y,
                });

                flowLayout.dropPlacementStyle = { left: pane.offsetLeft + "px", top: pane.offsetTop + "px", width: (Math.round(x / 90 + 0.25) * 90) - 5 + "px", height: (Math.round(y / 90 + 0.25) * 90)-5 + "px" };
                
                return;
            }
        }

        animate();

        let e: MouseEvent;

        let onMove = (ee: MouseEvent) => {

            calc(ee);

            e = ee;

            redraw = true;

            ////let now = [ancor.offsetLeft, ancor.offsetTop];
            ////let deltaX = now[0] - this.prev_evt[0];
            ////let deltaY = now[1] - this.prev_evt[1];

            ////let htmlEl = coords.el as HTMLElement;
            ////htmlEl.style.width = (coords.width + deltaX) + "px";
            ////htmlEl.style.height = (coords.height + deltaY) + "px";
            ////console.log([deltaX, deltaY]);
        }


        let onEnd = () => {
            document.removeEventListener("mouseup", onEnd);
            document.removeEventListener("mousemove", onMove);                
            kill = true;
            pane.classList.remove("resizing");

           // flowLayout.dropPlacementStyle = null;
           // this.flowLayout.inEditMode = false;

            //pane.style.width = Math.round(x / 90 + 0.25) * 90-5 + "px";
            //pane.style.height = Math.round(y / 90 + 0.25) * 90 - 5 + "px";
            this.width = Math.round(x / 90 + 0.25) * 90 - 5;
            this.height = Math.round(y / 90 + 0.25) * 90 - 5;
            this.coords.update();

            this.selected = false;
        };
        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onEnd);

    }
    onResizeEnd(vm: any, event: MouseEvent) {
        
    }
}

export default SiDashboardItemLayout;