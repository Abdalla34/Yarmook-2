
export const useHelp = () => {
    const { headers } = useGlobalApi()
    const config = useRuntimeConfig()
    const getFaqs = async (page: any) => {
        return await $fetch(`${config.public.apiBase}/core/faqs`, {
            method: "GET",
            headers,
            params: {
                page,
                per_page: 15,
            },
        });
    };
    const FormUserContact = async (form: any) => {
        return await $fetch(`${config.public.apiBase}/core/contact-us`, {
            method: "POST",
            headers,
            body: form,
        });
    };
    const Settings = async () => {
        return await $fetch(`${config.public.apiBase}/settings`, {
            method: "GET",
            headers,
        });
    };
    return { getFaqs, FormUserContact, Settings }
}