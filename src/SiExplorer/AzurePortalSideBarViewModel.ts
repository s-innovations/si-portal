import * as ko from "knockout";

import { SideBarFavoritesViewModel } from "./sideBarFavorites/SideBarFavoritesViewModel";
 
import { observable, subscribe } from "si-decorators";

export interface AzurePortalSideBarViewModelOptions {
    /**
     * flag setting if the sidebar is collapsed or open. 
     * If passed a observable, the sidebar will open and closed on changes.
     *
     */
    collapsed?: boolean | KnockoutObservable<boolean>;

    /**
     * The sidebar favorites viewmodel.
     */
    favorites: SideBarFavoritesViewModel;

}
import { defaults, Factory } from "si-decorators";
const azurePortalSideBarViewModelOptionsDefaults: Factory<AzurePortalSideBarViewModelOptions> = {
    collapsed: ()=>false,
    favorites: ()=>undefined
}


@defaults(azurePortalSideBarViewModelOptionsDefaults, true)
export class AzurePortalSideBarViewModel {

    @observable collapsed: boolean;

    favorites: SideBarFavoritesViewModel

    constructor(options: AzurePortalSideBarViewModelOptions) {
        
    }


    toggleCollapsed() {
        this.collapsed = !this.collapsed;
    }


   

}

