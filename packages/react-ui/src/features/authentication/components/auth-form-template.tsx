import { t } from 'i18next';
import React, { useState } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { SignInForm } from './sign-in-form';
import { SignUpForm } from './sign-up-form';
import { ThirdPartyLogin } from './third-party-logins';

const AuthFormTemplate = React.memo(
  ({ form }: { form: 'signin' | 'signup' }) => {
    const isSignUp = form === 'signup';
    const [showCheckYourEmailNote, setShowCheckYourEmailNote] = useState(false);
    const data = {
      signin: {
        title: t('Welcome Back!'),
        description: t('Enter your email below to sign in to your account'),
        showNameFields: false,
      },
      signup: {
        title: t("Let's Get Started!"),
        description: t('Create your account and start flowing!'),
        showNameFields: true,
      },
    }[form];

    return (
      <Card className="w-[28rem] rounded-sm drop-shadow-xl">
        {!showCheckYourEmailNote && (
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{data.title}</CardTitle>
            <CardDescription>{data.description}</CardDescription>
          </CardHeader>
        )}

        <CardContent>
          {!showCheckYourEmailNote && <ThirdPartyLogin isSignUp={isSignUp} />}

          {isSignUp ? (
            <SignUpForm
              setShowCheckYourEmailNote={setShowCheckYourEmailNote}
              showCheckYourEmailNote={showCheckYourEmailNote}
            />
          ) : (
            <SignInForm />
          )}
        </CardContent>
      </Card>
    );
  },
);

AuthFormTemplate.displayName = 'AuthFormTemplate';

export { AuthFormTemplate };
