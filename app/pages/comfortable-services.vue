<script setup>
const currentStep = ref(1)

const nextStep = () => {
    currentStep.value = 2
}

const previousStep = () => {
    currentStep.value = 1
}
</script>

<template>
    <div class="container mx-w-auto">
        <div class="min-h-screen bg-gray-100">

            <!-- Header Steps -->
            <div class="bg-white flex justify-between text-xs border-b">
                <div class="flex-1 text-center py-4 font-semibold text-black">
                    خدمة فرعية
                </div>

                <div class="flex-1 text-center py-4"
                    :class="currentStep >= 2 ? 'font-semibold text-black' : 'text-gray-400'">
                    تفاصيل الحجز
                </div>

                <div class="flex-1 text-center py-4 text-gray-400">
                    تأكيد
                </div>
            </div>

            <!-- ================= STEP 1 ================= -->
            <div v-if="currentStep === 1" class="p-4 space-y-4">

                <!-- Car -->
                <div class="bg-white rounded-xl p-4 flex justify-between items-center">
                    <div>
                        <p class="text-sm text-gray-500">سيارتي</p>
                        <p class="font-semibold">Jeep</p>
                    </div>

                    <div class="flex items-center gap-2">
                        <span>Jeep</span>
                        <img src="https://via.placeholder.com/40" class="w-10 h-10 rounded-full object-cover" />
                    </div>
                </div>

                <!-- Problems -->
                <div class="bg-white rounded-xl p-5 text-center">
                    <p class="text-gray-700 mb-3">
                        ما هي المشاكل التي تعاني منها سيارتك؟
                    </p>

                    <button class="text-red-500 font-medium">
                        + أضف مشاكل
                    </button>
                </div>

                <!-- Services -->
                <div class="bg-white rounded-xl p-5 text-center">
                    <p class="text-gray-500 mb-3">
                        الخدمات (اختياري)
                    </p>

                    <button class="text-red-500 font-medium">
                        + إضافة خدمة
                    </button>
                </div>

                <!-- Notes -->
                <div class="bg-cyan-50 rounded-xl p-4 text-sm text-gray-600">
                    أخبرنا إذا وجد لديك تفاصيل إضافية تخص سيارتك.
                </div>

                <!-- Details -->
                <textarea placeholder="المزيد من التفاصيل (اختياري)"
                    class="w-full h-32 rounded-xl border-none bg-white p-4 outline-none"></textarea>

                <!-- Continue -->
                <button @click="nextStep" class="w-full bg-yellow-400 rounded-full py-4 font-bold text-black">
                    الاستمرار للتأكيد
                </button>

            </div>

            <!-- ================= STEP 2 ================= -->
            <div v-else class="p-4 space-y-4">

                <!-- Branch -->
                <div class="bg-white rounded-xl p-4 flex justify-between items-center">
                    <span class="text-gray-500">الفرع</span>

                    <svg class="w-5 h-5">
                        <path />
                    </svg>
                </div>

                <!-- Booking Time -->
                <div class="bg-white rounded-xl p-4">
                    <div class="flex justify-between mb-4">
                        <h3 class="font-semibold">تفاصيل الوقت</h3>
                        <span class="text-red-500 text-sm">1</span>
                    </div>

                    <!-- Future -->
                    <div class="border border-red-300 rounded-xl p-4 mb-4 bg-red-50">
                        <div class="flex justify-between">
                            <div>
                                <h4 class="font-semibold">مستقبلي</h4>
                                <p class="text-xs text-gray-500 mt-2">
                                    ملاحظات: هذا الخيار مستقبلي وسيتم فتحه قريباً
                                </p>
                            </div>

                            <div class="bg-red-500 text-white rounded-full px-3 py-1 text-xs">
                                1 ساعة
                            </div>
                        </div>
                    </div>

                    <!-- Normal -->
                    <div class="border rounded-xl p-4 flex justify-between items-center">
                        <div>
                            <h4 class="font-semibold">عادي</h4>
                            <p class="text-xs text-gray-500">
                                يتم تحديد موعدك بعد المراجعة.
                            </p>
                        </div>

                        <input type="radio" />
                    </div>
                </div>

                <!-- Delivery Type -->
                <div class="bg-white rounded-xl p-4 flex justify-between items-center">
                    <span class="text-gray-500">نوع التوصيل</span>

                    <svg class="w-5 h-5">
                        <path />
                    </svg>
                </div>

                <div class="flex gap-3">
                    <button @click="previousStep" class="flex-1 border rounded-full py-4 font-semibold">
                        رجوع
                    </button>

                    <button class="flex-1 bg-yellow-400 rounded-full py-4 font-bold">
                        الاستمرار للتأكيد
                    </button>
                </div>

            </div>

        </div>
    </div>
</template>
