import Api from '../../api';
import {AppealRequest, BuyerCloseCaseRequest, CaseSearchParams, ReturnAddressRequest, Text} from '../../types';

/**
 * Post-Order Case Management API
 */
export default class Case extends Api {
    get basePath(): string {
        return '/post-order/v2/casemanagement';
    }

    /**
     * Buyer or seller appeals a case decision.
     *
     * @param caseId The unique identifier of a case.
     * @param payload the AppealRequest
     */
    appealCaseDecision(caseId: string, payload?: AppealRequest) {
        const id = encodeURIComponent(caseId);
        return this.post(`/${id}/appeal`, payload);
    }

    /**
     * Check the eligibility of an order cancellation.
     *
     * @param caseId The unique identifier of a case.
     * @param payload the BuyerCloseCaseRequest
     */
    closeCase(caseId: string, payload: BuyerCloseCaseRequest) {
        const id = encodeURIComponent(caseId);
        return this.post(`/${id}/close`, payload);
    }

    /**
     * Retrieve the details related to a specific case.
     *
     * @param caseId The unique identifier of a case.
     */
    getCase(caseId: string) {
        const id = encodeURIComponent(caseId);
        return this.get(`/${id}`);
    }

    /**
     * Seller issues a refund for a case.
     *
     * @param caseId The unique identifier of a case.
     * @param payload the CaseVoluntaryRefundRequest (Text)
     */
    issueCaseRefund(caseId: string, payload?: Text) {
        const id = encodeURIComponent(caseId);
        return this.post(`/${id}/issue_refund`, payload);
    }

    /**
     * This call allows the buyer to provide shipment tracking information for the item that is being returned to the seller.
     *
     * @param caseId The unique identifier of a case.
     * @param shippingCarrierName The shipping carrier that is used to ship the item, such as 'FedEx', 'UPS', or 'USPS'.
     * @param trackingNumber The tracking number assigned by the shipping carrier to the item shipment.
     */
    provideReturnShipmentInfo(caseId: string, {shippingCarrierName, trackingNumber}: { shippingCarrierName: string, trackingNumber: string }) {
        const id = encodeURIComponent(caseId);
        return this.post(`/${id}/provide_shipment_info`, {
            shippingCarrierName,
            trackingNumber
        });
    }

    /**
     * Seller provides a return address to the buyer.
     *
     * @param cancelId The unique eBay-assigned identifier of the cancellation request to be rejected.
     * @param payload the ReturnAddressRequest
     */
    providesReturnAddress(cancelId: string, payload?: ReturnAddressRequest) {
        const id = encodeURIComponent(cancelId);
        return this.post(`/${id}/provide_return_address`, payload);
    }

    /**
     * This call is used to search for cases using multiple filter types.
     *
     * @param params the SearchParams
     */
    search(params: CaseSearchParams) {
        return this.get(`/search`, {
            params: {
                params
            }
        });
    }
}