export type AiProviderType = 'local' | 'api';

export interface AiSettings {
  provider: AiProviderType;
  baseUrl: string;
  apiKey: string;
  model: string;
}

export const DEFAULT_LOCAL_SETTINGS: AiSettings = {
  provider: 'local',
  baseUrl: 'http://localhost:1234/v1',
  apiKey: '',
  model: 'local-model',
};

export const DEFAULT_API_SETTINGS: AiSettings = {
  provider: 'api',
  baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai/',
  apiKey: '',
  model: 'gemini-3.5-flash',
};
