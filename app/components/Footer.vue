<template>
  <footer class="bg-[#141414] text-white py-16">
    <div class="container mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

        <!-- Logo & App -->
        <div>
          <img
            src="/Yarmook Logo (1).png"
            alt="Yarmook"
            class="h-10 mb-4 object-contain hover:opacity-80 transition-opacity"
          />

          <p class="text-sm mb-4">{{ $t('download_app') }}</p>

          <div class="flex flex-wrap gap-2 mb-6">
            <button
              class="flex items-center gap-1.5 border border-white rounded-full px-4 py-2 text-sm hover:bg-white hover:text-black transition-all duration-300 hover:scale-105"
            >
              <img src="/Google-logo.png" alt="Google Play" class="w-4 h-4 object-contain" />
              <span>{{ $t('google_play') }}</span>
            </button>

            <button
              class="flex items-center gap-1.5 border border-white rounded-full px-4 py-2 text-sm hover:bg-white hover:text-black transition-all duration-300 hover:scale-105"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.62-.71 1.64-1.23 2.6-1.13.1 1.03-.29 2.04-.9 2.74-.62.71-1.62 1.14-2.59 1-.1-1.01.28-2.02.89-2.61z"/>
              </svg>
              <span>{{ $t('app_store') }}</span>
            </button>
          </div>

          <h3 class="text-xl font-semibold mb-3">{{ $t('contact_us_footer') }}</h3>

          <a href="tel:0558696444" class="text-base mb-1 block hover:text-yellow-400 transition-colors">0558696444</a>
          <p class="text-sm text-gray-300">{{ $t('working_hours') }}</p>
        </div>

        <!-- Links -->
        <div>
          <h3 class="text-xl font-semibold mb-4">{{ $t('links') }}</h3>

          <ul class="space-y-3 text-base">
            <li><a href="#" class="hover:text-yellow-400 transition-colors duration-300 inline-block hover:translate-x-1">{{ $t('home') }}</a></li>
            <li><a href="#" class="hover:text-yellow-400 transition-colors duration-300 inline-block hover:translate-x-1">{{ $t('services') }}</a></li>
            <li><a href="#" class="hover:text-yellow-400 transition-colors duration-300 inline-block hover:translate-x-1">{{ $t('spare_parts') }}</a></li>
            <li><a href="#" class="hover:text-yellow-400 transition-colors duration-300 inline-block hover:translate-x-1">{{ $t('offers') }}</a></li>
            <li><a href="#" class="hover:text-yellow-400 transition-colors duration-300 inline-block hover:translate-x-1">{{ $t('membership') }}</a></li>
          </ul>
        </div>

        <!-- About -->
        <div>
          <h3 class="text-xl font-semibold mb-4">{{ $t('about_us') }}</h3>

          <p class="text-sm leading-6 text-gray-100">
            {{ $t('about_us_desc') }}
          </p>

          <a
            href="#"
            class="text-yellow-500 text-sm mt-2 inline-block hover:text-yellow-400 hover:underline transition-all duration-300"
          >
            https://yarmok.co
          </a>
        </div>

        <!-- Help -->
        <div>
          <h3 class="text-xl font-semibold mb-4">{{ $t('help') }}</h3>

          <ul class="space-y-3 text-base">
            <li><a href="#" class="hover:text-yellow-400 transition-colors duration-300 inline-block hover:translate-x-1">{{ $t('faq') }}</a></li>
            <li><a href="#" class="hover:text-yellow-400 transition-colors duration-300 inline-block hover:translate-x-1">{{ $t('contact') }}</a></li>
            <li><a href="#" class="hover:text-yellow-400 transition-colors duration-300 inline-block hover:translate-x-1">{{ $t('whatsapp') }}</a></li>
          </ul>
        </div>

        <!-- Social -->
        <div>
          <h3 class="text-xl font-semibold mb-4">{{ $t('social_media') }}</h3>

          <div class="flex gap-3 mb-6">
            <a
              href="#"
              class="w-10 h-10 rounded-lg bg-gray-500 flex items-center justify-center hover:bg-yellow-500 hover:scale-110 transition-all duration-300"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.46 6c-.85.38-1.78.64-2.73.76 1-.6 1.76-1.54 2.12-2.67-.93.55-1.96.95-3.06 1.17a4.77 4.77 0 0 0-8.13 4.35C7.16 9.42 3.8 7.6 1.54 4.98a4.77 4.77 0 0 0 1.48 6.38c-.77-.02-1.5-.24-2.13-.59v.06a4.77 4.77 0 0 0 3.83 4.68c-.7.2-1.44.22-2.16.08a4.77 4.77 0 0 0 4.46 3.32A9.56 9.56 0 0 1 .5 20.07a13.5 13.5 0 0 0 7.3 2.14c8.76 0 13.55-7.26 13.55-13.55 0-.2 0-.42-.02-.63A9.7 9.7 0 0 0 24 6.56a9.5 9.5 0 0 1-2.54.7z"/>
              </svg>
            </a>

            <a
              href="#"
              class="w-10 h-10 rounded-lg bg-gray-500 flex items-center justify-center hover:bg-pink-600 hover:scale-110 transition-all duration-300"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/>
              </svg>
            </a>

            <a
              href="#"
              class="w-10 h-10 rounded-lg bg-gray-500 flex items-center justify-center hover:bg-green-500 hover:scale-110 transition-all duration-300"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
              </svg>
            </a>
          </div>

          <h4 class="text-xl font-semibold mb-4">{{ $t('we_accept') }}</h4>

          <div class="flex flex-wrap gap-2">
            <div class="bg-white rounded-lg p-1.5 w-14 h-8 flex items-center justify-center hover:scale-110 hover:shadow-lg transition-all duration-300">
              <img src="/visa.png" alt="Visa" class="max-w-full max-h-full object-contain" />
            </div>
            <div class="bg-white rounded-lg p-1.5 w-14 h-8 flex items-center justify-center hover:scale-110 hover:shadow-lg transition-all duration-300">
              <img src="/masterCard.png" alt="MasterCard" class="max-w-full max-h-full object-contain" />
            </div>
            <div class="bg-white rounded-lg p-1.5 w-14 h-8 flex items-center justify-center hover:scale-110 hover:shadow-lg transition-all duration-300">
              <img src="/tabby.png" alt="Tabby" class="max-w-full max-h-full object-contain" />
            </div>
            <div class="bg-white rounded-lg p-1.5 w-14 h-8 flex items-center justify-center hover:scale-110 hover:shadow-lg transition-all duration-300">
              <img src="/tamara.png" alt="Tamara" class="max-w-full max-h-full object-contain" />
            </div>
          </div>
        </div>

      </div>
    </div>
  </footer>
</template>