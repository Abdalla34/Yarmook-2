export const useGlobalApi = () => {
    let token = useCookie("token", { maxAge: 365 * 24 * 60 * 60 });
    const config = useRuntimeConfig();

    const headers = {
        Authorization: `Bearer ${token.value}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
    };
    // done
    const getHome = async () => {
        return await $fetch(`${config.public.apiBase}/home`, {
            method: "GET",
            headers,
        });
    };
    // done
    const getOffers = async () => {
        return await $fetch(`${config.public.apiBase}/offer/offers`, {
            method: "GET",
            headers,
        });
    };
    // done
    const getOfferById = async (offerId: string | number) => {
        return await $fetch(`${config.public.apiBase}/offer/offers/${offerId}`, {
            method: "GET",
            headers,

        });
    };
    // done
    const getCountries = async () => {
        return await $fetch(`${config.public.apiBase}/core/countries`, {
            method: "GET",
            headers
        });
    };
    // done
    const getAreasByCountry = async (countryId: any) => {
        return await $fetch(`${config.public.apiBase}/core/countries/${countryId}/areas`, {
            method: "GET",
            headers
        });
    };
    // done
    const getCitiesByArea = async (areaId: any) => {
        return await $fetch(`${config.public.apiBase}/core/countries/${areaId}/cities`, {
            method: "GET",
            headers
        });
    };
    // done
    const getSpareParts = async () => {
        return await $fetch(`${config.public.apiBase}/car/spare-parts`, {
            method: "GET", headers
        })
    }
    // done
    const getBranchDates = async (branchId: number | string) => {
        return await $fetch(`${config.public.apiBase}/core/branches/${branchId}/dates`, {
            method: "GET",
            headers
        })
    }
    // done
    const getBranches = async () => {
        return await $fetch(`${config.public.apiBase}/core/branches?page=1&per_page=15&with_dates=1`, {
            method: "GET",
            headers
        })
    }
    // done
    const getsingleOrder = async (order_id: any) => {
        return await $fetch(`${config.public.apiBase}/order/orders/${order_id}`, {
            headers
        })
    }
    // done
    const sendOtpCode = async (phone: Number) => {
        return await $fetch(`${config.public.apiBase}/auth/send-otp`, {
            method: "POST",
            headers,
            body: { phone: phone }
        })
    }
    // done
    const checkCode = async (phone: any, code: any) => {
        return await $fetch(`${config.public.apiBase}/auth/check-code`, {
            method: "POST",
            headers,
            body: { phone, code },
        });
    }
    // done
    const logOrRegister = async (form: any) => {
        return await $fetch(`${config.public.apiBase}/auth/login-or-register`, {
            method: "POST",
            headers: headers,
            body: form
        })

    }


    return { headers, token, getHome, getOffers, getOfferById, getCountries, getAreasByCountry, getCitiesByArea, getBranches, getBranchDates, getsingleOrder, sendOtpCode, checkCode, logOrRegister, getSpareParts }
}