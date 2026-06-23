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

    const logOut = async (reason_id?: any) => {
        return await $fetch(`${config.public.apiBase}/auth/logout`, {
            method: "POST",
            headers,
            body: reason_id ? { reason_id } : {}
        })
    }
    const deleteaccount = async (deactivated_reason_id: any, fcm_type: any) => {
        return await $fetch(`${config.public.apiBase}/customer/delete-account`, {
            method: "POST",
            body: { deactivated_reason_id, fcm_type },
            headers,
        });
    };

    return { editeProfile, getDeactivatedReasons, logOut, deleteaccount }
}
