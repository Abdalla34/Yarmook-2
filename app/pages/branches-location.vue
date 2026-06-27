<template>
    <div class="min-h-screen py-8">
        <div class="container mx-auto px-4 max-w-4xl">

            <!-- Breadcrumb -->
            <div class="flex items-center gap-2 mb-6 text-gray-600">
                <span class="cursor-pointer hover:text-yellow-500">←</span>
                <span class="text-sm">help &gt; our branches</span>
            </div>

            <div v-if="loading" class="animate-pulse">
                <div class="bg-gray-200 rounded-lg" style="width: 100%; height: 400px"></div>
                <div class="mt-3 space-y-3">
                    <div v-for="i in 3" :key="i" class="bg-gray-100 rounded-lg p-4">
                        <div class="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                        <div class="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                </div>
            </div>

            <div v-else>
                <div ref="mapContainer" style="width: 100%; height: 400px; border-radius: 12px; z-index: 0;"></div>

                <div class="mt-4 space-y-2">
                    <div v-for="branch in branches" :key="branch.id"
                        class="details-map"
                        :class="{ 'active-branch': selectedBranchId === branch.id }"
                        style="cursor: pointer"
                        @click="focusBranch(branch)">
                        <h6 class="text-capitalize font-bold text-gray-800 mb-2">{{ branch.title }}</h6>

                        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div class="flex items-center gap-2 text-sm text-gray-600">
                                <i class="fa fa-clock w-4"></i>
                                <span>{{ branch.working_hours || '09:00 AM - 05:00 PM' }}</span>
                            </div>

                            <div class="flex items-center gap-2 text-sm text-gray-600 min-w-0">
                                <i class="fa fa-map-marker-alt w-4 shrink-0"></i>
                                <span class="truncate">{{ branch.address }}</span>
                                <i class="fa fa-chevron-right ml-auto shrink-0 text-gray-400"></i>
                            </div>
                        </div>
                    </div>

                    <div v-if="!branches.length" class="text-center py-8 text-gray-500">
                        No branches available
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
const { getBranches } = useGlobalApi();

const loading = ref(true);
const branches = ref([]);
const selectedBranchId = ref(null);
const mapContainer = ref(null);

let map = null;
let markers = [];
let branchMarkerMap = {};

useHead({
    title: 'Our Branches',
});

function focusBranch(branch) {
    selectedBranchId.value = branch.id;

    const lat = parseFloat(branch.latitude ?? branch.lat);
    const lng = parseFloat(branch.longitude ?? branch.lng);

    if (map && lat && lng) {
        map.flyTo([lat, lng], 15, { duration: 1 });

        if (branchMarkerMap[branch.id]) {
            branchMarkerMap[branch.id].openPopup();
        }
    }
}

function initMap() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => {
        const defaultLat = 24.7136;
        const defaultLng = 46.6753;

        map = L.map(mapContainer.value).setView([defaultLat, defaultLng], 6);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        addBranchMarkers();

        setTimeout(() => map.invalidateSize(), 300);

        if (branches.value.length) {
            const bounds = [];
            branches.value.forEach(b => {
                const lat = parseFloat(b.latitude ?? b.lat);
                const lng = parseFloat(b.longitude ?? b.lng);
                if (lat && lng) bounds.push([lat, lng]);
            });
            if (bounds.length) {
                map.fitBounds(bounds, { padding: [50, 50] });
            }
        }
    };
    document.head.appendChild(script);
}

function addBranchMarkers() {
    if (!map) return;

    markers.forEach(m => map.removeLayer(m));
    markers = [];
    branchMarkerMap = {};

    branches.value.forEach(branch => {
        const lat = parseFloat(branch.latitude ?? branch.lat);
        const lng = parseFloat(branch.longitude ?? branch.lng);
        if (!lat || !lng) return;

        const marker = L.marker([lat, lng])
            .addTo(map)
            .bindPopup(`<b>${branch.title}</b><br>${branch.address || ''}`);

        marker.on('click', () => {
            selectedBranchId.value = branch.id;
        });

        markers.push(marker);
        branchMarkerMap[branch.id] = marker;
    });
}

async function fetchBranches() {
    loading.value = true;
    try {
        const response = await getBranches();
        branches.value = response?.data?.items ?? response?.data ?? [];
    } catch (err) {
        console.error('Failed to fetch branches:', err);
    } finally {
        loading.value = false;
    }
}

onMounted(async () => {
    await fetchBranches();
    if (!loading.value) {
        nextTick(() => initMap());
    }
});

onUnmounted(() => {
    if (map) {
        map.remove();
        map = null;
    }
});
</script>

<style scoped>
.active-branch {
    background-color: #fef9e7;
    border: 1px solid #f5d742;
    border-radius: 12px;
    padding: 8px;
}

.details-map {
    padding: 8px;
    border-radius: 12px;
    transition: all 0.2s ease;
}
</style>
