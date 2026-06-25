<template>
    <div class="flex flex-col h-full">
        <div ref="mapContainer" class="flex-1"></div>
        <button @click="confirmLocation"
            class="w-full mt-4 bg-yellow-400 rounded-full py-3 font-bold text-black">
            تأكيد الموقع
        </button>
    </div>
</template>

<script setup>
const emit = defineEmits(["location-selected"]);

const mapContainer = ref(null);
let map = null;
let marker = null;
const selectedLocation = ref(null);

const defaultLat = 24.7136;
const defaultLng = 46.6753;

const updateLocation = (lat, lng) => {
    selectedLocation.value = { lat, lng };
};

const onMapClick = (e) => {
    const { lat, lng } = e.latlng;
    if (marker) {
        marker.setLatLng([lat, lng]);
    } else {
        marker = L.marker([lat, lng], { draggable: true }).addTo(map);
        marker.on("dragend", () => {
            const pos = marker.getLatLng();
            updateLocation(pos.lat, pos.lng);
        });
    }
    updateLocation(lat, lng);
};

const confirmLocation = () => {
    if (selectedLocation.value) {
        const { lat, lng } = selectedLocation.value;
        fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ar`
        )
            .then((res) => res.json())
            .then((data) => {
                const address = data.display_name || `${lat}, ${lng}`;
                emit("location-selected", { lat, lng, address });
            })
            .catch(() => {
                emit("location-selected", { lat, lng, address: `${lat}, ${lng}` });
            });
    }
};

onMounted(async () => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => {
        map = L.map(mapContainer.value).setView([defaultLat, defaultLng], 13);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors",
        }).addTo(map);

        map.on("click", onMapClick);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    map.setView([latitude, longitude], 15);
                    marker = L.marker([latitude, longitude], { draggable: true }).addTo(map);
                    marker.on("dragend", () => {
                        const p = marker.getLatLng();
                        updateLocation(p.lat, p.lng);
                    });
                    updateLocation(latitude, longitude);
                },
                () => {}
            );
        }
    };
    document.head.appendChild(script);
});

onUnmounted(() => {
    if (map) {
        map.remove();
        map = null;
    }
});
</script>