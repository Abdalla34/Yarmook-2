

export const PayMents = () => {
    const { headers } = useGlobalApi();
    const config = useRuntimeConfig();

    const usePayment = async (orderId: any, brand: any, wallet_amount: any) => {
        return await $fetch(`${config.public.apiBase}/payment/hyper-pay/prepare-checkout`, {
            method: "POST",
            body: { order_id: orderId, brand: brand, wallet_amount: wallet_amount },
            headers,
        });
    };
    const usePaymentMembership = async (membershipId: any, brand: any) => {
        return await $fetch(`${config.public.apiBase}/payment/hyper-pay/prepare-checkout`, {
            method: "POST",
            body: { membership_id: membershipId, brand: brand },
            headers,
        });
    };
    const usePaymentToChargeWallet = async (wallet_amount: any, brand: any) => {
        return await $fetch(`${config.public.apiBase}/payment/hyper-pay/prepare-checkout`, {
            method: "POST",
            body: { wallet_amount: wallet_amount, brand: brand },
            headers,
        });
    };
    // done
    const getHyperpayStatus = async (id: any) => {
        return await $fetch(`${config.public.apiBase}/payment/hyper-pay/check-status`, {
            method: "GET",
            params: { id },
            headers,
        });
    };
    // done
    const tamaraPayment = async (payload: {
        order_id?: any;
        membership_id?: any;
        wallet_amount?: any;
        success_url: any;
        failure_url: any;
        cancel_url: any;
    }) => {
        return await $fetch(`${config.public.apiBase}/payment/tamara/prepare-checkout`, {
            method: "POST",
            headers,
            body: payload,
        });
    };
    // done
    const tabyPayment = async (payload: {
        order_id?: any;
        membership_id?: any;
        wallet_amount?: any;
        success_url: any;
        failure_url: any;
        cancel_url: any;
    }) => {
        return await $fetch(`${config.public.apiBase}/payment/tabby/prepare-checkout`, {
            method: "POST",
            headers,
            body: payload,
        });
    };
    // done
    const tabbyStatusSuccess = async (id: any) => {
        return await $fetch(`${config.public.apiBase}/payment/tabby/success`, {
            method: "GET",
            params: { payment_id: id },
            headers,
        });
    };
    // done
    const tabbyStatusFailure = async (id: any) => {
        return await $fetch(`${config.public.apiBase}/payment/tabby/failure`, {
            method: "GET",
            params: { payment_id: id },
            headers,
        });
    };
    // done
    const tabbyStatusCancel = async (id: any) => {
        return await $fetch(`${config.public.apiBase}/payment/tabby/cancel`, {
            method: "GET",
            params: { payment_id: id },
            headers,
        });
    };
    const checkOnDeliveryRequirements = async (order_id: any) => {
        return await $fetch(`${config.public.apiBase}/payment/cash-on-delivery/${order_id}`, {
            method: "GET",
            headers,
        });
    };
    return { usePayment, usePaymentMembership, usePaymentToChargeWallet, getHyperpayStatus, tamaraPayment, tabyPayment, tabbyStatusSuccess, tabbyStatusFailure, tabbyStatusCancel, checkOnDeliveryRequirements }
}