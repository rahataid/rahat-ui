'use client';

import { SystemUserAuth } from '@rahat-ui/auth';
import LogStreamView from '../../sections/logs/log-stream.view';

export default function LogsPage() {
  return (
    <SystemUserAuth>
      <LogStreamView />
    </SystemUserAuth>
  );
}
