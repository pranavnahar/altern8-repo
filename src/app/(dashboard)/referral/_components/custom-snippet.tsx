import React from 'react';
import { Snippet, SnippetProps } from '@nextui-org/snippet';
import { Copy, Check } from 'lucide-react';

interface CustomSnippetProps extends Omit<SnippetProps, 'children'> {
  children: React.ReactNode | string | string[];
}

const CustomSnippet: React.FC<CustomSnippetProps> = ({ children, ...props }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Snippet
      {...props}
      classNames={{
        base: 'bg-white/10 text-white w-full rounded-lg text-sm px-5',
        copyButton: 'text-white',
        pre: 'text-white',
        ...props.classNames,
      }}
      tooltipProps={{
        content: copied ? 'Copied!' : 'Copy to clipboard',
        className: 'text-white bg-transparent text-sm',
        delay: 0,
        closeDelay: 0,
        ...props.tooltipProps,
      }}
      copyIcon={<Copy size={18} />}
      checkIcon={<Check size={18} />}
      onCopy={handleCopy}
    >
      {children}
    </Snippet>
  );
};

export default CustomSnippet;
