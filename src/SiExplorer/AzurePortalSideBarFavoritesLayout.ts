

import * as ko from "knockout";
import { KoLayout } from "si-kolayout";
import { observable } from "si-decorators";

import { SideBarFavoritesViewModel }from "./sideBarFavorites/SideBarFavoritesViewModel";


import * as AzurePortalSideBarFavoritesTemplate from "template!./templates/AzurePortalSideBarFavoritesTemplate.html";

export interface AzurePortalSideBarFavoritesLayoutOptions {
    sideBarFavoritesViewModel: SideBarFavoritesViewModel;
}

export class AzurePortalSideBarFavoritesLayout extends KoLayout {

    vm: SideBarFavoritesViewModel;

    constructor(options: AzurePortalSideBarFavoritesLayoutOptions) {
        super({
            name: AzurePortalSideBarFavoritesTemplate,            
            as: "$azurePortalSideBarFavoritesLayout",
        })

        this.vm = options.sideBarFavoritesViewModel;
    }

    
}

 