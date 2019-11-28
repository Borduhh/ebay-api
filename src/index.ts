import Factory from './api/factory';
import {EnvError} from './errors';
import {Buy} from './api/restful/buy';
import {Commerce} from './api/restful/commerce';
import {Developer} from './api/restful/developer';
import {Sell} from './api/restful/sell';
import {PostOrder} from './api/restful/postOrder';
import {AppConfig} from './types';
import {LimitedRequest, createRequest} from './utils/request';
import {ClientAlerts, Finding, Shopping, Trading} from './api/traditional/types';
import {SiteId, MarketplaceId} from './enums';
import Auth from './auth';

const defaultConfig = {
    sandbox: false,
    siteId: SiteId.EBAY_DE,
    marketplaceId: MarketplaceId.EBAY_DE
};

export default class eBayApi {
    static SiteId = SiteId;
    static MarketplaceId = MarketplaceId;

    readonly auth: Auth;
    readonly appConfig: AppConfig;
    readonly req: LimitedRequest;

    private readonly factory: Factory;

    // RESTful
    private _buy?: Buy;
    private _commerce?: Commerce;
    private _developer?: Developer;
    private _postOrder?: PostOrder;
    private _sell?: Sell;

    // Traditional
    private _trading?: Trading;
    private _finding?: Finding;
    private _shopping?: Shopping;
    private _clientAlerts?: ClientAlerts;

    /**
     * Loads settings from `process.env`
     *
     * @return {this}          a new Ebay instance
     * @param {request} req request
     * @throws {EnvError}
     */
    static fromEnv(req = createRequest()) {
        if (!process.env.EBAY_APP_ID) {
            throw new EnvError('EBAY_APP_ID');
        }
        if (!process.env.EBAY_CERT_ID) {
            throw new EnvError('EBAY_CERT_ID');
        }
        if (!process.env.EBAY_DEV_ID) {
            throw new EnvError('EBAY_DEV_ID');
        }

        return new eBayApi({
                appId: process.env.EBAY_APP_ID,
                certId: process.env.EBAY_CERT_ID,
                devId: process.env.EBAY_DEV_ID,
                authToken: process.env.EBAY_AUTH_TOKEN,
                siteId: process.env.EBAY_SITE_ID ? parseInt(process.env.EBAY_SITE_ID, 10) : SiteId.EBAY_DE,
                marketplaceId: process.env.EBAY_MARKETPLACE_ID && process.env.EBAY_MARKETPLACE_ID in MarketplaceId ?
                    <MarketplaceId>MarketplaceId[process.env.EBAY_MARKETPLACE_ID as keyof typeof MarketplaceId] :
                    MarketplaceId.EBAY_DE,
                ruName: process.env.EBAY_RU_NAME,
                sandbox: (process.env.EBAY_SANDBOX === 'true')
            },
            req);
    }

    /**
     * @param {Object}  config the global config
     * @param {LimitedRequest} req the request
     */
    constructor(config: AppConfig, req?: LimitedRequest) {
        this.appConfig = {...defaultConfig, ...config};
        this.req = req || createRequest(this.appConfig);

        this.auth = new Auth(
            this.appConfig,
            this.req
        );

        this.factory = new Factory(
            this.auth,
            this.req
        );
    }

    get buy(): Buy {
        return this._buy || (this._buy = this.factory.createBuyApi());
    }

    get commerce(): Commerce {
        return this._commerce || (this._commerce = this.factory.createCommerceApi());
    }

    get developer(): Developer {
        return this._developer || (this._developer = this.factory.createDeveloperApi());
    }

    get postOrder(): PostOrder {
        return this._postOrder || (this._postOrder = this.factory.createPostOrderApi());
    }

    get sell(): Sell {
        return this._sell || (this._sell = this.factory.createSellApi());
    }

    // Traditional
    get trading(): Trading {
        return this._trading || (this._trading = this.factory.createTradingApi());
    }

    get finding(): Finding {
        return this._finding || (this._finding = this.factory.createFindingApi());
    }

    get shopping(): Shopping {
        return this._shopping || (this._shopping = this.factory.createShoppingApi());
    }

    get clientAlerts(): ClientAlerts {
        return this._clientAlerts || (this._clientAlerts = this.factory.createClientAlertsApi());
    }
}

