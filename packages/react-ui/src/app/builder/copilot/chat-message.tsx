import { Static, Type } from '@sinclair/typebox';
import { Bot } from 'lucide-react';
import React from 'react';

import { CodeEditior } from '../step-settings/code-settings/code-editior';

export const CopilotMessage = Type.Union([
  Type.Object({
    messageType: Type.Literal('code'),
    userType: Type.Literal('bot'),
    content: Type.Object({
      packages: Type.Object({
        dependencies: Type.Record(Type.String(), Type.String()),
      }),
      code: Type.String(),
      inputs: Type.Record(Type.String(), Type.String()),
    }),
  }),
  Type.Object({
    messageType: Type.Literal('text'),
    userType: Type.Union([Type.Literal('user'), Type.Literal('bot')]),
    content: Type.String(),
  }),
]);
export type CopilotMessage = Static<typeof CopilotMessage>;

const ChatBox = ({ children }: { children: React.ReactNode }) => (
  <div
    className={`flex max-w-xs lg:max-w-md bg-gray-100 dark:bg-gray-800 dark:text-gray-100 rounded-2xl pl-5 pr-5 pt-2 pb-2 break-word`}
  >
    {children}
  </div>
);

interface ChatMessageProps {
  message: CopilotMessage;
  onApplyCode: (message: CopilotMessage) => void;
}

export const ChatMessage = React.forwardRef<HTMLDivElement, ChatMessageProps>(
  ({ message, onApplyCode }, ref) => {
    const isUser = message.userType === 'user';
    const isBot = message.userType === 'bot';
    const isCode = message.messageType === 'code';

    return (
      <div
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} m-4`}
        ref={ref}
      >
        {isBot && (
          <>
            <div className="w-7 h-7 border rounded-full border-gray-300 dark:border-gray-600 flex items-center justify-center">
              <Bot className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </div>
            <div className={`w-full pl-7 pr-7 mb-6`}>
              {!isCode ? (
                <ChatBox>
                  <p>{message.content}</p>
                </ChatBox>
              ) : (
                <CodeEditior
                  sourceCode={{
                    code: message.content.code,
                    packageJson: JSON.stringify(
                      message.content.packages,
                      null,
                      2,
                    ),
                  }}
                  readonly={true}
                  onChange={() => {}}
                  applyCodeToCurrentStep={() => onApplyCode(message)}
                ></CodeEditior>
              )}
            </div>
          </>
        )}
        {isUser && (
          <ChatBox>
            <p>{message.content}</p>
          </ChatBox>
        )}
      </div>
    );
  },
);

ChatMessage.displayName = 'ChatMessage';
