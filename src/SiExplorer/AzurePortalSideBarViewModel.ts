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
    allResourcesText?: string;
    showAllResourcesButton?: boolean;
    showNewResourcesButton?: boolean;

}
import { defaults, Factory } from "si-decorators";
const azurePortalSideBarViewModelOptionsDefaults: Factory<AzurePortalSideBarViewModelOptions> = {
    collapsed: ()=>false,
    favorites: ()=>undefined,
    allResourcesText: () => "All resources",
    showAllResourcesButton: () => true,
    showNewResourcesButton:()=>true,
}


@defaults(azurePortalSideBarViewModelOptionsDefaults, true)
export class AzurePortalSideBarViewModel {

    @observable collapsed: boolean;

    favorites: SideBarFavoritesViewModel

    @observable allResourcesText ;
    @observable showAllResourcesButton;

    buttons = ko.observableArray([]);

    constructor(options: AzurePortalSideBarViewModelOptions) {
        
    }


    toggleCollapsed() {
        this.collapsed = !this.collapsed;
    }


   

}

