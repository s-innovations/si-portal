

import { Coords, CoordsModel, objPosition } from "./Coords";
 
 

const defaults = {
    colliders_context: document.body,
    overlapping_region: 'C'
    // ,on_overlap: function(collider_data){},
    // on_overlap_start : function(collider_data){},
    // on_overlap_stop : function(collider_data){}
};

interface collider {
    getCoords(): Coords;
}

export interface collesionsOptions {
    colliders_context: Element,
    overlapping_region: string;
    on_overlap?: Function;
    on_overlap_start?: Function
    on_overlap_stop?: Function
}
export class collesions {

    private player: Coords;
    private options: collesionsOptions;
    private last_colliders = [] as collider[];
    private last_colliders_coords = [] as Coords[];
    private colliders: Coords[];
    //   $colliders;

    constructor(el: Coords, colliders: Coords[], options?: collesionsOptions) {
        this.options = Object.assign({}, defaults, options || {});
        this.player = el;
        this.colliders = colliders;

        this.init();
    }

    private init() {
        this.find_collisions();
    };
    private overlaps(a: CoordsModel, b: CoordsModel) {

       
        var x = false;
        var y = false;

        if ((b.x1 >= a.x1 && b.x1 <= a.x2) ||
            (b.x2 > a.x1 && b.x2 <= a.x2) ||
            (a.x1 >= b.x1 && a.x2 <= b.x2)
        ) { x = true; }

        if ((b.y1 >= a.y1 && b.y1 <= a.y2) ||
            (b.y2 > a.y1 && b.y2 <= a.y2) ||
            (a.y1 >= b.y1 && a.y2 <= b.y2)
        ) { y = true; }
        //if (x && y) {
            
        //    b.x1 >= a.x1 && b.x1 <= a.x2 && console.log(`b.x1 >= a.x1 && b.x1 <= a.x2      ${b.x1} >= ${a.x1} && ${b.x1} <= ${a.x2}      ${b.x1 >= a.x1 && b.x1 <= a.x2}`)
        //    b.x2 >= a.x1 && b.x2 <= a.x2 && console.log(`b.x2 >= a.x1 && b.x2 <= a.x2      ${b.x2} >= ${a.x1} && ${b.x2} <= ${a.x2}      ${b.x2 >= a.x1 && b.x2 <= a.x2}`)
        //    a.x1 >= b.x1 && a.x2 <= b.x2 && console.log(`a.x1 >= b.x1 && a.x2 <= b.x2      ${a.x1} >= ${b.x1} && ${a.x2} <= ${b.x2}      ${a.x1 >= b.x1 && a.x2 <= b.x2}`)

        //    b.y1 >= a.y1 && b.y1 <= a.y2 && console.log(`b.y1 >= a.y1 && b.y1 <= a.y2      ${b.y1} >= ${a.y1} && ${b.y1} <= ${a.y2}      ${b.y1 >= a.y1 && b.y1 <= a.y2}`)
        //    b.y2 >= a.y1 && b.y2 <= a.y2 && console.log(`b.y2 >= a.y1 && b.y2 <= a.y2      ${b.y2} >= ${a.y1} && ${b.y2} <= ${a.y2}      ${b.y2 >= a.y1 && b.y2 <= a.y2}`)
        //    a.y1 >= b.y1 && a.y2 <= b.y2 && console.log(`a.y1 >= b.y1 && a.y2 <= b.y2      ${a.y1} >= ${b.y1} && ${a.y2} <= ${b.y2}      ${a.y1 >= b.y1 && a.y2 <= b.y2}`)
        //    console.log('----------------------------')
        //}
        return (x && y);

    }
    private detect_overlapping_region(a: CoordsModel, b: CoordsModel) {
        var regionX = '';
        var regionY = '';

        if (a.y1 > b.cy && a.y1 < b.y2) { regionX = 'N'; }
        if (a.y2 > b.y1 && a.y2 < b.cy) { regionX = 'S'; }
        if (a.x1 > b.cx && a.x1 < b.x2) { regionY = 'W'; }
        if (a.x2 > b.x1 && a.x2 < b.cx) { regionY = 'E'; }

        return (regionX + regionY) || 'C';
    };

