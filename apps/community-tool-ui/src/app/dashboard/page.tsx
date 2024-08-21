'use client';
import { DashboardView } from '../../sections/dashboard';
import { socket } from '../../socket';

export default function DashBoardPage() {
  socket.emit('dashboard', { dashboard: 'dashboard' });
  return (
    <div className="max-h-mx">
      <DashboardView />
    </div>
  );
}
