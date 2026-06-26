export const useWenchServices = () => {
    const token = useCookie("token");
    const config = useRuntimeConfig();
    const createWenchOrder = async (formData: FormData) => {
        return await $fetch(`${config.public.apiBase}/order/orders`, {
            method: "POST",
            body: formData,
            headers: {
                Authorization: `Bearer ${token.value}`,
                Accept: "application/json",
            },
        });
    };
    const getWenchInCart = async (id?: string | number) => {
        const url = id ? `${config.public.apiBase}/order/orders/${id}` : `${config.public.apiBase}/order/wench-cart`;
        return await $fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token.value}`,
                Accept: "application/json",
            },
        });
    };
    return { createWenchOrder, getWenchInCart }
}