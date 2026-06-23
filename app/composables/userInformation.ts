export const useUserinformation = () => {
    const { headers } = useGlobalApi();
    const config = useRuntimeConfig();

    const editeProfile = async (data: any) => {
        return await $fetch(`${config.public.apiBase}/customer/edit-profile`, {
            method: "POST",
            headers,
            body: data
        })
    }
    const getDeactivatedReasons = async () => {
        return await $fetch(`${config.public.apiBase}/core/deactivated-reasons`, {
            method: "GET",
            headers,
        });
    };

    const logOut = async () => {
        return await $fetch(`${config.public.apiBase}/auth/logout`, {
            method: "POST",
            headers
        })
    }

    return { editeProfile, getDeactivatedReasons, logOut }
}
