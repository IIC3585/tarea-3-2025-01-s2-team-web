<template>
  <div class="home view-container">
    <div class="card w-full max-w-4xl">
      <h1 class="heading">Bienvenid@ {{ user }}</h1>
      <button 
        @click="logout" 
        class="button button-danger mb-6"
      >
        Cerrar sesión
      </button>

      <hr class="my-2" />

      <h2 class="text-gray-700 text-2xl">Clima en tu ubicación actual</h2>
      <div class="mb-6">
        <Weather />
      </div>

      <hr class="my-6" />

      <h2 class="text-gray-700 text-2xl">Buscar clima por ciudad</h2>
      
      <!-- Combobox -->
      <div>
        <Combobox v-model="selectedCity">
          <div class="relative mt-1">
            <div
              class="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm"
            >
              <ComboboxInput
                class="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                :displayValue="(city) => city"
                @change="ciudad = $event.target.value"
                placeholder="Escribe una ciudad..." 
              />
              <ComboboxButton
                class="absolute inset-y-0 right-0 flex items-center pr-2"
              >
                <ChevronUpDownIcon
                  class="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </ComboboxButton>
            </div>
            <TransitionRoot
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              @after-leave="ciudad = ''"
            >
              <ComboboxOptions
                class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
              >
                <div
                  v-if="filteredCities.length === 0 && ciudad !== ''"
                  class="relative cursor-default select-none px-4 py-2 text-gray-700"
                >
                  No se encontraron resultados.
                </div>
                <ComboboxOption
                  v-for="city in filteredCities"
                  as="template"
                  :key="city"
                  :value="city"
                  v-slot="{ selected, active }"
                >
                  <li
                    class="relative cursor-default select-none py-2 pl-10 pr-4"
                    :class="{
                      'bg-teal-600 text-white': active,
                      'text-gray-900': !active,
                    }"
                  >
                    <span
                      class="block truncate"
                      :class="{ 'font-medium': selected, 'font-normal': !selected }"
                    >
                      {{ city }}
                    </span>
                    <span
                      v-if="selected"
                      class="absolute inset-y-0 left-0 flex items-center pl-3"
                      :class="{ 'text-white': active, 'text-teal-600': !active }"
                    >
                      <CheckIcon class="h-5 w-5" aria-hidden="true" />
                    </span>
                  </li>
                </ComboboxOption>
              </ComboboxOptions>
            </TransitionRoot>
          </div>
        </Combobox>
      </div>
      <!-- End Combobox -->
      
      <button 
        @click="buscarClima" 
        class="button button-primary mt-4"
      >
        Buscar
      </button>

      <div v-if="loadingBusqueda" class="message-info">Buscando clima...</div>

      <div v-if="climaBusqueda" class="mt-6 p-4 bg-gray-50 rounded-lg shadow">
        <p class="text-gray-700 text-xl">{{ climaBusqueda.location.name }}, {{ climaBusqueda.location.country }}</p>
        <div class="flex justify-center">
          <img :src="climaBusqueda.current.weather_icons[0]" alt="Ícono del clima" class="mt-4" />
        </div>
        <p class="text-gray-700"><strong>Temperatura:</strong> {{ climaBusqueda.current.temperature }}°C</p>
        <p class="text-gray-700"><strong>Sensación térmica:</strong> {{ climaBusqueda.current.feelslike }}°C</p>
        <p class="text-gray-700"><strong>Índice UV:</strong> {{ climaBusqueda.current.uv_index }}</p>
        <p class="text-gray-700"><strong>Condición:</strong> {{ climaBusqueda.current.weather_descriptions[0] }}</p>
        <button 
          v-if="!favoritosApi.has(climaBusqueda.location.name)"
          @click="agregarAFavoritos" 
          class="button button-primary mt-4"
        >
          Agregar ciudad a favoritos
        </button>
        <button 
          v-else
          @click="eliminarFavorito(climaBusqueda.location.name)" 
          class="button button-danger mt-4"
        >
          Eliminar ciudad de favoritos
        </button>
      </div>

      <div v-if="errorBusqueda" class="message-error">{{ errorBusqueda }}</div>
    

      <router-link to="/favoritos">
        <button 
          class="button button-secondary mt-6"
        >
          Ver mis favoritos
        </button>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Weather from '../components/Weather.vue'
import { getWeatherByCity } from '../services/weatherService'
import { postFavorito, deleteFavorito } from '../services/favoritosApi'
import { 
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  TransitionRoot,
} from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'

const router = useRouter()
const user = ref('')

