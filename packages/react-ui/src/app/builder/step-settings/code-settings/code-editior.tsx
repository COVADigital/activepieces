import { javascript } from '@codemirror/lang-javascript';
import { json } from '@codemirror/lang-json';
import { githubLight } from '@uiw/codemirror-theme-github';
import CodeMirror, { EditorState, EditorView } from '@uiw/react-codemirror';
import { Package } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { INTERNAL_ERROR_TOAST, toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { SourceCode, deepMergeAndCast } from '@activepieces/shared';

import { AddNpmDialog } from './add-npm-dialog';

const styleTheme = EditorView.baseTheme({
  '&.cm-editor.cm-focused': {
    outline: 'none',
  },
});

type CodeEditorProps = {
  sourceCode: SourceCode;
  onChange: (sourceCode: SourceCode) => void;
  readonly: boolean;
};

const CodeEditior = ({ sourceCode, readonly, onChange }: CodeEditorProps) => {
  const { code, packageJson } = sourceCode;
  const [activeTab, setActiveTab] = useState<keyof SourceCode>('code');
  const [language, setLanguage] = useState<'typescript' | 'json'>('typescript');

  const extensions = [
    styleTheme,
    EditorState.readOnly.of(readonly),
    EditorView.editable.of(!readonly),
    language === 'json' ? json() : javascript({ jsx: false, typescript: true }),
  ];

  function handlePackageClick() {
    setActiveTab('packageJson');
    setLanguage('json');
  }

  function handleCodeClick() {
    setActiveTab('code');
    setLanguage('typescript');
  }

  function handleAddPackages(packageName: string, packageVersion: string) {
    try {
      const json = deepMergeAndCast(JSON.parse(packageJson), {
        dependencies: {
          [packageName]: packageVersion,
        },
      });
      setActiveTab('packageJson');
      onChange({ code, packageJson: JSON.stringify(json, null, 2) });
    } catch (e) {
      console.error(e);
      toast(INTERNAL_ERROR_TOAST);
    }
  }

  return (
    <div className="flex flex-col gap-2 border rounded py-2 px-2">
      <div className="flex flex-row justify-center items-center h-full">
        <div className="flex justify-start gap-4 items-center">
          <div
            className={cn('text-sm cursor-pointer', {
              'font-bold': activeTab === 'code',
            })}
            onClick={() => handleCodeClick()}
          >
            Code
          </div>
          <div
            className={cn('text-sm cursor-pointer', {
              'font-bold': activeTab === 'packageJson',
            })}
            onClick={() => handlePackageClick()}
          >
            Dependencies
          </div>
        </div>
        <div className="flex flex-grow"></div>
        <AddNpmDialog onAdd={handleAddPackages}>
          <Button
            variant="outline"
            className="flex gap-2"
            size={'sm'}
            onClick={() => {}}
          >
            <Package className="w-3 h-3" />
            Add
          </Button>
        </AddNpmDialog>
      </div>
      <CodeMirror
        value={activeTab === 'code' ? code : packageJson}
        className="border-none"
        height="250px"
        width="100%"
        maxWidth="100%"
        basicSetup={{
          foldGutter: false,
          lineNumbers: true,
          searchKeymap: false,
          lintKeymap: true,
          autocompletion: true,
        }}
        lang="typescript"
        onChange={(value) => {
          onChange(
            activeTab === 'code'
              ? { code: value, packageJson }
              : { code, packageJson: value },
          );
        }}
        theme={githubLight}
        readOnly={readonly}
        extensions={extensions}
      />
    </div>
  );
};

export { CodeEditior };
