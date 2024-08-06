import {
  AuthenticationResponse,
  ClaimTokenRequest,
  FederatedAuthnLoginResponse,
  SignInRequest,
  SignUpRequest,
  ThirdPartyAuthnProviderEnum,
} from '@activepieces/shared';

import { api } from '@/lib/api';

export const authenticationApi = {
  signIn(request: SignInRequest) {
    return api.post<AuthenticationResponse>(
      '/v1/authentication/sign-in',
      request,
    );
  },
  signUp(request: SignUpRequest) {
    return api.post<AuthenticationResponse>(
      '/v1/authentication/sign-up',
      request,
    );
  },
  getFederatedAuthLoginUrl(providerName: ThirdPartyAuthnProviderEnum) {
    return api.get<FederatedAuthnLoginResponse>(`/v1/authn/federated/login`, {
      providerName,
    });
  },
  claimThirdPartyRequest(request: ClaimTokenRequest) {
    return api.post<AuthenticationResponse>(
      '/v1/authn/federated/claim',
      request,
    );
  },
  sendOtpEmail(request: any) {
    return api.post<void>('/v1/otp', request);
  },
  resetPassword(request: any) {
    return api.post<void>('/v1/authn/local/reset-password', request);
  },
};
