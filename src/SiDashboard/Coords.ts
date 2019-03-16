
 
 
 
import * as ko from "knockout";
 
import isDefined from "../Utils/isDefined";
 
export interface CoordsModel {
    x1?: number; x2?: number; y1?: number; y2?: number; cx?: number; cy?: number; width?: number; height?: number; el?: Element;
}

 
export interface objPosition{

    left: number;
    top: number;
    width: number;
    height: number;

    x1?: number;
    y1?: number;

    col?: number;
    row?: number,
    original_col?: number,
    original_row?: number
}

function isObjPosition(obj: any): obj is objPosition {
    
    return obj && obj !== null && typeof obj === 'object'
}

function findoffset(elt: Element) {
    var rect = elt.getBoundingClientRect(), bodyElt = document.body;
    
    return {
        top: rect.top + bodyElt.scrollTop,
        left: rect.left + bodyElt.scrollLeft,
        width: null as number, height: null as number,
    }
}

export class Coords {

    private original_coords: CoordsModel;
    private isCoords = true;
    private coords: CoordsModel = {};
    private el: HTMLElement;
    private data: objPosition;


    constructor(opt: { el?: HTMLElement; data?: objPosition }) {
        this.el = opt.el;
        this.data = opt.data;
        this.init();

    }

    init() {

        this.set();
        this.original_coords = this.get();
    }

    set(update?: boolean, not_update_offsets?: boolean) {
        var el = this.el;

        if (el && !update) {

            this.data = findoffset(el);  
            this.data.width = el.offsetWidth;
            this.data.height = el.offsetHeight;

        }

        if (el && update && !not_update_offsets) {
            var offset = findoffset(el);
            this.data.top = offset.top;
            this.data.left = offset.left;
            this.data.width = el.offsetWidth;
            this.data.height = el.offsetHeight;
        }

        var d = this.data;

        typeof d.left === 'undefined' && (d.left = d.x1);
        typeof d.top === 'undefined' && (d.top = d.y1);

        this.coords.x1 = d.left;
        this.coords.y1 = d.top;
        this.coords.x2 = d.left + d.width;
        this.coords.y2 = d.top + d.height;
        this.coords.cx = d.left + (d.width / 2);
        this.coords.cy = d.top + (d.height / 2);
        this.coords.width = d.width;
        this.coords.height = d.height;
        this.coords.el = el || null;

        return this;
    };

    update(data?: Partial<objPosition> ) {
        if (!data && !this.el) {
            return this;
        }

        if (data) {
            var new_data = Object.assign({}, this.data, data);
            this.data = new_data;
            return this.set(true, true);
        }

        this.set(true);
        return this;
    };

    get() {
        return this.coords;
    };
    destroy() {
        //  this.el.removeData('coords');
        delete this.el;
    };
}


ko.bindingHandlers.setCoords = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {


        var prop = valueAccessor() as string;
        var coordsInstance = viewModel[prop] as Coords;
        if (!isDefined(coordsInstance)) {
            viewModel[prop] = new Coords({ el: element });
        }


    },
    update: function (element: HTMLElement, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {


        //   var coords = ko.utils.unwrapObservable<coords>(valueAccessor());


    }
}





export default Coords;