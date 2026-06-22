const { headers, token } = useGlobalApi()

export const ordersDetails = async () => {
    const config = useRuntimeConfig();

    const resevationTime = async (order_id: any, newTime: any) => {
        return await $fetch(`${config.public.apiBase}/order/orders/change-reservation-time/${order_id}`, {
            method: "POST",
            headers,
            body: { reservation_time: newTime }
        })
    }
    return { resevationTime }
}