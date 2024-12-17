import { Ollama } from 'ollama'
import type { H3Event } from 'h3'
import type { LikedMedia } from './schema'
import { suggestionResponseSchema } from './schema'

let _client: Ollama | null = null

export const useOllama = (event?: H3Event) => {
  if (_client) return _client

  const config = useRuntimeConfig(event)
  _client = new Ollama({
    host: config.ollama.host,
    fetch: fetch,
  })

  return _client
}

export const useAI = (event?: H3Event) => {
  const ollama = useOllama(event)
  const config = useRuntimeConfig(event).ollama

  // TODO: update model to respect weights
  async function getSuggestion(media: LikedMedia[]) {
    const res = await ollama.chat({
      model: config.modelName,
      messages: [
        {
          role: 'user',
          content: `the user likes ${media.map(m => m.name).join(', ')}. give at least 3 suggestions. more if possible but don't overwhelm the user.`,
        },
      ],
      stream: false,
    })

    try {
      const unsafeData = JSON.parse(res.message.content)
      const data = suggestionResponseSchema.parse(unsafeData)

      return data
    }
    catch (e) {
      console.warn('Failed to parse AI response', e, res.message.content)
      return null
    }
  }

  return {
    getSuggestion,
  }
}
