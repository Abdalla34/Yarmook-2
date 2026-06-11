type CartItem = {
    type: string;
    item_id: number;
    qty: number;
};

export const useAddToCart = () => {
    const config = useRuntimeConfig();
    const { token } = useGlobalApi();
    const guestCart = useCookie<CartItem[]>("guest_cart", {
        maxAge: 365 * 24 * 60 * 60,
        default: () => [],
    });

    const getHeaders = () => ({
        ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
        "Content-Type": "application/json",
        Accept: "application/json",
    });

    const addCartMulti = async (items: CartItem[]) => {
        return await $fetch(`${config.public.apiBase}/marketplace/cart/add-to-cart-multi`, {
            method: "POST",
            body: { items },
            headers: getHeaders(),
        });
    };

    const addCart = async (type: string, item_id: number, qty: number) => {
        if (token.value) {
            return await $fetch(`${config.public.apiBase}/marketplace/cart/add-to-cart`, {
                method: "POST",
                body: { type, item_id, qty },
                headers: getHeaders(),
            });
        }

        const items = [...(guestCart.value ?? [])];
        const existing = items.find((item) => item.type === type && item.item_id === item_id);

        if (existing) {
            existing.qty += qty;
        } else {
            items.push({ type, item_id, qty });
        }

        guestCart.value = items;

        return await addCartMulti(items);
    };

    const getMyCart = async () => {
        return await $fetch(`${config.public.apiBase}/marketplace/cart/my-cart`, {
            method: "GET",
            headers: getHeaders(),
        });
    };

    return { addCart, addCartMulti, getMyCart };
};
