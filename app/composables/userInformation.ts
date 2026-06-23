export const useUserinformation = () => {
    const { headers } = useGlobalApi();
    const config = useRuntimeConfig();

    const editeProfile = async (data: any) => {
        return await $fetch(`${config.public.apiBase}/customer/edit-profile`, {
            method: "POST",
            headers,
            body: data
        })
    }
    const getDeactivatedReasons = async () => {
        return await $fetch(`${config.public.apiBase}/core/deactivated-reasons`, {
            method: "GET",
            headers,
        });
    };

    const logOut = async (reason_id?: any) => {
        return await $fetch(`${config.public.apiBase}/auth/logout`, {
            method: "POST",
            headers,
            body: reason_id ? { reason_id } : {}
        })
    }
    const deleteaccount = async (deactivated_reason_id: any, fcm_type: any) => {
        return await $fetch(`${config.public.apiBase}/customer/delete-account`, {
            method: "POST",
            body: { deactivated_reason_id, fcm_type },
            headers,
        });
    };
    // start points calls
    const PointsUser = async () => {
        return await $fetch(`${config.public.apiBase}/customer/points-history`, {
            method: "GET",
            headers
        })
    }
    const RedeemPoints = async (points: any) => {
        return await $fetch(`${config.public.apiBase}/customer/redeem-points`, {
            method: "POST",
            headers,
            body: { points }
        })
    }
    const TransferPoints = async (points: any, phone: any) => {
        return await $fetch(`${config.public.apiBase}/point/transfer`, {
            method: "POST",
            headers,
            body: { points, phone }
        })
    }
    // end oints call

    // start wallt calls
    const getWallte = async (page = 1) => {
        return await $fetch(`${config.public.apiBase}/customer/wallet?page=${page}`, {
            method: "GET",
            headers
        })
    }
    const CashbackWallet = async (amount: any) => {
        return await $fetch(`${config.public.apiBase}/wallet/get-cashback-wallet`, {
            method: "POST",
            headers,
            body: { amount },
        });
    };
    const usePaymentToChargeWallet = async (wallet_amount: any, brand: any) => {
        return await $fetch(`${config.public.apiBase}/payment/hyper-pay/prepare-checkout`, {
            method: "POST",
            body: { wallet_amount: wallet_amount, brand: brand },
            headers,
        });
    };
    //   end wallet calls
    
    // start vouchers calls
    const availableVouchers = async () => {
        return await $fetch(`${config.public.apiBase}/vouchers/available`, {
            method: "GET",
            headers
        })
    }
    const usedVouchers = async () => {
        return await $fetch(`${config.public.apiBase}/vouchers/used`, {
            method: "GET",
            headers
        })
    }
    const expiredVouchers = async () => {
        return await $fetch(`${config.public.apiBase}/vouchers/expired`, {
            method: "GET",
            headers
        })
    }
    // end vouchers

    return { editeProfile, getDeactivatedReasons, logOut, deleteaccount, PointsUser, RedeemPoints, TransferPoints, getWallte, availableVouchers, usedVouchers, expiredVouchers }
}
// let paywithTamara = async () => {
//   try {
//     const walletToNum = Number(walletAmount.value);
//     isLoading.value = true;
//     if (id) {
//       let res = await tamaraPayment({
//         order_id: id,
//         success_url: `${domain}/payment-tamara-status/success`,
//         failure_url: `${domain}/payment-tamara-status/failed`,
//         cancel_url: `${domain}/payment-tamara-status/cancel`,
//       });
//       if (!res?.status) {
//         msg.value = res?.message;
//       }
//       if (res?.data?.checkout_url) {
//         window.location.href = res.data.checkout_url;
//       }
//     } else if (membershipId) {
//       let res = await tamaraPayment({
//         membership_id: membershipId,
//         success_url: `${domain}/payment-tamara-status/success`,
//         failure_url: `${domain}/payment-tamara-status/failed`,
//         cancel_url: `${domain}/payment-tamara-status/cancel`,
//       });
//       if (!res?.status) {
//         msg.value = res?.message;
//       }
//       if (res?.data?.checkout_url) {
//         window.location.href = res.data.checkout_url;
//       }
//     } else {
//       let res = await tamaraPayment({
//         wallet_amount: walletToNum,
//         success_url: `${domain}/wallet`,
//         failure_url: `${domain}/wallet`,
//         cancel_url: `${domain}/wallet`,
//       });
//       if (!res.status) {
//         walletChargeMsg.value = res?.message;
//       }
//       if (res?.data?.checkout_url) {
//         window.location.href = res.data.checkout_url;
//       }
//     }
//   } catch (err) {
//     walletChargeMsg.value = "Something went wrong!";
//     msg.value = err?.response?.message;
//   } finally {
//     isLoading.value = false;
//   }
// };