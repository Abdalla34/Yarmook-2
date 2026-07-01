export const useordersDetails = () => {
  const { headers } = useGlobalApi();
  const config = useRuntimeConfig();

  const resevationTime = async (order_id: any, date: any, time: any) => {
    return await $fetch(`${config.public.apiBase}/order/orders/change-reservation-time/${order_id}`, {
      method: "POST",
      headers,
      body: { reservation_time: `${date} ${time}` }
    })
  }
  const getAvailableBranchesTime = async (branch_id: any, type: any) => {
    return await $fetch(`${config.public.apiBase}/core/branches/available-times`, {
      method: "GET",
      headers,
      params: { branch_id, type },
    });
  };
  const cancelReasons = async () => {
    return await $fetch(`${config.public.apiBase}/core/cancel-reasons`, {
      method: "GET",
      headers,
    });
  };
  const changeOrderToCancelled = async (
    order_id: any,
    cancel_Reason_id: any
  ) => {
    return await $fetch(`${config.public.apiBase}/order/orders/change-status/${order_id}`, {
      method: "POST",
      body: { cancel_Reason_id, status: "canceled" },
      headers,
    });
  };
  return { resevationTime, getAvailableBranchesTime, cancelReasons, changeOrderToCancelled }
}