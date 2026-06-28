<template>
    <div class="branches-information">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-8 col-padding">

                    <!-- Breadcrumb -->
                    <div class="go-page-arrow d-flex align-items-center gap-2 mb-4">
                        <span>←</span>
                        <span>help > our branches</span>
                    </div>

                    <div v-if="loading" class="loading-skeleton">
                        <div class="skeleton-map"></div>
                        <div class="skeleton-cards">
                            <div v-for="i in 3" :key="i" class="skeleton-card">
                                <div class="skeleton-line w-40"></div>
                                <div class="skeleton-line w-60"></div>
                            </div>
                        </div>
                    </div>

                    <div v-else class="map">
                        <div ref="mapContainer" id="google-map"></div>

                        <div class="scroll-map mt-3">
                            <div v-for="branch in branches" :key="branch.id"
                                class="details-map"
                                :class="{ active: selectedBranchId === branch.id }"
                                @click="focusBranch(branch)">
                                <div class="raiydah">
                                    <h6 class="text-capitalize fw-bold">{{ branch.title }}</h6>
                                </div>

                                <div class="area d-flex align-items-center justify-content-between">
                                    <div>
                                        <div class="date d-flex gap-3 align-items-center">
                                            <div class="icons-time icons d-flex align-items-center justify-content-center">
                                                <i class="fa fa-clock"></i>
                                            </div>

                                            <div class="day-time">
                                                <p class="tme font-p color">
                                                    {{ branch.working_hours || '09:00 AM - 05:00 PM' }}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="location d-flex gap align-items-center">
                                        <div class="icons-location icons d-flex align-items-center justify-content-center">
                                            <i class="fa fa-map-marker-alt"></i>
                                        </div>

                                        <div class="text width-text">
                                            <p class="font-p color">
                                                {{ branch.address }}
                                            </p>
                                        </div>

                                        <div class="arrow">
                                            <i class="fa fa-chevron-right"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div v-if="!branches.length" class="empty-state">
                                No branches available
                            </div>
                        </div>
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
.branches-information {
    min-height: 100vh;
    padding: 40px 0;
    background-color: #fdfdfd;
}

.container {
    max-width: 960px;
    margin: 0 auto;
    padding: 0 16px;
}

.row {
    display: flex;
    flex-wrap: wrap;
}

.col-md-8 {
    width: 100%;
}

@media (min-width: 768px) {
    .col-md-8 {
        flex: 0 0 66.666667%;
        max-width: 66.666667%;
    }
}

.col-padding {
    padding: 0 12px;
}

.d-flex {
    display: flex;
}

.align-items-center {
    align-items: center;
}

.justify-content-center {
    justify-content: center;
}

.justify-content-between {
    justify-content: space-between;
}

.gap-2 {
    gap: 8px;
}

.gap-3 {
    gap: 16px;
}

.gap {
    gap: 10px;
}

.mb-4 {
    margin-bottom: 24px;
}

.mt-3 {
    margin-top: 16px;
}

.text-capitalize {
    text-transform: capitalize;
}

.fw-bold {
    font-weight: 700;
}

/* Breadcrumb */
.go-page-arrow {
    font-size: 14px;
    color: #6b7280;
    margin-bottom: 24px;
}

.go-page-arrow span:first-child {
    cursor: pointer;
    font-size: 18px;
    line-height: 1;
    transition: color 0.2s;
}

.go-page-arrow span:first-child:hover {
    color: #eab308;
}

/* Map */
#google-map {
    width: 100%;
    height: 400px;
    border-radius: 16px;
    overflow: hidden;
    z-index: 0;
}

/* Scrollable branch list */
.scroll-map {
    max-height: 500px;
    overflow-y: auto;
    padding-right: 4px;
}

.scroll-map::-webkit-scrollbar {
    width: 4px;
}

.scroll-map::-webkit-scrollbar-thumb {
    background-color: #e5e7eb;
    border-radius: 4px;
}

/* Branch Card */
.details-map {
    background-color: #ffffff;
    border: 1px solid #f0f0f0;
    border-radius: 16px;
    padding: 20px 24px;
    margin-bottom: 12px;
    cursor: pointer;
    transition: all 0.25s ease;
}

.details-map:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
    border-color: #e5e7eb;
}

.details-map.active {
    border-color: #facc15;
    box-shadow: 0 0 0 2px #facc15;
}

/* Branch Title */
.raiydah {
    margin-bottom: 14px;
}

.raiydah h6 {
    font-size: 16px;
    font-weight: 700;
    color: #1f2937;
    margin: 0;
    line-height: 1.4;
}

/* Area (main flex row) */
.area {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

/* Time section */
.date {
    display: flex;
    align-items: center;
    gap: 12px;
}

.icons {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    flex-shrink: 0;
}

.icons-time {
    background-color: #fef9c3;
    color: #ca8a04;
    font-size: 14px;
}

.day-time {
    display: flex;
    align-items: center;
}

.tme {
    margin: 0;
    white-space: nowrap;
}

.font-p {
    font-size: 14px;
    font-family: inherit;
}

.color {
    color: #6b7280;
}

/* Location section */
.location {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
}

.icons-location {
    background-color: #fef9c3;
    color: #ca8a04;
    font-size: 14px;
}

.width-text {
    max-width: 220px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.text p {
    margin: 0;
}

.arrow {
    display: flex;
    align-items: center;
    color: #d1d5db;
    font-size: 12px;
    flex-shrink: 0;
}

/* Empty state */
.empty-state {
    text-align: center;
    padding: 48px 0;
    color: #9ca3af;
}

/* Loading skeleton */
.loading-skeleton {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.skeleton-map {
    background-color: #e5e7eb;
    border-radius: 16px;
    height: 400px;
    width: 100%;
}

.skeleton-cards {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.skeleton-card {
    background-color: #ffffff;
    border-radius: 16px;
    padding: 24px;
    border: 1px solid #f3f4f6;
}

.skeleton-line {
    height: 16px;
    background-color: #e5e7eb;
    border-radius: 8px;
    margin-bottom: 12px;
}

.skeleton-line.w-40 {
    width: 160px;
}

.skeleton-line.w-60 {
    width: 240px;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}

/* Responsive */
@media (max-width: 767px) {
    .branches-information {
        padding: 24px 0;
    }

    .area {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }

    .details-map {
        padding: 16px 18px;
    }

    .width-text {
        max-width: 160px;
    }

    #google-map {
        height: 280px;
    }
}
</style>
