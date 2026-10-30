import React from 'react';
import { GlobalCan } from './global-can';
import { ACTIONS, SUBJECTS } from '../constants/ability.constants';

const CHAT_WIDGET_ORIGIN = process.env.NEXT_PUBLIC_CHAT_WIDGET_ORIGIN!;
const CHAT_WIDGET_DEFAULT_SIZE = JSON.parse(
  process.env.NEXT_PUBLIC_CHAT_WIDGET_DEFAULT_SIZE!,
);
const CHAT_WIDGET_USER = process.env.NEXT_PUBLIC_CHAT_WIDGET_USER!;
const CHAT_WIDGET_API_KEY = process.env.NEXT_PUBLIC_CHAT_WIDGET_API_KEY!;

const CHAT_WIDGET_OFFSET = JSON.parse(
  process.env.NEXT_PUBLIC_CHAT_WIDGET_OFFSET!,
);

export function ChatWidgetFrame() {
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== CHAT_WIDGET_ORIGIN) return;
      if (event.data?.type !== 'rumsan-chat-widget:resize') return;

      const { width, height } = event.data;
      const iframe = iframeRef.current;
      if (iframe && typeof width === 'number' && typeof height === 'number') {
        iframe.style.width = `${width}px`;
        iframe.style.height = `${height}px`;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <GlobalCan action={ACTIONS.MANAGE} subject={SUBJECTS.ALL}>
      <iframe
        ref={iframeRef}
        src={`${CHAT_WIDGET_ORIGIN}/widget/chat?user=${CHAT_WIDGET_USER}&apiKey=${CHAT_WIDGET_API_KEY}&title=Rumsan+AI+Chat&placeholder=Ask+questions...&color=%23297AD6&bottomPosition=20`}
        title="Rumsan AI Chat"
        style={{
          position: 'fixed',
          bottom: `${CHAT_WIDGET_OFFSET.bottom}px`,
          right: `${CHAT_WIDGET_OFFSET.right}px`,
          width: `${CHAT_WIDGET_DEFAULT_SIZE.width}px`,
          height: `${CHAT_WIDGET_DEFAULT_SIZE.height}px`,
          border: 'none',
          background: 'transparent',
          zIndex: 1000,
          pointerEvents: 'auto',
          transition: 'width 0.15s ease, height 0.15s ease',
        }}
      />
    </GlobalCan>
  );
}
