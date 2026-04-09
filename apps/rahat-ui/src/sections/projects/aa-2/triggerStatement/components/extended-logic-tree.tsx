import React from 'react';
import type { ExtendedTriggerLogicGroup } from '../types/extended-trigger-logic.types';

export interface TriggerDetail {
  title?: string;
  description?: string;
  logicKey?: string;
  uuid?: string;
  status?: boolean;
  isTriggered?: boolean;
  source?: string;
  sourceLabel?: string;
  sourceSubType?: string;
  stationId?: string;
  stationName?: string;
  operator?: string;
  value?: number | string;
  expression?: string;
}

interface ExtendedLogicTreeProps {
  groups: ExtendedTriggerLogicGroup[];
  joinOperator: 'AND' | 'OR';
  getTriggerLabel: (key: string) => string;
  triggerStatuses?: Record<string, boolean>;
  triggerDetails?: Record<string, TriggerDetail>;
  onTriggerClick?: (key: string) => void;
}

// Color palettes per group index (fill, stroke, text)
const GROUP_COLORS = [
  { fill: '#dbeafe', stroke: '#93c5fd', text: '#1e40af', badge: '#3b82f6' }, // blue
  { fill: '#fef3c7', stroke: '#fcd34d', text: '#92400e', badge: '#f59e0b' }, // amber
  { fill: '#d1fae5', stroke: '#6ee7b7', text: '#065f46', badge: '#10b981' }, // emerald
  { fill: '#ffe4e6', stroke: '#fca5a5', text: '#9f1239', badge: '#f43f5e' }, // rose
  { fill: '#ccfbf1', stroke: '#5eead4', text: '#134e4a', badge: '#14b8a6' }, // teal
  { fill: '#ede9fe', stroke: '#c4b5fd', text: '#4c1d95', badge: '#8b5cf6' }, // violet
];

const NODE_W = 130;
const NODE_H = 36;
const RESULT_W = 180;
const RESULT_H = 48;
const TRIGGER_W = 150;
const TRIGGER_H = 36;
const ROW_GAP = 150;
const COL_GAP = 20;

function computeGroupStatus(
  group: ExtendedTriggerLogicGroup,
  statuses: Record<string, boolean>,
): boolean | undefined {
  if (group.triggers.length === 0) return undefined;
  const vals = group.triggers.map((k) => statuses[k]);
  if (vals.some((v) => v === undefined)) return undefined;
  return group.operator === 'AND'
    ? (vals as boolean[]).every(Boolean)
    : (vals as boolean[]).some(Boolean);
}

function computeRootStatus(
  groups: ExtendedTriggerLogicGroup[],
  joinOperator: 'AND' | 'OR',
  statuses: Record<string, boolean>,
): boolean | undefined {
  if (groups.length === 0) return undefined;
  const vals = groups.map((g) => computeGroupStatus(g, statuses));
  if (vals.some((v) => v === undefined)) return undefined;
  return joinOperator === 'AND'
    ? (vals as boolean[]).every(Boolean)
    : (vals as boolean[]).some(Boolean);
}

function operatorBadge(x: number, y: number, op: 'AND' | 'OR') {
  const color = op === 'AND' ? '#3b82f6' : '#f97316';
  const w = 36;
  const h = 18;
  return (
    <g key={`op-${x}-${y}`}>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={9} fill={color} />
      <text
        x={x}
        y={y + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={10}
        fontWeight="600"
        fill="#fff"
      >
        {op}
      </text>
    </g>
  );
}

function StatusDot({
  cx,
  cy,
  status,
}: {
  cx: number;
  cy: number;
  status: boolean | undefined;
}) {
  if (status === undefined) return null;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={5.5}
      fill={status ? '#22c55e' : '#94a3b8'}
      stroke="#fff"
      strokeWidth={1.5}
    />
  );
}

