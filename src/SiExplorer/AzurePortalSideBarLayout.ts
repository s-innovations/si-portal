
import * as ko from "knockout";
import { KoLayout } from "si-kolayout";
import { observable }from "si-decorators";

import { AzurePortalSideBarViewModel, AzurePortalSideBarViewModelOptions } from "./AzurePortalSideBarViewModel";
import { SideBarFavoritesViewModel, SideBarFavoritesViewModelOptions } from "./SideBarFavorites/SideBarFavoritesViewModel";
import { AzurePortalSideBarFavoritesLayout } from "./AzurePortalSideBarFavoritesLayout";

import * as sidebarTemplate from "template!./templates/sidebarTemplate.html";
import "css!./content/si-sidebar.less";

export interface AzurePortalSideBarLayoutOptions {
    collapsed?: boolean | KnockoutObservable<boolean>;
    favorites?: SideBarFavoritesViewModel | SideBarFavoritesViewModelOptions;
    allResourcesText?:string;
}

export class AzurePortalSideBarLayout  extends KoLayout {


    vm: AzurePortalSideBarViewModel;
    favoritesLayout: AzurePortalSideBarFavoritesLayout;

    constructor(private layoutOptions: AzurePortalSideBarLayoutOptions) {
        super(
            {
                name: sidebarTemplate,
                as: "$AzurePortalSideBarLayout"
            });
        var sideBarFavoritesViewModel = new SideBarFavoritesViewModel(layoutOptions.favorites);
        this.vm = new AzurePortalSideBarViewModel({
            collapsed: layoutOptions.collapsed,
            favorites: sideBarFavoritesViewModel,
            allResourcesText:layoutOptions.allResourcesText
        });
        this.favoritesLayout = new AzurePortalSideBarFavoritesLayout({ sideBarFavoritesViewModel: sideBarFavoritesViewModel });
    }


    createNew(vm: any, event: Event) {
        
    }
    

    showResources(vm: this, event: Event) {

    }

}