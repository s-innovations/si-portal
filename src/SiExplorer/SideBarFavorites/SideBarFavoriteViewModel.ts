

import { defaults, Factory, observable } from "si-decorators";

export interface SideBarFavoriteViewModelOptions {
    opensExternal?: boolean | KnockoutObservable<boolean>;
    uri?: string | KnockoutObservable<boolean>;
    label: string | KnockoutObservable<string>;
}

const SideBarFavoriteViewModelOptionsDefaults: Factory<SideBarFavoriteViewModelOptions> = {
    opensExternal:()=> false,
    uri: ()=>"#",
    label: ()=>undefined,
};


@defaults(SideBarFavoriteViewModelOptionsDefaults, true)
export class SideBarFavoriteViewModel {

    opensExternal: KnockoutObservable<boolean>;
    uri: KnockoutObservable<string>;

    constructor(options: SideBarFavoriteViewModelOptions) {
       
    }
}
