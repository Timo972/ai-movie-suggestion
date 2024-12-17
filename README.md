# Simple Movie Suggestion WebApp Proof of Concept

Powered by LLama3 running in Ollama with a custom system prompt.
Built within 4h or less. Didn't track, don't expect much ^^.

## Technologies used

- Nuxt3 (v4 compat) -> Vue 3
- Typescript
- TailwindCSS
- Ollama

## Development Setup

Make sure to install the npm dependencies:

```bash
pnpm install
```

and Ollama: [Download here](https://ollama.com/)

Create the model:

```bash
ollama create mediasug:latest -f ./Modelfile
```

Configure .env:

```bash
touch .env
echo "NUXT_OLLAMA_HOST=http://localhost:11434" >> .env
echo "NUXT_OLLAMA_MODEL_NAME=mediasug:latest" >> .env
```

Start the development server on `http://localhost:3000`:

```bash
pnpm run dev
```
