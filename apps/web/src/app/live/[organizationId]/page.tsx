'use client'

import { PrizeWheel } from "@/components/wheel";
import type { CampaignType } from "@/models/Campaign";
import { Button, cn } from "@repo/components";
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useCustomerViewState } from "./controller";
import { useSearchParams, useParams } from 'next/navigation'
import Link from "next/link";
import { themes } from "@/models/Theme";


export default function () {
  // Set the state of the customer view
  const [state, setState] = useCustomerViewState()
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setSelectedIndex((current) =>
        current === state.campaigns.list.length - 1 ? 0 : current + 1
      );
    }, 8000);
    return () => clearInterval(timer);
  }, [state.campaigns.list.length]);

  return (
    <div
      style={{ width: `${state.campaigns.list.length * 100}vw` }}
      className={cn("overflow-hidden h-[100vh] relative")}
    >
      <AnimatePresence initial={false}>
        {state.campaigns.list.map((campaign: CampaignType, index: number) => {
          if (index !== selectedIndex) return null;
          const theme = themes[campaign.themeId]
          return (
            <div
              key={campaign.id}
              className={cn(`grid grid-rows-[3fr_1fr] w-[100vw] h-full absolute`)}
            >
              <div className="relative flex justify-center">
                <motion.div
                  initial="enter"
                  animate="center"
                  exit="exit"
                  variants={{
                    enter: { x: '100vw' },
                    center: { x: 0 },
                    exit: { x: '-100vw' },
                  }}
                  transition={{ type: 'tween', duration: 0.3 }}
                  className="absolute bottom-0 flex items-center"
                >
                  <PrizeWheel
                    className="w-[max(100vw,90vh)] rotate-90"
                    prizes={campaign.prizes}
                    theme={theme}
                    state={{ animating: true }}
                  />
                </motion.div>
              </div>
              <div className={cn(
                "p-4 text-3xl leading-relaxed flex flex-col gap-2 items-center justify-center",
                "text-center"
              )}>
                <motion.div
                  initial="enter"
                  animate="center"
                  exit="exit"
                  variants={{
                    enter: { opacity: 0 },
                    center: { opacity: 1 },
                    exit: { opacity: 0 },
                  }}
                  className={cn(
                    "bg-slate-200/60 border border-white backdrop-blur-sm p-4",
                    "max-w-[90vw] w-128 rounded-lg"
                  )}
                >
                  <div>
                    You could win
                    <span
                      className={cn(
                        "m-2 px-2 p-1 border bg-slate-200 border-slate-400 rounded-md",
                      )}>{campaign.prizes[0].name}</span>
                    if you
                    <span
                      className={cn(
                        "m-2 px-2 p-1 border bg-slate-200 border-slate-400 rounded-md",
                      )}>{campaign.action.label}</span>
                  </div>

                  <Button asChild size="lg" className="mt-8">
                    <Link href={{
                      pathname: `/live/${state.organization.id}/campaigns`,
                      query: { selectedCampaign: state.campaigns.selected }
                    }}>Get Started</Link>
                  </Button>
                </motion.div>
              </div>
            </div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
