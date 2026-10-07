'use client';

import dynamic from 'next/dynamic';
import * as React from 'react';

// ponytail: mapbox-gl + react-map-gl + turf load in a separate chunk, only on the client
const MapView = dynamic(() => import('./mapView'), {
  ssr: false,
  loading: () => <MapPlaceholder />,
});

function MapPlaceholder() {
  return <div className="h-full w-full animate-pulse rounded-sm bg-muted" />;
}

type IProps = React.ComponentProps<typeof MapView>;

// Mounts the map last: only once it scrolls into view, and then only when the browser is idle.
export default function LazyMapView(props: IProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const load = () => setShouldLoad(true);
        if ('requestIdleCallback' in window) {
          idleId = window.requestIdleCallback(load, { timeout: 3000 });
        } else {
          timeoutId = setTimeout(load, 1000);
        }
      },
      { rootMargin: '100px' },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div ref={ref} className="h-full w-full">
      {shouldLoad ? <MapView {...props} /> : <MapPlaceholder />}
    </div>
  );
}
