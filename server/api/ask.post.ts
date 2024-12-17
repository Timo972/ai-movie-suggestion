import { askBodySchema } from '../utils/schema'

export default eventHandler(async (event) => {
  const { media } = await readValidatedBody(event, askBodySchema.parse)
  const { getSuggestion } = useAI(event)

  const suggestion = await getSuggestion(media).catch((e) => {
    throw createError({
      statusCode: 500,
      message: 'Failed to get suggestion from AI',
      cause: e,
    })
  })

  if (!suggestion)
    throw createError({
      statusCode: 404,
      message: 'Failed to get suggestion from AI',
    })

  return suggestion
})
