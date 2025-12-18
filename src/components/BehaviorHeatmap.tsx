'use client';

interface BehaviorBucket {
  loginAttemptsLabel: string;
  failedLoginsLabel: string;
  sessionCount: number;
  attackCount: number;
  attackRate: number;
}

interface BehaviorHeatmapProps {
  data: BehaviorBucket[];
}

export default function BehaviorHeatmap({ data }: BehaviorHeatmapProps) {
  const loginAttemptsLabels = ['1', '2-3', '4-5', '6+'];
  const failedLoginsLabels = ['0', '1-2', '3-4', '5+'];

  const getColor = (attackRate: number) => {
    if (attackRate >= 75) return 'bg-red-600 text-white';
    if (attackRate >= 50) return 'bg-orange-500 text-white';
    if (attackRate >= 25) return 'bg-yellow-500 text-white';
    if (attackRate > 0) return 'bg-green-600 text-white';
    return 'bg-slate-700 text-slate-300';
  };

  const getCellData = (loginLabel: string, failedLabel: string) => {
    return data.find(
      d => d.loginAttemptsLabel === loginLabel && d.failedLoginsLabel === failedLabel
    );
  };

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-base font-semibold text-slate-200 mb-1">
        Authentication Behavior
      </h3>
      <p className="text-xs text-slate-400 mb-2">
        Attack rate by login attempts vs failed logins.
      </p>

      {/* Main heatmap area */}
      <div className="flex-grow min-h-0 flex flex-col gap-2">
        {/* Header row */}
        <div className="grid grid-cols-[minmax(0,1.5fr)_repeat(4,minmax(0,1fr))] gap-1">
          <div className="text-[10px] font-medium text-slate-400 flex items-end justify-start pb-1 leading-tight">
            Failed Logins →
            <br />
            Login Attempts ↓
          </div>
          {loginAttemptsLabels.map(label => (
            <div
              key={label}
              className="text-xs font-medium text-slate-300 text-center pb-1"
            >
              {label}
            </div>
          ))}
        </div>

        {/* Data rows fill remaining vertical space */}
        <div className="flex-grow min-h-0 grid grid-rows-4 gap-1">
          {failedLoginsLabels.map(failedLabel => (
            <div
              key={failedLabel}
              className="grid grid-cols-[minmax(0,1.5fr)_repeat(4,minmax(0,1fr))] gap-1"
            >
              <div className="text-xs font-medium text-slate-300 flex items-center">
                {failedLabel}
              </div>
              {loginAttemptsLabels.map(loginLabel => {
                const cellData = getCellData(loginLabel, failedLabel);
                return (
                  <div
                    key={`${loginLabel}-${failedLabel}`}
                    className={`h-full rounded flex flex-col items-center justify-center px-1 py-0.5 ${
                      cellData && cellData.sessionCount > 0
                        ? getColor(cellData.attackRate)
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {cellData && cellData.sessionCount > 0 ? (
                      <>
                        <span className="text-sm font-bold leading-tight">
                          {cellData.attackRate.toFixed(0)}%
                        </span>
                        <span className="text-[10px] opacity-80 leading-tight">
                          {cellData.sessionCount}
                        </span>
                      </>
                    ) : (
                      <span className="text-xs leading-tight">-</span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend – compact so it doesn’t cause overflow */}
      <div className="mt-2 pt-2 border-t border-slate-800 text-[11px]">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-slate-400 font-medium">Attack Rate:</span>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-600 rounded-sm" />
              <span className="text-slate-400">&gt;0%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-500 rounded-sm" />
              <span className="text-slate-400">&ge;25%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-orange-500 rounded-sm" />
              <span className="text-slate-400">&ge;50%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-600 rounded-sm" />
              <span className="text-slate-400">&ge;75%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
