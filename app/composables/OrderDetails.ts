export const useordersDetails = () => {
    const { headers } = useGlobalApi();
    const config = useRuntimeConfig();

    const resevationTime = async (order_id: any, newTime: any) => {
        return await $fetch(`${config.public.apiBase}/order/orders/change-reservation-time/${order_id}`, {
            method: "POST",
            headers,
            body: { reservation_time: newTime }
        })
    }
    const getAvailableBranchesTime = async (branch_id: any, type: any) => {
        return await $fetch(`${config.public.apiBase}/core/branches/available-times`, {
          method: "GET",
          headers,
          params: { branch_id, type },
        });
      };
    return { resevationTime ,getAvailableBranchesTime}
}