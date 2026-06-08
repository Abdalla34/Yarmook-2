export const useAddToCart = () => {
    const { headers } = useGlobalApi();
    const config = useRuntimeConfig();

    const addCart = async (type: any, item_id: any, qty: any) => {
        return await $fetch(`${config.public.apiBase}/marketplace/cart/add-to-cart`, {
            method: "POST",
            body: { type, item_id, qty },
            headers,
        });
    };

    const getMyCart = async () => {
        return await $fetch(`${config.public.apiBase}/marketplace/cart/my-cart`, {
            method: "GET",
            headers,
        });
    };
    return { addCart, getMyCart }
} 