<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div  class="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <!-- Header -->
            <div class="flex items-center justify-between border-b px-6 py-4">
                <h3 class="text-xl font-semibold capitalize">
                    {{ $t("About Service") }}
                </h3>

                <i class="fa-solid fa-xmark cursor-pointer text-xl text-gray-500 hover:text-black"></i>
            </div>

            <!-- Body -->
            <div class="px-6 py-6">
                <img src="/comfortableimg.jpeg" alt="Service" class="w-full rounded-lg shadow-md" />

                <div class="mt-6">
                    <h4 class="text-start text-2xl font-semibold capitalize">
                        {{ $t("A comfortable service - that makes you comfortable") }}
                    </h4>

                    <p class="mt-2 text-start text-gray-600">
                        {{
                            $t(
                                "We repair your car while you are there, without any industrial trips"
                            )
                        }}.
                    </p>

                    <p class="mt-3 font-bold capitalize text-red-600">
                        # {{ $t("We receive it.. we fix it.. we return it") }}.
                    </p>

                    <!-- Note -->
                    <div class="mt-5 rounded-lg bg-gray-100 p-4">
                        <h5 class="mb-2 text-start font-semibold capitalize text-red-600">
                            {{ $t("Important Note") }}:
                        </h5>

                        <p class="text-start capitalize text-red-600">
                            {{ $t("Service comfortable availability in Riyadh only") }}.
                        </p>
                    </div>

                    <!-- Steps -->
                    <div class="mt-6">
                        <h5 class="mb-3 text-start font-semibold capitalize">
                            {{ $t("How it works") }}:
                        </h5>

                        <div class="space-y-2 text-start capitalize text-gray-700">
                            <div>1. {{ $t("Request service") }}</div>
                            <div>2. {{ $t("Share location") }}</div>
                            <div>3. {{ $t("Wait for arrival") }}</div>
                            <div>4. {{ $t("Get assistance") }}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="flex flex-col gap-3 border-t px-6 py-5">
                <button type="button"
                    class="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 font-medium transition hover:bg-gray-200">
                    {{ $t("Dont show next time") }}
                </button>

                <button
                    class="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-white transition hover:opacity-90">
                    {{ $t("Order Now") }}
                </button>
            </div>
        </div>
    </div>
</template>