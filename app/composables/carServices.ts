export const useCarServices = () => {
  const token = useCookie("token");
  const config = useRuntimeConfig();
  const headers = {
    Authorization: `Bearer ${token.value}`,
    "Content-Type": "application/json",
    Accept: "application/json",
    "Access-Control-Allow-Origin": "*",
  };
  // done
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
  // done
  const getcarBrands = async (per_page: any) => {
    return $fetch(`${config.public.apiBase}/core/brands?per_page=15`, {
      method: "GET",
      headers,
      params: { per_page }
    })
  }
  // done
  const getcartypesbrand = async (idBrand: any) => {
    return await $fetch(`${config.public.apiBase}/core/car-types`, {
      method: "GET",
      headers,
      params: { brand_id: idBrand },
    });
  };

  const createMycar = async (payload: any) => {
    return await $fetch(`${config.public.apiBase}/customer/create-car`, {
      method: "POST",
      headers,
      body: payload
    })
  }
  return { getServices, getcarBrands, getcartypesbrand, createMycar };
};