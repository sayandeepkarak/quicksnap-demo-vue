<template>
  <div class="q-pa-md flex flex-center">
    <div class="full-width row full-width items-center q-mb-md">
      <q-icon name="info" size="xs" color="accent" />
      <p class="q-mb-none q-ml-sm">
        This is the demo implementation for the
        <a href="https://www.npmjs.com/package/quicksnap" target="_blank">QuickSnap</a> NPM package.
      </p>
    </div>
    <q-card flat bordered class="q-pa-md" style="max-width: 100vw; width: 100%">
      <q-card-section class="full-width">
        <div class="full-width flex flex-center">
          <quick-snap
            ref="quickSnapRef"
            autoStart
            :width="320"
            :height="240"
            :format="formatConfig.selected"
            :mediaDeviceId="mediaDeviceConfig.selected"
            @onReady="trackLog('✅ Webcam initialized: ' + $event?.detail?.message)"
            @onCapture="trackLog('📸 Snapshot captured')"
            @onQuicksnapError="trackLog('❌ An error occurred: ' + $event?.detail?.message)"
            @onPermissionStateUpdate="
              trackLog('🔐 Permission status updated: ' + $event.detail.status)
            "
          />
        </div>

        <div class="text-subtitle2 q-mt-md q-mr-auto">Image Preview:</div>

        <q-select
          outlined
          label="Select Camera Device"
          v-model="mediaDeviceConfig.selected"
          :options="mediaDeviceConfig.options"
          option-value="deviceId"
          option-label="label"
          class="full-width q-mt-md"
          emit-value
          map-options
        />

        <div class="full-width q-mt-md row items-center">
          <q-select
            class="col-grow"
            outlined
            label="Image Format"
            v-model="formatConfig.selected"
            :options="formatConfig.options"
          />
          <q-btn
            push
            color="accent"
            class="q-mx-md"
            label="Capture"
            :loading="isCapturing"
            @click="captureImage"
          />
          <q-btn push color="secondary" label="Capture & Download" @click="captureAndDownload" />
        </div>

        <div class="full-width row q-mt-md" style="gap: 10px">
          <q-btn push color="primary" label="Start Camera" @click="startCamera" />
          <q-btn push color="warning" label="Pause Camera" @click="pauseCamera" />
          <q-btn push color="positive" label="Resume Camera" @click="resumeCamera" />
          <q-btn push color="negative" label="Stop Camera" @click="stopCamera" />
          <q-btn
            push
            class="col-grow"
            color="info"
            label="Check Permissions"
            @click="checkPermissions"
          />
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="text-subtitle2 q-mb-sm">Image Preview:</div>
        <div class="flex flex-center q-pa-md">
          <img
            v-if="capturedUrl"
            :src="capturedUrl"
            alt="Captured Image"
            style="width: 100%; border-radius: 8px; max-height: 300px; object-fit: contain"
          />
          <div v-else>No image available</div>
        </div>
      </q-card-section>

      <q-card-section>
        <div class="text-subtitle2 q-mb-sm">Activity Logs:</div>
        <div
          v-if="logs?.length"
          class="q-mono text-caption"
          style="max-height: 150px; overflow: auto"
        >
          <div v-for="(log, index) in logs" :key="index">📌 {{ log }}</div>
        </div>
        <div v-else class="text-center q-py-md">No logs recorded</div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref, onMounted, shallowRef } from 'vue'
import 'quicksnap'

const isCapturing = shallowRef(false)
const quickSnapRef = ref(null)
const capturedUrl = ref(null)
const logs = ref([])

const formatConfig = ref({
  selected: 'image/png',
  options: ['image/png', 'image/jpeg', 'image/webp', 'image/bmp'],
})

const mediaDeviceConfig = ref({
  selected: '',
  options: [],
})

onMounted(async () => {
  const devices = await quickSnapRef.value?.getAvailableCameras()
  if (devices.length) {
    mediaDeviceConfig.value = {
      selected: devices[0].deviceId,
      options: devices,
    }
  }
})

function trackLog(msg) {
  logs.value.unshift(`[${new Date().toLocaleTimeString()}] ${msg}`)
  if (logs.value.length > 100) logs.value.pop()
}

async function startCamera() {
  const started = await quickSnapRef.value?.start()
  trackLog(started ? '✅ Camera started successfully' : '⚠️ Unable to start camera')
}

async function stopCamera() {
  await quickSnapRef.value?.stop()
  trackLog('🛑 Camera stopped')
}

async function pauseCamera() {
  await quickSnapRef.value?.pause()
  trackLog('⏸️ Camera paused')
}

async function resumeCamera() {
  await quickSnapRef.value?.resume()
  trackLog('▶️ Camera resumed')
}

async function captureImage() {
  isCapturing.value = true
  const blob = await quickSnapRef.value?.capture()
  if (blob) {
    capturedUrl.value = URL.createObjectURL(blob)
    trackLog('✅ Image captured and preview updated')
  } else {
    trackLog('⚠️ Capture failed')
  }
  isCapturing.value = false
}

async function captureAndDownload() {
  await quickSnapRef.value?.captureAndDownload()
  trackLog('💾 Image captured and downloaded')
}

async function checkPermissions() {
  const status = await quickSnapRef.value?.checkPermissions()
  trackLog('🔍 Current permission status: ' + status)
}
</script>
