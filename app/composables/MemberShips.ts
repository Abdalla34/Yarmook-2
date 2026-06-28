export const useMember = () => {
    const { headers } = useGlobalApi()
    const config = useRuntimeConfig();
    const memberShips = async (user_car_id: any) => {
        return $fetch(`${config.public.apiBase}/v1.1/membership/memberships`, {
            method: "GET",
            headers,
            params: { user_car_id }
        });
    };
    const memberShipDetails = async (membership_id: any) => {
        return $fetch(`${config.public.apiBase}/v1.1/membership/memberships/${membership_id}`, {
            method: "GET",
            headers,
        });
    };

    const getSubscriptions = async () => {
        return $fetch(`${config.public.apiBase}/v1.1/membership/subscriptions`, {
            method: "GET",
            headers,
        });
    };
    const getCarSubscriptions = async (membership_id: any) => {
        return $fetch(`${config.public.apiBase}/v1.1/membership/memberships/${membership_id}/eligible-cars`, {
            headers,
            // params:{membership_id}
        })

    }
    return { memberShips, memberShipDetails, getSubscriptions, getCarSubscriptions }
}