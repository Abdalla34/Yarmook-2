type CartItem = {
    type: string;
    item_id: number;
    qty: number;
};

const GUEST_CART_KEY = "cartGuest";

const getGuestCart = (): CartItem[] => {
    if (import.meta.client) {
        const stored = localStorage.getItem(GUEST_CART_KEY);
        return stored ? JSON.parse(stored) : [];
    }
    return [];
};

const setGuestCart = (items: CartItem[]) => {
    if (import.meta.client) {
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
    }
};

const clearGuestCart = () => {
    if (import.meta.client) {
        localStorage.removeItem(GUEST_CART_KEY);
    }
};

export const useAddToCart = () => {
    const config = useRuntimeConfig();
    const token = useCookie("token", { maxAge: 365 * 24 * 60 * 60 });

    const getHeaders = () => ({
        ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
        "Content-Type": "application/json",
        Accept: "application/json",
    });

    const addCartMulti = async (items: CartItem[], authToken?: string) => {
        const headers = {
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : (token.value ? { Authorization: `Bearer ${token.value}` } : {})),
            "Content-Type": "application/json",
            Accept: "application/json",
        };
        const res = await $fetch(`${config.public.apiBase}/marketplace/cart/add-to-cart-multi`, {
            method: "POST",
            body: { items },
            headers,
        });
        if (res?.status) {
            clearGuestCart();
        }
        return res;
    };

    const addCart = async (type: string, item_id: number, qty: number, authToken?: string) => {
        const effectiveToken = authToken || token.value;
        if (effectiveToken) {
            const headers = {
                Authorization: `Bearer ${effectiveToken}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            };
            return await $fetch(`${config.public.apiBase}/marketplace/cart/add-to-cart`, {
                method: "POST",
                body: { type, item_id, qty },
                headers,
            });
        }

        const items = getGuestCart();
        const existing = items.find((item) => item.type === type && item.item_id === item_id);

        if (existing) {
            existing.qty += qty;
        } else {
            items.push({ type, item_id, qty });
        }

        setGuestCart(items);

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
