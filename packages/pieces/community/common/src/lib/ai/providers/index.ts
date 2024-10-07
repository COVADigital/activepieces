import { Static, Type } from '@sinclair/typebox';
import { anthropic } from './anthropic';
import { openai } from './openai';
import { authHeader } from './utils';
import { Property } from '@activepieces/pieces-framework';
import {
  AiProviderWithoutSensitiveData,
  isNil,
  SeekPage,
} from '@activepieces/shared';
import { httpClient, HttpMethod } from '../../http';

export const AI_PROVIDERS_MAKRDOWN = {
  openai: `Follow these instructions to get your OpenAI API Key:

1. Visit the following website: https://platform.openai.com/account/api-keys.
2. Once on the website, locate and click on the option to obtain your OpenAI API Key.

It is strongly recommended that you add your credit card information to your OpenAI account and upgrade to the paid plan **before** generating the API Key. This will help you prevent 429 errors.
`,
  anthropic: `Follow these instructions to get your Claude API Key:

1. Visit the following website: https://console.anthropic.com/settings/keys.
2. Once on the website, locate and click on the option to obtain your Claude API Key.
`,
};

export const AI_PROVIDERS = [
  {
    logoUrl: 'https://cdn.activepieces.com/pieces/openai.png',
    defaultBaseUrl: 'https://api.openai.com',
    label: 'OpenAI' as const,
    value: 'openai' as const,
    models: [
      { label: 'gpt-4o', value: 'gpt-4o', types: ['text'] },
      { label: 'gpt-4o-mini', value: 'gpt-4o-mini', types: ['text'] },
      { label: 'gpt-4-turbo', value: 'gpt-4-turbo', types: ['text'] },
      { label: 'gpt-3.5-turbo', value: 'gpt-3.5-turbo', types: ['text'] },
      { label: 'dall-e-3', value: 'dall-e-3', types: ['image'] },
      { label: 'dall-e-2', value: 'dall-e-2', types: ['image'] },
      { label: 'tts-1', value: 'tts-1', types: ['speech'] },
      { label: 'tts-1-hd', value: 'tts-1-hd', types: ['speech'] },
      { label: 'whisper-1', value: 'whisper-1', types: ['transcription'] },
    ],
    auth: authHeader({ bearer: true }),
    factory: openai,
    instructionsMarkdown: AI_PROVIDERS_MAKRDOWN.openai,
  },
  {
    logoUrl: 'https://cdn.activepieces.com/pieces/claude.png',
    defaultBaseUrl: 'https://api.anthropic.com',
    label: 'Anthropic' as const,
    value: 'anthropic' as const,
    models: [
      {
        label: 'claude-3-5-sonnet',
        value: 'claude-3-5-sonnet-20240620',
        types: ['text'],
      },
      {
        label: 'claude-3-opus',
        value: 'claude-3-opus-20240229',
        types: ['text'],
      },
      {
        label: 'claude-3-sonnet',
        value: 'claude-3-sonnet-20240229',
        types: ['text'],
      },
      {
        label: 'claude-3-haiku',
        value: 'claude-3-haiku-20240307',
        types: ['text'],
      },
    ],
    auth: authHeader({ name: 'x-api-key', bearer: false }),
    factory: anthropic,
    instructionsMarkdown: AI_PROVIDERS_MAKRDOWN.anthropic,
  },
];

export const aiProps = (
  type: 'text' | 'image' | 'speech' | 'transcription'
) => ({
  provider: Property.Dropdown<AiProvider, true>({
    displayName: 'Provider',
    required: true,
    refreshers: [],
    options: async (_, ctx) => {
      const providers = await httpClient.sendRequest<
        SeekPage<AiProviderWithoutSensitiveData>
      >({
        method: HttpMethod.GET,
        url: `${ctx.server.apiUrl}v1/ai-providers`,
        headers: {
          Authorization: `Bearer ${ctx.server.token}`,
        },
      });
      if (providers.body.data.length === 0) {
        return {
          disabled: true,
          options: [],
          placeholder: 'No AI providers configured by the admin.',
        };
      }

      const providersWithMetadata = providers.body.data.flatMap((p) => {
        const providerMetadata = AI_PROVIDERS.find(
          (meta) =>
            meta.value === p.provider &&
            meta.models.some((m) => m.types.includes(type))
        );
        if (isNil(providerMetadata)) {
          return [];
        }
        return {
          value: providerMetadata.value,
          label: providerMetadata.label,
          models: providerMetadata.models,
        };
      });

      return {
        placeholder: 'Select AI Provider',
        disabled: false,
        options: providersWithMetadata,
      };
    },
  }),
  model: Property.Dropdown({
    displayName: 'Model',
    required: true,
    refreshers: ['provider'],
    options: async ({ provider }) => {
      if (isNil(provider)) {
        return {
          disabled: true,
          options: [],
          placeholder: 'Select AI Provider',
        };
      }
      const models = AI_PROVIDERS.find(
        (p) => p.value === provider
      )?.models.filter((m) => m.types.includes(type));
      return {
        disabled: isNil(models),
        options: models ?? [],
      };
    },
  }),
});

export type AiProviderMetadata = (typeof AI_PROVIDERS)[number];

export const AiProvider = Type.Union(
  AI_PROVIDERS.map((p) => Type.Literal(p.value))
);

export type AiProvider = Static<typeof AiProvider>;

export * from './utils';
