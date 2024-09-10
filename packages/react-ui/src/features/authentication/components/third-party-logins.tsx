import { t } from 'i18next';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { HorizontalSeparatorWithText } from '@/components/ui/seperator';
import { INTERNAL_ERROR_TOAST, toast } from '@/components/ui/use-toast';
import {
  ApFlagId,
  ThirdPartyAuthnProviderEnum,
  ThirdPartyAuthnProvidersToShowMap,
} from '@activepieces/shared';

import Github from '../../../assets/img/custom/auth/github.svg';
import GoogleIcon from '../../../assets/img/custom/auth/google-icon.svg';
import SamlIcon from '../../../assets/img/custom/auth/saml.svg';
import { flagsHooks } from '../../../hooks/flags-hooks';
import { authenticationApi } from '../../../lib/authentication-api';
import { authenticationSession } from '../../../lib/authentication-session';
import { oauth2Utils } from '../../../lib/oauth2-utils';

const ThirdPartyIcon = ({ icon }: { icon: string }) => {
  return <img src={icon} alt="icon" width={24} height={24} className="mr-2" />;
};

const ThirdPartyLogin = React.memo(() => {
  const navigate = useNavigate();

  const { data: thirdPartyAuthProviders } =
    flagsHooks.useFlag<ThirdPartyAuthnProvidersToShowMap>(
      ApFlagId.THIRD_PARTY_AUTH_PROVIDERS_TO_SHOW_MAP,
    );
  const { data: thirdPartyRedirectUrl } = flagsHooks.useFlag<string>(
    ApFlagId.THIRD_PARTY_AUTH_PROVIDER_REDIRECT_URL,
  );

  const handleProviderClick = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    providerName: ThirdPartyAuthnProviderEnum,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    const { loginUrl } = await authenticationApi.getFederatedAuthLoginUrl(
      providerName,
    );

    if (!loginUrl || !thirdPartyRedirectUrl) {
      toast(INTERNAL_ERROR_TOAST);
      return;
    }

    try {
      const { code } = await oauth2Utils.openWithLoginUrl(
        loginUrl,
        thirdPartyRedirectUrl,
      );

      const data = await authenticationApi.claimThirdPartyRequest({
        providerName,
        code,
      });

      authenticationSession.saveResponse(data);
      navigate('/flows');
    } catch (e) {
      toast(INTERNAL_ERROR_TOAST);
    }
  };

  const signInWithSaml = () =>
    (window.location.href = '/api/v1/authn/saml/login');

  return (
    <>
      <div className="flex flex-col gap-4">
        {thirdPartyAuthProviders?.google && (
          <Button
            variant="outline"
            className="w-full rounded-sm"
            onClick={(e) =>
              handleProviderClick(e, ThirdPartyAuthnProviderEnum.GOOGLE)
            }
          >
            <ThirdPartyIcon icon={GoogleIcon} />
            {t(`Sign in With Google`)}
          </Button>
        )}
        {thirdPartyAuthProviders?.github && (
          <Button
            variant="outline"
            className="w-full rounded-sm"
            onClick={(e) =>
              handleProviderClick(e, ThirdPartyAuthnProviderEnum.GITHUB)
            }
          >
            <ThirdPartyIcon icon={Github} />
            {t('Sign in With GitHub')}
          </Button>
        )}
        {thirdPartyAuthProviders?.saml && (
          <Button
            variant="outline"
            className="w-full rounded-sm"
            onClick={signInWithSaml}
          >
            <ThirdPartyIcon icon={SamlIcon} />
            {t('Sign in With SAML')}
          </Button>
        )}
      </div>
      {thirdPartyAuthProviders?.google ||
      thirdPartyAuthProviders?.github ||
      thirdPartyAuthProviders?.saml ? (
        <HorizontalSeparatorWithText className="my-4">
          {t('OR')}
        </HorizontalSeparatorWithText>
      ) : null}
    </>
  );
});

ThirdPartyLogin.displayName = 'ThirdPartyLogin';
export { ThirdPartyLogin };