const ciudad = ref('')
const climaBusqueda = ref(null)
const loadingBusqueda = ref(false)
const errorBusqueda = ref('')
const mensajeFavorito = ref('')

const favoritosApi = ref(new Set())
const cities = [
  'Santiago', 'Abu Dabi', 'Amán', 'Ámsterdam', 'Ankara', 'Atenas', 'Bagdad', 'Bakú', 'Bangkok', 'Basseterre', 'Belmopán',
  'Berlín', 'Bogotá', 'Brasilia', 'Bridgetown', 'Bruselas', 'Budapest', 'Buenos Aires', 'Caracas', 'Castries', 'Cayenne',
  'Chisináu', 'Daca', 'Damasco', 'Doha', 'Ereván', 'Fort-de-France', 'Funafuti', 'Georgetown', 'Guatemala',
  'Hanoi', 'Honiara', 'Hong Kong', 'Islamabad', 'Jakarta', 'Katmandú', 'Kingston', 'Kingstown', 'Kiev', 'Kuala Lumpur',
  'Kuwait', 'La Habana', 'La Paz', 'Lima', 'Liubliana', 'Londres', 'Madrid', 'Majuro', 'Managua', 'Manila',
  'Mascate', 'Minsk', 'Montevideo', 'Moscú', 'Nassau', 'Nueva Delhi', 'Nukuʻalofa', 'Palikir', 'Panamá', 'Paramaribo',
  'París', 'Papeete', 'Pekín', 'Podgorica', 'Port Moresby', 'Port of Spain', 'Port-au-Prince', 'Port Vila', 'Praga', 'Quito',
  'Rangún', 'Riad', 'Roseau', 'San José', 'San Salvador', 'Santiago', 'Sarajevo', 'Seúl', 'Singapur', 'Skopie',
  'Sofía', 'Suva', 'Santo Domingo', 'Tarawa', 'Tegucigalpa', 'Teherán', 'Tiflis', 'Tirana', 'Tokio', 'Tom Cook',
  'Varsovia', 'Viena', 'Vientián', 'Wellington', 'Yaren', 'Zagreb'
];
const selectedCity = ref('')

const filteredCities = computed(() =>
  ciudad.value === ''
    ? cities
    : cities.filter((city) =>
        city
          .toLowerCase()
          .replace(/\s+/g, '')
          .includes(ciudad.value.toLowerCase().replace(/\s+/g, ''))
      )
)

onMounted(() => {
  const sessionUser = sessionStorage.getItem('user')
  if (!sessionUser) {
    router.push('/login')
  } else {
    user.value = sessionUser
    const favoritosArray = JSON.parse(sessionStorage.getItem(`favoritosApi_${user.value}`) || '[]')
    favoritosApi.value = new Set(favoritosArray)
  }
})

function logout() {
  sessionStorage.removeItem('user')
  router.push('/login')
}

async function buscarClima() {
  climaBusqueda.value = null
  errorBusqueda.value = ''
  loadingBusqueda.value = true
  console.log('Buscando clima para:', ciudad.value)
  console.log(selectedCity.value)

  try {
    const data = await getWeatherByCity(selectedCity.value)
    if (data && data.location && data.current) {
      climaBusqueda.value = data
    } else {
      errorBusqueda.value = 'No se encontró la ciudad o hubo un error en la búsqueda.'
    }
  } catch (e) {
    errorBusqueda.value = 'Error al buscar el clima.'
  } finally {
    loadingBusqueda.value = false
  }
}

async function agregarAFavoritos() {
  if (climaBusqueda.value) {
    try {
      await postFavorito(climaBusqueda.value.location.name)
      favoritosApi.value.add(climaBusqueda.value.location.name)
      sessionStorage.setItem(`favoritosApi_${user.value}`, JSON.stringify([...favoritosApi.value]))
      mensajeFavorito.value = '¡Ciudad agregada a favoritos (POST exitoso)!'
    } catch (e) {
      mensajeFavorito.value = 'Error al guardar favorito en el servidor.'
    }
  }
}

async function eliminarFavorito(ciudad) {
  try {
    await deleteFavorito(ciudad)
    favoritosApi.value.delete(ciudad)
    sessionStorage.setItem(`favoritosApi_${user.value}`, JSON.stringify([...favoritosApi.value]))
  } catch (e) {
    mensajeFavorito.value = 'Error al eliminar favorito en el servidor.'
  }
}
</script>

<style>
/* Removed redundant styles and replaced with reusable classes */
</style>
