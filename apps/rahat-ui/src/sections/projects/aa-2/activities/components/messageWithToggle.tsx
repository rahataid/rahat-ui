import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import React, { useState } from 'react';

const MessageWithToggle = ({ message }: { message: string }) => {
  const [showFull, setShowFull] = useState(false);
  const maxLength = 150;

  if (!message) return null;

  const isLong = message.length > maxLength;
  const displayText = showFull
    ? message
    : message.substring(0, maxLength) + (isLong ? '...' : '');
  return (
    <div className="flex flex-col">
      <p className="text-sm text-gray-700 whitespace-pre-wrap">{displayText}</p>
      {isLong && (
        <div
          className="self-end mt-2 px-2 py-1 text-primary flex text-sm  items-center gap-1 no-underline  transition-all hover:cursor-pointer"
          onClick={() => setShowFull(!showFull)}
        >
          {showFull ? (
            <>
              <ChevronUp className="w-4 h-4" />
              <span>Hide Message</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              <span>View Full Message</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageWithToggle;
