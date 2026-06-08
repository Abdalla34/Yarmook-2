export const useCarServices = () => {
  const token = useCookie("token");
  const config = useRuntimeConfig();

  const getServices = async (params = {}) => {
    return await $fetch(`${config.public.apiBase}/car/services`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token.value}`,
        Accept: "application/json",
      },
      params,
    });
  };

  return { getServices };
};