// Opens the GEN-I assistant panel and sends it a message (see AssistantLauncher).
export const askAssistant = (message) => window.dispatchEvent(new CustomEvent('open-assistant', { detail: { message } }))
