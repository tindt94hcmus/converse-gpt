const OPENAI_API_URL = 'https://api.openai.com/v1'

export const ENDPOINTS = {
    whisper: `${OPENAI_API_URL}/audio/transcriptions`,
    completions: `${OPENAI_API_URL}/chat/completions`,
    speech: `${OPENAI_API_URL}/audio/speech`,
    lookup: `https://api.dictionaryapi.dev/api/v2/entries/en`,
}