function toLabel(str: string): string {
  return str?.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function TriggerTooltip({
  detail,
  x,
  y,
  containerWidth,
}: {
  detail: TriggerDetail;
  x: number;
  y: number;
  containerWidth: number;
}) {
  const triggered = detail.isTriggered ?? detail.status;

  const rows: { label: string; value: string; highlight?: boolean }[] = [];

  rows.push({
    label: 'Triggered',
    value: triggered === undefined ? 'Unknown' : triggered ? 'Yes' : 'No',
    highlight: true,
  });
  if (detail.sourceLabel || detail.source) {
    rows.push({ label: 'Source', value: detail.sourceLabel || toLabel(detail.source!) });
  }
  if (detail.sourceSubType) {
    rows.push({ label: 'Sub-type', value: toLabel(detail.sourceSubType) });
  }
  if (detail.stationName) {
    rows.push({
      label: 'Station',
      value: detail.stationId
        ? `${detail.stationName} (${detail.stationId})`
        : detail.stationName,
    });
  }
  if (detail.operator !== undefined && detail.value !== undefined) {
    rows.push({ label: 'Condition', value: `${detail.operator} ${detail.value}` });
  }
  if (detail.expression) {
    rows.push({ label: 'Trigger Statement', value: detail.expression });
  }
  if (detail.logicKey || detail.uuid) {
    rows.push({ label: 'Key', value: detail.logicKey || detail.uuid || '' });
  }

  const tooltipW = 240;
  // Clamp so tooltip doesn't overflow left/right
  const clampedX = Math.min(
    Math.max(x - tooltipW / 2, 4),
    containerWidth - tooltipW - 4,
  );

  return (
    <div
      style={{
        position: 'absolute',
        left: clampedX,
        top: y - 12,
        transform: 'translateY(-100%)',
        width: tooltipW,
        pointerEvents: 'none',
        zIndex: 50,
      }}
    >
      {/* Arrow */}
      <div
        style={{
          position: 'absolute',
          bottom: -6,
          left: x - clampedX - 6,
          width: 12,
          height: 6,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            background: '#fff',
            border: '1px solid #e2e8f0',
            transform: 'rotate(45deg)',
            transformOrigin: 'center',
            marginTop: -5,
            marginLeft: 1,
          }}
        />
      </div>

      <div
        style={{
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: 10,
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
          overflow: 'hidden',
          fontSize: 11,
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '8px 12px',
            borderBottom: '1px solid #f1f5f9',
            background: '#f8fafc',
          }}
        >
          <span style={{ fontWeight: 700, color: '#0f172a', fontSize: 12, display: 'block' }}>
            {detail.title || detail.logicKey || 'Trigger'}
          </span>
          {detail.description && (
            <span
              style={{
                color: '#64748b',
                fontSize: 10,
                display: 'block',
                marginTop: 2,
                lineHeight: 1.4,
              }}
            >
              {detail.description}
            </span>
          )}
        </div>

        {/* Detail rows */}
        {rows.length > 0 && (
          <div style={{ padding: '6px 0' }}>
            {rows.map((row) => {
              const isTriggeredRow = row.highlight;
              const triggeredVal = triggered;
              return (
                <div
                  key={row.label}
                  style={{
                    display: 'flex',
                    padding: '3px 12px',
                    gap: 8,
                    alignItems: 'flex-start',
                    background: isTriggeredRow ? '#f8fafc' : undefined,
                    borderBottom: isTriggeredRow ? '1px solid #f1f5f9' : undefined,
                    marginBottom: isTriggeredRow ? 2 : undefined,
                  }}
                >
                  <span
                    style={{
                      color: '#94a3b8',
                      flexShrink: 0,
                      width: 96,
                      fontSize: 10,
                      paddingTop: isTriggeredRow ? 2 : 1,
                    }}
                  >
                    {row.label}
                  </span>
                  {isTriggeredRow ? (
                    <span
                      style={{
                        padding: '1px 8px',
                        borderRadius: 999,
                        fontSize: 10,
                        fontWeight: 700,
                        background:
                          triggeredVal === undefined
                            ? '#f1f5f9'
                            : triggeredVal
                              ? '#dcfce7'
                              : '#fee2e2',
                        color:
                          triggeredVal === undefined
                            ? '#64748b'
                            : triggeredVal
                              ? '#16a34a'
                              : '#dc2626',
                      }}
                    >
                      {triggeredVal === undefined ? '— Unknown' : triggeredVal ? '✓ Yes' : '✗ No'}
                    </span>
                  ) : (
                    <span
                      style={{
                        color: '#334155',
                        fontWeight: 500,
                        flex: 1,
                        wordBreak: 'break-all',
                        fontSize: row.label === 'Trigger Statement' ? 10 : 11,
                        fontFamily: row.label === 'Trigger Statement' ? 'monospace' : undefined,
                      }}
                    >
                      {row.value}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export function ExtendedLogicTree({
  groups,
  joinOperator,
  getTriggerLabel,
  triggerStatuses = {},
  triggerDetails = {},
  onTriggerClick,
}: ExtendedLogicTreeProps) {
  const hasMultipleGroups = groups.length > 1;
  const containerRef = React.useRef<HTMLDivElement>(null);

  const [hoveredTrigger, setHoveredTrigger] = React.useState<{
    key: string;
    x: number;
    y: number;
  } | null>(null);

  const allTriggers: { key: string; groupIndex: number }[] = groups.flatMap(
    (g, gi) => g.triggers.map((key) => ({ key, groupIndex: gi })),
  );

  const leafCount = Math.max(allTriggers.length, 1);
  const leafSpacing = Math.max(TRIGGER_W + COL_GAP, 160);
  const totalLeafWidth = leafCount * leafSpacing;
  const canvasWidth = Math.max(totalLeafWidth, 400);

  const rowResult = 40;
  const rowGroups = hasMultipleGroups ? rowResult + ROW_GAP : rowResult;
  const rowTriggers = rowGroups + ROW_GAP;
  const canvasHeight = rowTriggers + NODE_H + 36; // extra room for triggered badge

  const triggerPositions = allTriggers.map((_, i) => ({
    x: (i + 0.5) * (canvasWidth / leafCount),
    y: rowTriggers,
  }));

  const groupPositions = groups.map((g, gi) => {
    const myTriggerIndices = allTriggers
      .map((t, i) => (t.groupIndex === gi ? i : -1))
      .filter((i) => i >= 0);
    if (myTriggerIndices.length === 0) return { x: canvasWidth / 2, y: rowGroups };
    const xs = myTriggerIndices.map((i) => triggerPositions[i].x);
    const avgX = xs.reduce((a, b) => a + b, 0) / xs.length;
    return { x: avgX, y: rowGroups };
  });

  const resultX = canvasWidth / 2;
  const resultY = rowResult;

  const groupStatuses = groups.map((g) => computeGroupStatus(g, triggerStatuses));
  const rootStatus = computeRootStatus(groups, joinOperator, triggerStatuses);

  const handleTriggerMouseEnter = (
    e: React.MouseEvent<SVGGElement>,
    key: string,
  ) => {
    const r = containerRef.current?.getBoundingClientRect();
    if (!r) return;
    setHoveredTrigger({ key, x: e.clientX - r.left, y: e.clientY - r.top });
  };

  const handleTriggerMouseMove = (e: React.MouseEvent<SVGGElement>) => {
    const r = containerRef.current?.getBoundingClientRect();
    if (!r) return;
    setHoveredTrigger((prev) =>
      prev ? { ...prev, x: e.clientX - r.left, y: e.clientY - r.top } : null,
    );
  };

  const containerWidth = containerRef.current?.clientWidth ?? canvasWidth;

    return (
    <div ref={containerRef} className="w-full overflow-x-auto relative">
      <svg
        width={canvasWidth}
        height={canvasHeight}
        className="mx-auto block"
        style={{ minWidth: 320 }}
      >
        {/* ── Edges: result → groups ── */}
        {hasMultipleGroups &&
          groupPositions.map((gp, gi) => {
            const midY = (resultY + RESULT_H / 2 + gp.y - NODE_H / 2) / 2;
            const x1 = resultX;
            const y1 = resultY + RESULT_H / 2;
            const x2 = gp.x;
            const y2 = gp.y - NODE_H / 2;
            return (
              <g key={`edge-result-g${gi}`}>
                <path
                  d={`M${x1},${y1} C${x1},${midY} ${x2},${midY} ${x2},${y2}`}
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth={1.5}
                  strokeDasharray="4 3"
                />
                {operatorBadge((x1 + x2) / 2, (y1 + y2) / 2, joinOperator)}
              </g>
            );
          })}

        {/* ── Edges: groups → triggers ── */}
        {groups.map((group, gi) => {
          const gp = groupPositions[gi];
          const myTriggerIndices = allTriggers
            .map((t, i) => (t.groupIndex === gi ? i : -1))
            .filter((i) => i >= 0);

          return myTriggerIndices.map((ti, localIdx) => {
            const tp = triggerPositions[ti];
            const x1 = gp.x;
            const y1 = gp.y + NODE_H / 2;
            const x2 = tp.x;
            const y2 = tp.y - TRIGGER_H / 2;
            const midY = (y1 + y2) / 2;
            return (
              <g key={`edge-g${gi}-t${ti}`}>
                <path
                  d={`M${x1},${y1} C${x1},${midY} ${x2},${midY} ${x2},${y2}`}
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth={1.5}
                  strokeDasharray="4 3"
                />
                {localIdx > 0 &&
                  operatorBadge((x1 + x2) / 2, (y1 + y2) / 2, group.operator)}
              </g>
            );
          });
        })}

        {/* ── Result node ── */}
        {hasMultipleGroups && (
          <g>
            <rect
              x={resultX - RESULT_W / 2}
              y={resultY}
              width={RESULT_W}
              height={RESULT_H}
              rx={10}
              fill="#fff7ed"
              stroke={rootStatus === true ? '#f97316' : '#fdba74'}
              strokeWidth={rootStatus === true ? 2 : 1.5}
            />
            <text
              x={resultX}
              y={resultY + RESULT_H / 2 - 7}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={12}
              fontWeight="700"
              fill="#c2410c"
            >
              ALERT ACTIVATED
            </text>
            <text
              x={resultX}
              y={resultY + RESULT_H / 2 + 8}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={9}
              fontWeight="400"
              fill="#ea580c"
            >
              all conditions satisfied
            </text>
            <StatusDot
              cx={resultX + RESULT_W / 2 - 8}
              cy={resultY + 8}
              status={rootStatus}
            />
          </g>
        )}

        {/* ── Group nodes ── */}
        {groups.map((group, gi) => {
          const gp = groupPositions[gi];
          const color = GROUP_COLORS[gi % GROUP_COLORS.length];
          const opColor = group.operator === 'AND' ? '#3b82f6' : '#f97316';
          const gStatus = groupStatuses[gi];
          return (
            <g key={`group-${gi}`}>
              <rect
                x={gp.x - NODE_W / 2}
                y={gp.y - NODE_H / 2}
                width={NODE_W}
                height={NODE_H}
                rx={8}
                fill={color.fill}
                stroke={color.stroke}
                strokeWidth={1.5}
              />
              <text
                x={gp.x - 18}
                y={gp.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={11}
                fontWeight="600"
                fill={color.text}
              >
                {`Group ${gi + 1}`}
              </text>
              <rect
                x={gp.x + 8}
                y={gp.y - 9}
                width={30}
                height={18}
                rx={9}
                fill={opColor}
              />
              <text
                x={gp.x + 23}
                y={gp.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={9}
                fontWeight="700"
                fill="#fff"
              >
                {group.operator}
              </text>
              <StatusDot
                cx={gp.x + NODE_W / 2 - 8}
                cy={gp.y - NODE_H / 2 + 8}
                status={gStatus}
              />
            </g>
          );
        })}

        {/* ── Trigger leaf nodes ── */}
        {allTriggers.map((t, i) => {
          const tp = triggerPositions[i];
          const color = GROUP_COLORS[t.groupIndex % GROUP_COLORS.length];
          const label = getTriggerLabel(t.key);
          const maxChars = 16;
          const displayLabel =
            label.length > maxChars ? label.slice(0, maxChars) + '…' : label;
          const tStatus =
            triggerStatuses[t.key] !== undefined
              ? triggerStatuses[t.key]
              : undefined;
          const isHovered = hoveredTrigger?.key === t.key;
          const isTriggered = triggerDetails[t.key]?.isTriggered === true;

          // Node colors: green palette when triggered, group color otherwise
          const nodeFill   = isTriggered ? '#f0fdf4' : color.fill;
          const nodeStroke = isTriggered
            ? '#16a34a'
            : isHovered
              ? color.badge
              : color.stroke;
          const nodeStrokeW = isTriggered || isHovered ? 2 : 1.5;
          const textFill   = isTriggered ? '#15803d' : color.text;

          // Badge geometry (sits just below the node rect)
          const badgeW = 72;
          const badgeH = 15;
          const badgeY = tp.y + TRIGGER_H / 2 + 5;

          return (
            <g
              key={`trigger-${i}`}
              style={{ cursor: onTriggerClick ? 'pointer' : 'default' }}
              onMouseEnter={(e) => handleTriggerMouseEnter(e, t.key)}
              onMouseMove={handleTriggerMouseMove}
              onMouseLeave={() => setHoveredTrigger(null)}
              onClick={() => onTriggerClick?.(t.key)}
            >
              {/* Glow ring when triggered */}
              {isTriggered && (
                <rect
                  x={tp.x - TRIGGER_W / 2 - 3}
                  y={tp.y - TRIGGER_H / 2 - 3}
                  width={TRIGGER_W + 6}
                  height={TRIGGER_H + 6}
                  rx={11}
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth={1}
                  opacity={0.35}
                />
              )}

              <rect
                x={tp.x - TRIGGER_W / 2}
                y={tp.y - TRIGGER_H / 2}
                width={TRIGGER_W}
                height={TRIGGER_H}
                rx={8}
                fill={nodeFill}
                stroke={nodeStroke}
                strokeWidth={nodeStrokeW}
              />
              <title>{label}</title>
              <text
                x={tp.x - 6}
                y={tp.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={10}
                fontWeight={isTriggered ? '700' : '500'}
                fill={textFill}
              >
                {displayLabel}
              </text>
              <StatusDot
                cx={tp.x + TRIGGER_W / 2 - 8}
                cy={tp.y - TRIGGER_H / 2 + 8}
                status={tStatus}
              />

              {/* "✓ Triggered" badge below the node */}
              {isTriggered && (
                <g>
                  <rect
                    x={tp.x - badgeW / 2}
                    y={badgeY}
                    width={badgeW}
                    height={badgeH}
                    rx={badgeH / 2}
                    fill="#16a34a"
                  />
                  <text
                    x={tp.x}
                    y={badgeY + badgeH / 2 + 0.5}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={8}
                    fontWeight="700"
                    fill="#fff"
                    letterSpacing="0.3"
                  >
                    ✓ TRIGGERED
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* ── Hover tooltip ── */}
      {hoveredTrigger && triggerDetails[hoveredTrigger.key] && (
        <TriggerTooltip
          detail={triggerDetails[hoveredTrigger.key]}
          x={hoveredTrigger.x}
          y={hoveredTrigger.y}
          containerWidth={containerWidth}
        />
      )}

      {/* Legend */}
      {Object.keys(triggerStatuses).length > 0 && (
        <div className="flex items-center justify-center gap-4 mt-2 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500" />
            Condition met
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-slate-400" />
            Not met
          </span>
        </div>
      )}
    </div>
  );
}
