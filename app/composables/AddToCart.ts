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

const cartCount = ref(0);

export const useAddToCart = () => {

    const config = useRuntimeConfig();
    const token = useCookie("token", { maxAge: 365 * 24 * 60 * 60 });
    // done
    const getHeaders = () => ({
        ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
        "Content-Type": "application/json",
        Accept: "application/json",
    });

    function updateCountFromCart(data: any) {
        const services = data?.services ?? [];
        const offers = data?.offers ?? [];
        const spareParts = data?.spare_parts ?? [];
        cartCount.value = services.length + offers.length + spareParts.length;
    }
    // done
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
            cartCount.value += items.length;
        }
        return res;
    };
    // done
    const addCart = async (type: string, item_id: number, qty: number, authToken?: string) => {
        const effectiveToken = authToken || token.value;
        if (effectiveToken) {
            const headers = {
                Authorization: `Bearer ${effectiveToken}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            };
            const res = await $fetch(`${config.public.apiBase}/marketplace/cart/add-to-cart`, {
                method: "POST",
                body: { type, item_id, qty },
                headers,
            });
            if (res?.status) {
                cartCount.value += qty;
            }
            return res;
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
    // done
    const getMyCart = async () => {
        const res = await $fetch(`${config.public.apiBase}/marketplace/cart/my-cart`, {
            method: "GET",
            headers: getHeaders(),
        });
        if (res?.status) {
            updateCountFromCart(res.data);
        }
        return res;
    };
    // done
    const deleteItemsFromCart = async (order_id: Number, item_id: Number, type: string) => {
        return await $fetch(`${config.public.apiBase}/marketplace/cart/delete-item-from-cart`, {
            method: "POST",
            headers: getHeaders(),
            body: { order_id, cart_item_id: item_id, type }
        })
    }

    const updateQtyCart = async (type: string, order_id: Number, cart_item_id: Number, qty: Number) => {
        return await $fetch(`${config.public.apiBase}/marketplace/cart/update-quantity-cart`, {
            method: "POST",
            headers: getHeaders(),
            body: { type, order_id, cart_item_id, qty }
        })
    }

    return { addCart, addCartMulti, getMyCart, cartCount, deleteItemsFromCart,updateQtyCart };
};
