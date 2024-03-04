import {
  createPiece,
  PieceAuth,
  Property,
} from '@activepieces/pieces-framework';
import { textToImage } from './lib/actions/text-to-image';

export const stableDiffusionAuth = PieceAuth.CustomAuth({
  required: true,
  props: {
    baseUrl: Property.ShortText({
      displayName: 'Stable Diffusion web UI API base URL',
      required: true,
    }),
  },
});

export type StableDiffusionAuthType = {
  baseUrl: string;
};

export const stableDiffusion = createPiece({
  displayName: 'Stable Dffusion web UI',
  auth: stableDiffusionAuth,
  minimumSupportedRelease: '0.20.0',
  logoUrl: 'https://cdn.activepieces.com/pieces/stable-diffusion-webui.png',
  authors: ['AdamSelene'],
  actions: [textToImage],
  triggers: [],
});
