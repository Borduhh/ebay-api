import {
    Buy, Browse, Feed, BuyMarketing, Offer, Order,
    Commerce, Catalog, Identity, Taxonomy, Translation,
    Developer, DeveloperAnalytics,
    Sell, Account, SellAnalytics, Compliance, Fulfillment, Inventory, SellMarketing, Metadata, Recommendation
} from './restful';

import Traditional, {ClientAlerts, Finding, Shopping, Trading} from './traditional';
import {Auth, Settings} from '../types';
import Api from './restful/api';

export default class Factory {
    readonly settings: Settings;

    private _traditional?: Traditional;
    readonly auth: Auth;

    constructor(settings: Settings, auth: Auth) {
        this.settings = settings;
        this.auth = auth;
    }

    createBuyApi(): Buy {
        return {
            browse: this.createApi(Browse),
            feed: this.createApi(Feed),
            marketing: this.createApi(BuyMarketing),
            offer: this.createApi(Offer),
            order: this.createApi(Order)
        };
    }

    createCommerceApi(): Commerce {
        return {
            catalog: this.createApi(Catalog),
            identity: this.createApi(Identity),
            taxonomy: this.createApi(Taxonomy),
            translation: this.createApi(Translation)
        };
    }

    createDeveloperApi(): Developer {
        return {
            analytics: this.createApi(DeveloperAnalytics)
        };
    }

    createSellApi(): Sell {
        return {
            account: this.createApi(Account),
            analytics: this.createApi(SellAnalytics),
            compliance: this.createApi(Compliance),
            fulfillment: this.createApi(Fulfillment),
            inventory: this.createApi(Inventory),
            marketing: this.createApi(SellMarketing),
            metadata: this.createApi(Metadata),
            recommendation: this.createApi(Recommendation)
        };
    }

    // Traditional

    get traditional() {
        return this._traditional || (this._traditional = new Traditional(this.settings, this.auth));
    }

    createTradingApi(): Trading {
        return this.traditional.createTradingApi();
    }

    createShoppingApi(): Shopping {
        return this.traditional.createShoppingApi();
    }

    createFindingApi(): Finding {
        return this.traditional.createFindingApi();
    }

    createClientAlertsApi(): ClientAlerts {
        return this.traditional.createClientAlertsApi();
    }

    private createApi<T extends Api>(ApiClass: new (auth: Auth) => T): T {
        return new ApiClass(this.auth);
    }
}

