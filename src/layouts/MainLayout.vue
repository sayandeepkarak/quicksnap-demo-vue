<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-toolbar-title>QuickSnap Demo</q-toolbar-title>
        <q-toggle
          v-model="isDark"
          checked-icon="dark_mode"
          unchecked-icon="light_mode"
          color="orange"
          dense
          size="sm"
          class="q-mr-sm"
        />
        <q-btn
          push
          color="white"
          text-color="secondary"
          class="q-mx-md"
          label="GitHub"
          @click="handleOpenGithub"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page class="column items-center q-pa-md">
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const isDark = ref($q.dark.isActive)

watch(isDark, (val) => {
  $q.dark.set(val)
})

function handleOpenGithub() {
  window.open('https://github.com/sayandeepkarak/quicksnap-demo-vue', '_blank')
}
</script>
