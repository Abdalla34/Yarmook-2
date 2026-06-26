const { headers } = useGlobalApi();
export const useWenchServices = () => {
    const config = useRuntimeConfig();
    const createWenchOrder = async (payload: any, type: any) => {
        return await $fetch(`${config.public.apiBase}ح`, {
            method: "POST",
            body: { payload, type },
            headers,
        });
    };
    const getWenchInCart = async () => {
        return $fetch(`${config.public.apiBase}/order/wench-cart`, {
            method: "GET",
            headers,
        });
    };
    return { createWenchOrder, getWenchInCart }
}