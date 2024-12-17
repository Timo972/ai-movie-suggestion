import { z } from 'zod'

const likedMediaSchema = z.object({
  name: z.string(),
  weight: z.number(),
})

export type LikedMedia = z.infer<typeof likedMediaSchema>

export const askBodySchema = z.object({
  media: z.array(likedMediaSchema),
})

export const suggestionResponseSchema = z.object({
  thoughts: z.string(),
  media: z.array(likedMediaSchema),
})
