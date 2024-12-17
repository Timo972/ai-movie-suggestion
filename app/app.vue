<script setup lang="ts">
const value = ref('')
const mediaList = ref<string[]>([])
const loading = ref(false)

let abortSignal: AbortController | null = null
const result = ref<{ thoughts: string, media: { name: string, weight: number }[] } | null>(null)
const error = ref<Error | null>(null)

function addMedia() {
  if (!mediaList.value.includes(value.value)) {
    mediaList.value.push(value.value)
  }
  value.value = ''
}

function removeMedia(name: string) {
  mediaList.value = mediaList.value.filter(m => m !== name)
}

async function submit() {
  if (abortSignal != null) return
  result.value = null
  error.value = null
  loading.value = true
  abortSignal = new AbortController()

  try {
    const res = await $fetch('/api/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        media: mediaList.value.map((name, weight) => ({
          name,
          weight,
        })),
      },
      signal: abortSignal.signal,
    })
    result.value = res
    console.log(res)
  }
  catch (err) {
    console.error(err)
    if (err instanceof Error)
      error.value = err
  }
  finally {
    loading.value = false
    abortSignal = null
  }
}
</script>

<template>
  <main class="min-h-[100svh] flex flex-col">
    <section class="p-5">
      <h1 class="text-4xl font-semibold">
        Finde deine nächsten Lieblingsfilme und Serien
      </h1>
      <p class="text-base font-semibold mt-4">
        Gib an, was du liebst - wir empfehlen, was du sehen musst.
      </p>
    </section>
    <section class="p-5 flex flex-col grow">
      <form
        class="flex flex-row items-center space-x-1"
        @submit.prevent="addMedia"
      >
        <UiInput
          v-model="value"
          type="text"
          class="text-base"
          placeholder="Suche nach Filmen und Serien"
        />
        <UiButton
          size="lg"
        >
          <Icon name="lucide:plus" />
        </UiButton>
      </form>
      <ul class="space-y-2 mt-4 grow">
        <li
          v-for="m in mediaList"
          :key="m"
          class="bg-muted rounded-lg p-2 flex flex-row items-center justify-between"
        >
          <span>{{ m }}</span>
          <UiButton
            variant="ghost"
            size="icon"
            @click="removeMedia(m)"
          >
            <Icon name="lucide:trash" />
          </UiButton>
        </li>
      </ul>
      <UiDrawer>
        <UiDrawerTrigger as-child>
          <UiButton
            v-if="mediaList.length > 0"
            :disabled="mediaList.length === 0 || loading"
            size="lg"
            class="mt-4"
            @click="submit"
          >
            Empfehlungen finden
          </UiButton>
        </UiDrawerTrigger>
        <UiDrawerContent>
          <template v-if="abortSignal && !result && !error">
            <UiDrawerHeader>
              <UiDrawerTitle>Hang on thight. We are looking for suggestions!</UiDrawerTitle>
              <UiDrawerDescription>AI is doing its thing...</UiDrawerDescription>
            </UiDrawerHeader>
            <ul class="m-5 space-y-2">
              <li
                v-for="i in 3"
                :key="i"
              >
                <UiSkeleton class="h-10" />
              </li>
            </ul>
            <UiDrawerFooter>
              <UiDrawerClose>
                <UiButton
                  variant="outline"
                  @click="abortSignal.abort()"
                >
                  Cancel
                </UiButton>
              </UiDrawerClose>
            </UiDrawerFooter>
          </template>
          <template v-else-if="!abortSignal && result">
            <UiDrawerHeader>
              <UiDrawerTitle>We found {{ result.media.length }} recommendations</UiDrawerTitle>
              <UiDrawerDescription>{{ result.thoughts }}</UiDrawerDescription>
            </UiDrawerHeader>
            <ul class="m-5 space-y-2">
              <li
                v-for="m in result.media"
                :key="m.name"
                class="rounded-lg bg-muted p-2"
              >
                {{ m.name }} - {{ m.weight }}
              </li>
            </ul>
            <UiDrawerFooter>
              <UiDrawerClose>
                <UiButton
                  variant="outline"
                >
                  Close
                </UiButton>
              </UiDrawerClose>
            </UiDrawerFooter>
          </template>
          <template v-else-if="!abortSignal && error">
            <UiDrawerHeader>
              <UiDrawerTitle>We encountered an error!</UiDrawerTitle>
              <UiDrawerDescription>Sorry for the inconvenience.</UiDrawerDescription>
            </UiDrawerHeader>
            <div>
              {{ error }}
            </div>
            <UiDrawerFooter>
              <UiDrawerClose>
                <UiButton
                  variant="outline"
                >
                  Close
                </UiButton>
              </UiDrawerClose>
            </UiDrawerFooter>
          </template>
        </UiDrawerContent>
      </UiDrawer>
    </section>
  </main>
</template>
