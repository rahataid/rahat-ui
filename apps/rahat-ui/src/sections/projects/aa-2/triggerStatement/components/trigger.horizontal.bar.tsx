type IProps = {
  series: number[];
  labels: string[];
  colors?: string[];
};

const DEFAULT_COLORS = ['#297AD6', '#E8C468'];

export default function TriggerHorizontalBar({
  series,
  labels,
  colors = DEFAULT_COLORS,
}: IProps) {
  const total = series.reduce((a, b) => a + b, 0);

  return (
    <div className="w-full my-4 space-y-2">
      {/* Stacked horizontal bar */}
      <div className="flex w-full h-3 rounded-full overflow-hidden bg-gray-200">
        {total === 0 ? (
          <div className="w-full h-full bg-gray-200" />
        ) : (
          series.map((value, i) => {
            const pct = (value / total) * 100;
            return pct > 0 ? (
              <div
                key={labels[i]}
                style={{ width: `${pct}%`, backgroundColor: colors[i] }}
                className="h-full transition-all duration-300"
                title={`${labels[i]}: ${value}`}
              />
            ) : null;
          })
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between">
        {total === 0 ? (
          <p className="text-sm text-gray-400 w-full text-center">No Data</p>
        ) : (
          series.map((value, i) => (
            <div key={labels[i]} className="flex items-center gap-1.5">
              <span
                className="inline-block w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: colors[i] }}
              />
              <span className="text-xs text-muted-foreground">
                {labels[i]}:{' '}
                <span className="font-medium text-foreground">{value}</span>
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
