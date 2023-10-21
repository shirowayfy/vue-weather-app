<template>
  <q-page class="flex column" :class="themeClass">
    <div class="col q-pt-lg q-px-md">
      <q-input
        placeholder="Search"
        v-model="searchQuery"
        dark
        borderless
        @keydown.enter="setLocationByQuery"
      >
        <template v-slot:before>
          <q-btn
            round
            dense
            flat
            icon="my_location"
            @click="setLocationByCoords"
          />
        </template>

        <template v-slot:append>
          <q-btn round dense flat icon="search" @click="setLocationByQuery" />
        </template>
      </q-input>
    </div>

    <template v-if="weatherData">
      <div class="col text-white text-center">
        <div class="text-h4 text-weight-light">{{ weatherData.place }}</div>
        <div class="text-h6 text-weight-light">
          {{ weatherData.name }}
        </div>
        <div class="text-h1 text-weight-thin relative-position q-my-lg">
          <span>{{ weatherData.temp }}</span>
          <span class="text-h4 relative-position degree">&deg;С</span>
        </div>
      </div>
      <div class="col text-center">
        <img
          :src="`http://openweathermap.org/img/wn/${weatherData.icon}@2x.png`"
          alt=""
        />
      </div>
    </template>

    <template v-else>
      <div class="col column text-center text-white">
        <div class="col text-h2 text-weight-thin">Weather</div>
        <q-btn class="col" flat @click="setLocationByCoords">
          <q-icon left size="3em" name="my_location" />
          <div>Find My Location</div>
        </q-btn>
      </div>
    </template>
  </q-page>
</template>

<script setup>
import { computed, ref } from "vue";
import {
  getLocationByCoords,
  getLocationBySearch,
} from "../services/location.js";
import { useQuasar } from "quasar";

const $q = useQuasar();

const searchQuery = ref("");
const weatherData = ref(null);

const themeClass = computed(() =>
  weatherData.icon?.endsWith("n") ? "theme-night" : "theme-day"
);

const setLocationByCoords = () => {
  $q.loading.show();
  getLocationByCoords().then((res) => {
    if (res.error) return;
    weatherData.value = res.weatherData;

    $q.loading.hide();
  });
};

const setLocationByQuery = () => {
  getLocationBySearch(searchQuery.value).then((res) => {
    weatherData.value = res.weatherData;
  });
};
</script>

<style lang="scss">
.q-page {
  &.theme-night {
    background: linear-gradient(to top, #0f2027, #203a43, #2c5364);
  }

  &.theme-day {
    background: linear-gradient(to top, #2c3e50, #4ca1af);
  }
}

.degree {
  top: -44px;
}
</style>
