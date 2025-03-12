"use client";
import { PrizeWheel } from "@/components/wheel";
import { themes } from "@/models/Theme";
import { cn } from "@repo/utilities";
import { useSpinCallbacks, useCustomerViewState } from "./controller";

export function WheelDisplay() {
  const { onStartSpin, onEndSpin } = useSpinCallbacks();
  const [state] = useCustomerViewState();
  const selectedCampaign = state.campaigns.selected;
  const campaignCount = state.campaigns.list.length;

  return (
    <div className={cn(
      "grid grid-rows-[1fr] md:grid-cols-[1fr_minmax(542px,1fr)] h-[100svh]",
      "w-full overflow-clip relative"
    )}>
      <div className="relative flex items-center justify-center md:block md:right-0 w-full md:w-auto">
        <div className={cn(
          "absolute transition-transform duration-700 ease-out",
          "left-1/2 md:rotate-0 md:-translate-x-1/2 top-1/2 md:-translate-y-1/2 md:top-auto md:transform-none",
          "md:left-auto md:right-0", // Center on mobile, right aligned on desktop
          "rotate-90 translate-x-[-100%] -translate-y-2/3",
          state.wheel?.centered ? `translate-y-[-54%] md:translate-x-1/2` : ''
        )}>
          <div
            className={cn(
              "transition-transform duration-700 ease-in-out flex flex-col",
              "flex-col-reverse md:flex-col",
              "translate-y-[var(--mobile-wheel-translate-selected)]",
              "md:translate-y-[var(--desktop-wheel-translate-selected)]"
            )}
            style={{
              '--desktop-wheel-translate-selected': `-${selectedCampaign * 100 / campaignCount}%`,
              '--mobile-wheel-translate-selected': `${-50 + selectedCampaign * 100 / campaignCount}%`,
            } as React.CSSProperties}
          >
            {state.campaigns.list.map((campaign, index) => {
              const isSelected = selectedCampaign === index;
              const prizeIndex = isSelected
                ? state.wheel.prizeIndex
                : undefined;
              const theme = themes[campaign.themeId];
              return (
                <div
                  className="h-[200svw] md:h-[100svh] relative flex justify-center items-center"
                  key={campaign.id}
                  onClick={async (e) => {
                    onStartSpin();
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <PrizeWheel
                    className="h-full transition-transform"
                    prizes={campaign.prizes}
                    theme={theme}
                    onTransitionEnd={() => {
                      onEndSpin();
                    }}
                    prizeIndex={prizeIndex}
                    state={{
                      animating: state.wheel.animating,
                      rotating: state.wheel.rotating,
                    }} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