    private calculate_overlapped_area_coords(a: CoordsModel, b: CoordsModel) {
        var x1 = Math.max(a.x1, b.x1);
        var y1 = Math.max(a.y1, b.y1);
        var x2 = Math.min(a.x2, b.x2);
        var y2 = Math.min(a.y2, b.y2);

        return new Coords({
            data: {
                left: x1,
                top: y1,
                width: (x2 - x1),
                height: (y2 - y1)
            }
        }).get();
    };

    private calculate_overlapped_area(coords: CoordsModel) {
        return (coords.width * coords.height);
    };

    manage_colliders_start_stop(new_colliders_coords: any[], start_callback: Function, stop_callback: Function) {
        var last = this.last_colliders_coords;

        for (var i = 0, il = last.length; i < il; i++) {

            if (new_colliders_coords.indexOf(last[i]) === -1) {
                start_callback.call(this, last[i]);
            }
        }

        for (var j = 0, jl = new_colliders_coords.length; j < jl; j++) {
            if (last.indexOf(new_colliders_coords[j]) === -1) {
                stop_callback.call(this, new_colliders_coords[j]);
            }

        }
    };

    find_collisions(player_data_coords?: Partial<objPosition>) {
        var self = this;
        var overlapping_region = this.options.overlapping_region;
        var colliders_coords = [];
        var colliders_data = [];
        var $colliders = (this.colliders);
        var count = $colliders.length;
        var player_coords = self.player
            .update(player_data_coords || null).get();
        
     //   console.log(player_coords)

        while (count--) {
            var $collider = $colliders[count];
            var $collider_coords_ins = $collider;
            var collider_coords = $collider_coords_ins.get();
           
        
            var overlaps = self.overlaps(player_coords, collider_coords);

            if (!overlaps) {
                continue;
            }
         //   console.log(collider_coords);
          //  console.log('---------')

            var region = self.detect_overlapping_region(
                player_coords, collider_coords);

            //todo: make this an option
            if (region === overlapping_region || overlapping_region === 'all') {

                var area_coords = self.calculate_overlapped_area_coords(
                    player_coords, collider_coords);
                var area = self.calculate_overlapped_area(area_coords);
                var collider_data = {
                    area: area,
                    area_coords: area_coords,
                    region: region,
                    coords: collider_coords,
                    player_coords: player_coords,
                    el: $collider
                };

                if (self.options.on_overlap) {
                    self.options.on_overlap.call(this, collider_data);
                }
                colliders_coords.push($collider_coords_ins);
                colliders_data.push(collider_data);
            }
        }

        if (self.options.on_overlap_stop || self.options.on_overlap_start) {
            this.manage_colliders_start_stop(colliders_coords,
                self.options.on_overlap_start, self.options.on_overlap_stop);
        }

        this.last_colliders_coords = colliders_coords;

        return colliders_data;
    };

    get_closest_colliders(player_data_coords: Partial<objPosition>) {
        var colliders = this.find_collisions(player_data_coords);

        colliders.sort(function (a, b) {
            /* if colliders are being overlapped by the "C" (center) region,
             * we have to set a lower index in the array to which they are placed
             * above in the grid. */
            if (a.region === 'C' && b.region === 'C') {
                if (a.coords.y1 < b.coords.y1 || a.coords.x1 < b.coords.x1) {
                    return - 1;
                } else {
                    return 1;
                }
            }

            if (a.area < b.area) {
                return 1;
            }

            return 1;
        });
        return colliders;
    };


    set_colliders(colliders: Coords[]) {
        this.colliders = colliders;
    }

}
 