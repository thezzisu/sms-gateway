<template>
  <div>
    <h1>SMS Gateway</h1>
    <input v-model="token" />
    <input v-model="targets" />
    <input v-model="type" />
    <input v-model="content" />
    <button @click="sendSMS">Send</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const token = ref('')
const targets = ref('')
const type = ref('')
const content = ref('')

function sendSMS() {
  const data = {
    targets: targets.value.split(','),
    type: type.value,
    content: content.value
  }
  fetch('http://localhost:3000/api/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-TOKEN': token.value
    },
    body: JSON.stringify(data)
  })
    .then((res) => res.json())
    .then((res) => console.log(res))
    .catch((err) => console.log(err))
}
</script>
