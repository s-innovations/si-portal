
import * as ko from "knockout";
import { setDefaultProperties, constructorMapper } from "../../Utils/WithDefaultProperties";  
import { SideBarFavoriteViewModel, SideBarFavoriteViewModelOptions } from "./SideBarFavoriteViewModel";
import { defaults, Factory,observable } from "si-decorators";

export interface SideBarFavoritesViewModelOptions {
    favorites?: Array<SideBarFavoriteViewModelOptions | SideBarFavoriteViewModel> | KnockoutObservableArray<SideBarFavoriteViewModel>;
}
const sideBarFavoritesViewModelDefaults: SideBarFavoritesViewModelOptions = {
    favorites: []
}
const mappers = {
    favorites: constructorMapper((o: SideBarFavoriteViewModel | SideBarFavoriteViewModelOptions): o is SideBarFavoriteViewModel => o instanceof SideBarFavoriteViewModel, SideBarFavoriteViewModel)
}


export class SideBarFavoritesViewModel {

    favorites: KnockoutObservableArray<SideBarFavoriteViewModel>;

    constructor(options: SideBarFavoritesViewModelOptions = {}) {
        setDefaultProperties(this, options, sideBarFavoritesViewModelDefaults, mappers);
    }



}

