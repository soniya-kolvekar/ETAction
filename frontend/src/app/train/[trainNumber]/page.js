"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  TrainFront,
  MapPin,
  Clock3,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Navigation,
  CircleCheck,
} from "lucide-react";

const route = [
  {
    station: "Mangaluru Central",
    code: "MAQ",
    scheduled: "06:15",
    actual: "06:18",
    status: "departed",
    delay: 3,
  },
  {
    station: "Udupi",
    code: "UD",
    scheduled: "07:42",
    actual: "07:45",
    status: "departed",
    delay: 3,
  },
  {
    station: "Kundapura",
    code: "KUDA",
    scheduled: "08:18",
    actual: "08:22",
    status: "departed",
    delay: 4,
  },
  {
    station: "Shivamogga",
    code: "SME",
    scheduled: "10:55",
    actual: "11:02",
    status: "departed",
    delay: 7,
  },
  {
    station: "Hassan",
    code: "HAS",
    scheduled: "12:05",
    actual: "12:17",
    status: "current",
    delay: 12,
  },
  {
    station: "Yeshwanthpur",
    code: "YPR",
    scheduled: "14:10",
    predicted: "14:22",
    status: "upcoming",
    delay: 12,
  },
  {
    station: "KSR Bengaluru",
    code: "SBC",
    scheduled: "14:55",
    predicted: "15:11",
    status: "upcoming",
    delay: 16,
  },
];

export default function TrainStatusPage() {
  const [showReason, setShowReason] = useState(false);
  const [showPrediction, setShowPrediction] = useState(true);

  const currentStation = route.find(
    (item) => item.status === "current"
  );

  const nextStation = route.find(
    (item) => item.status === "upcoming"
  );

  return (
    <main className="min-h-screen bg-[#f5f7fa] text-[#192f4d]">

      {/* =====================================================
          NAVBAR
      ====================================================== */}
      <header className="h-[68px] border-b border-[#e3e8ee] bg-white">
        <div className="mx-auto flex h-full max-w-[1180px] items-center justify-between px-6">

          {/* Left */}
          <button
            type="button"
            className="
              flex
              items-center
              gap-2
              text-[13px]
              font-semibold
              text-[#52647b]
              transition
              hover:text-[#264673]
            "
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={18} />
            Back
          </button>

          {/* Center brand */}
          <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2">
            <TrainFront
              size={21}
              className="text-[#264673]"
            />

            <span className="text-[15px] font-bold text-[#264673]">
              RailTrack
            </span>
          </div>

          {/* Right */}
          <div className="ml-auto flex items-center gap-2">
            <div className="flex h-[31px] w-[31px] items-center justify-center rounded-full bg-[#264673] text-[11px] font-bold text-white">
              J
            </div>

            <span className="hidden text-[12px] font-semibold text-[#52647b] sm:block">
              Passenger
            </span>
          </div>
        </div>
      </header>

      {/* =====================================================
          CONTENT
      ====================================================== */}
      <section className="mx-auto max-w-[1000px] px-5 pb-16 pt-7">

        {/* ===================================================
            TRAIN HEADER
        ==================================================== */}
        <div className="rounded-[20px] border border-[#dfe5ec] bg-white p-5 shadow-[0_5px_20px_rgba(25,47,77,0.05)]">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            {/* Train identity */}
            <div className="flex items-center gap-4">

              <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[15px] bg-[#ecf1f9]">
                <TrainFront
                  size={27}
                  strokeWidth={1.8}
                  className="text-[#264673]"
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-[21px] font-bold text-[#192f4d]">
                    12685
                  </h1>

                  <span className="rounded-full bg-[#eff9eb] px-2.5 py-1 text-[10px] font-bold text-[#377722]">
                    RUNNING
                  </span>
                </div>

                <p className="mt-1 text-[13px] text-[#718096]">
                  Mangaluru Central Express
                </p>
              </div>
            </div>

            {/* Current status */}
            <div className="sm:text-right">
              <p className="text-[11px] font-medium uppercase tracking-wide text-[#8995a5]">
                Current location
              </p>

              <div className="mt-1 flex items-center gap-1.5 sm:justify-end">
                <MapPin
                  size={15}
                  className="text-[#264673]"
                />

                <span className="text-[15px] font-bold text-[#264673]">
                  {currentStation.station}
                </span>
              </div>

              <p className="mt-1 text-[12px] font-semibold text-[#e31c2d]">
                {currentStation.delay} min late
              </p>
            </div>

          </div>
        </div>

        {/* ===================================================
            NEXT STATION + ETA
        ==================================================== */}
        <div className="mt-5 grid gap-5 md:grid-cols-[1.3fr_1fr]">

          {/* Next station */}
          <div className="rounded-[20px] bg-[#264673] p-6 text-white shadow-[0_7px_25px_rgba(38,70,115,0.18)]">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/60">
                  Next station
                </p>

                <h2 className="mt-2 text-[25px] font-bold">
                  {nextStation.station}
                </h2>

                <p className="mt-1 text-[12px] text-white/65">
                  {nextStation.code}
                </p>
              </div>

              <div className="flex h-[50px] w-[50px] items-center justify-center rounded-[15px] bg-white/10">
                <Navigation
                  size={24}
                  className="text-white"
                />
              </div>

            </div>

            <div className="mt-7 flex items-end justify-between">

              <div>
                <p className="text-[10px] uppercase tracking-wide text-white/55">
                  Predicted arrival
                </p>

                <p className="mt-1 text-[30px] font-bold">
                  {nextStation.predicted}
                </p>
              </div>

              <div className="rounded-full bg-white/10 px-3 py-1.5">
                <span className="text-[12px] font-semibold">
                  +{nextStation.delay} min
                </span>
              </div>

            </div>
          </div>

          {/* Journey status */}
          <div className="rounded-[20px] border border-[#dfe5ec] bg-white p-6">

            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8995a5]">
                Journey status
              </p>

              <CircleCheck
                size={19}
                className="text-[#4a9e2e]"
              />
            </div>

            <div className="mt-5 flex items-end justify-between">

              <div>
                <p className="text-[12px] text-[#8995a5]">
                  Overall delay
                </p>

                <p className="mt-1 text-[28px] font-bold text-[#e31c2d]">
                  +12 min
                </p>
              </div>

              <div className="text-right">
                <p className="text-[12px] text-[#8995a5]">
                  Stations passed
                </p>

                <p className="mt-1 text-[22px] font-bold text-[#264673]">
                  5 / 7
                </p>
              </div>

            </div>

            <div className="mt-5 h-[7px] overflow-hidden rounded-full bg-[#edf0f4]">
              <div
                className="h-full rounded-full bg-[#264673]"
                style={{ width: "71%" }}
              />
            </div>

          </div>
        </div>

        {/* ===================================================
            ROUTE
        ==================================================== */}
        <div className="mt-5 rounded-[20px] border border-[#dfe5ec] bg-white p-6 shadow-[0_5px_20px_rgba(25,47,77,0.04)]">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-[18px] font-bold text-[#192f4d]">
                Train route
              </h2>

              <p className="mt-1 text-[12px] text-[#8995a5]">
                Live journey progress
              </p>
            </div>

            <div className="flex items-center gap-4 text-[10px] font-medium text-[#7b8797]">
              <span className="flex items-center gap-1.5">
                <span className="h-[8px] w-[8px] rounded-full bg-[#4a9e2e]" />
                Passed
              </span>

              <span className="flex items-center gap-1.5">
                <span className="h-[8px] w-[8px] rounded-full bg-[#264673]" />
                Current
              </span>

              <span className="flex items-center gap-1.5">
                <span className="h-[8px] w-[8px] rounded-full border border-[#b7c1ce] bg-white" />
                Upcoming
              </span>
            </div>

          </div>

          {/* Route timeline */}
          <div className="relative mt-7">

            {/* Vertical line */}
            <div
              className="
                absolute
                left-[18px]
                top-[8px]
                h-[calc(100%-16px)]
                w-[2px]
                bg-[#e1e6ed]
              "
            />

            <div
              className="
                absolute
                left-[18px]
                top-[8px]
                h-[71%]
                w-[2px]
                bg-[#264673]
              "
            />

            <div className="space-y-0">

              {route.map((station, index) => {

                const isCurrent =
                  station.status === "current";

                const isPassed =
                  station.status === "departed";

                return (
                  <div
                    key={station.code}
                    className={`
                      relative
                      flex
                      min-h-[76px]
                      items-start
                      gap-5
                      ${isCurrent ? "rounded-[14px] bg-[#f5f8fc]" : ""}
                    `}
                  >

                    {/* Dot */}
                    <div className="relative z-10 flex w-[37px] shrink-0 justify-center">

                      {isCurrent ? (
                        <div className="flex h-[37px] w-[37px] items-center justify-center rounded-full bg-[#264673] shadow-[0_0_0_5px_#ecf1f9]">
                          <TrainFront
                            size={18}
                            className="text-white"
                          />
                        </div>
                      ) : isPassed ? (
                        <div className="mt-[7px] flex h-[21px] w-[21px] items-center justify-center rounded-full bg-[#4a9e2e]">
                          <CircleCheck
                            size={13}
                            className="text-white"
                          />
                        </div>
                      ) : (
                        <div className="mt-[7px] h-[18px] w-[18px] rounded-full border-[3px] border-[#c4ccd7] bg-white" />
                      )}

                    </div>

                    {/* Station information */}
                    <div className="flex flex-1 items-start justify-between px-2 py-[5px]">

                      <div>
                        <div className="flex items-center gap-2">

                          <p
                            className={`
                              text-[14px]
                              font-bold
                              ${
                                isCurrent
                                  ? "text-[#264673]"
                                  : "text-[#33445a]"
                              }
                            `}
                          >
                            {station.station}
                          </p>

                          <span className="text-[10px] font-medium text-[#a0a8b3]">
                            {station.code}
                          </span>

                        </div>

                        {isCurrent && (
                          <p className="mt-1 text-[11px] font-semibold text-[#264673]">
                            ● Train is currently here
                          </p>
                        )}

                        {isPassed && (
                          <p className="mt-1 text-[10px] text-[#7e8a99]">
                            Arrived at {station.actual}
                          </p>
                        )}

                        {station.status === "upcoming" && (
                          <p className="mt-1 text-[10px] text-[#7e8a99]">
                            Predicted arrival
                          </p>
                        )}
                      </div>

                      <div className="text-right">

                        <p className="text-[11px] text-[#9aa4b1]">
                          Scheduled
                        </p>

                        <p className="mt-0.5 text-[13px] font-semibold text-[#4d5d71]">
                          {station.scheduled}
                        </p>

                        {isPassed && (
                          <p className="mt-1 text-[10px] font-semibold text-[#4a9e2e]">
                            {station.actual}
                          </p>
                        )}

                        {station.status === "upcoming" && (
                          <p className="mt-1 text-[10px] font-bold text-[#e31c2d]">
                            {station.predicted}
                          </p>
                        )}

                      </div>

                    </div>
                  </div>
                );
              })}

            </div>
          </div>
        </div>

        {/* ===================================================
            WHY DELAYED
        ==================================================== */}
        <div className="mt-5 overflow-hidden rounded-[20px] border border-[#e4e7eb] bg-white">

          <button
            type="button"
            onClick={() =>
              setShowReason(!showReason)
            }
            className="
              flex
              w-full
              items-center
              justify-between
              px-6
              py-5
              text-left
              transition
              hover:bg-[#fafbfd]
            "
          >
            <div className="flex items-center gap-3">

              <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[11px] bg-[#fce8ea]">
                <AlertTriangle
                  size={19}
                  className="text-[#e31c2d]"
                />
              </div>

              <div>
                <h2 className="text-[14px] font-bold text-[#26364d]">
                  Why is this train delayed?
                </h2>

                <p className="mt-1 text-[11px] text-[#8995a5]">
                  Current delay: 12 minutes
                </p>
              </div>

            </div>

            {showReason ? (
              <ChevronUp
                size={19}
                className="text-[#718096]"
              />
            ) : (
              <ChevronDown
                size={19}
                className="text-[#718096]"
              />
            )}
          </button>

          {showReason && (
            <div className="border-t border-[#edf0f3] px-6 pb-6 pt-5">

              <div className="rounded-[14px] bg-[#fff7f7] p-4">

                <div className="flex items-start gap-3">

                  <div className="mt-0.5 h-[8px] w-[8px] shrink-0 rounded-full bg-[#e31c2d]" />

                  <div>
                    <p className="text-[13px] font-bold text-[#33445a]">
                      Congestion ahead
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-[#718096]">
                      The train experienced slower movement
                      through the previous section. Current
                      network conditions indicate continued
                      congestion ahead.
                    </p>
                  </div>

                </div>

              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-3">

                <div className="rounded-[12px] bg-[#f7f9fb] p-3">
                  <p className="text-[10px] text-[#8995a5]">
                    Delay accumulated
                  </p>

                  <p className="mt-1 text-[15px] font-bold text-[#33445a]">
                    +12 min
                  </p>
                </div>

                <div className="rounded-[12px] bg-[#f7f9fb] p-3">
                  <p className="text-[10px] text-[#8995a5]">
                    Current section
                  </p>

                  <p className="mt-1 text-[15px] font-bold text-[#33445a]">
                    Hassan
                  </p>
                </div>

                <div className="rounded-[12px] bg-[#f7f9fb] p-3">
                  <p className="text-[10px] text-[#8995a5]">
                    Network status
                  </p>

                  <p className="mt-1 text-[15px] font-bold text-[#e31c2d]">
                    Congested
                  </p>
                </div>

              </div>

            </div>
          )}
        </div>

        {/* ===================================================
            WHAT HAPPENS NEXT
        ==================================================== */}
        <div className="mt-5 overflow-hidden rounded-[20px] border border-[#dfe5ec] bg-white">

          <button
            type="button"
            onClick={() =>
              setShowPrediction(!showPrediction)
            }
            className="
              flex
              w-full
              items-center
              justify-between
              px-6
              py-5
              text-left
              transition
              hover:bg-[#fafbfd]
            "
          >

            <div>
              <h2 className="text-[14px] font-bold text-[#26364d]">
                What happens next?
              </h2>

              <p className="mt-1 text-[11px] text-[#8995a5]">
                Predicted arrival at upcoming stations
              </p>
            </div>

            {showPrediction ? (
              <ChevronUp
                size={19}
                className="text-[#718096]"
              />
            ) : (
              <ChevronDown
                size={19}
                className="text-[#718096]"
              />
            )}

          </button>

          {showPrediction && (
            <div className="border-t border-[#edf0f3]">

              {route
                .filter(
                  (item) =>
                    item.status === "upcoming"
                )
                .map((station) => (
                  <div
                    key={station.code}
                    className="
                      flex
                      items-center
                      justify-between
                      border-b
                      border-[#f0f2f5]
                      px-6
                      py-4
                      last:border-b-0
                    "
                  >

                    <div className="flex items-center gap-3">

                      <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#ecf1f9]">
                        <MapPin
                          size={16}
                          className="text-[#264673]"
                        />
                      </div>

                      <div>
                        <p className="text-[13px] font-bold text-[#33445a]">
                          {station.station}
                        </p>

                        <p className="mt-0.5 text-[10px] text-[#8995a5]">
                          Scheduled {station.scheduled}
                        </p>
                      </div>

                    </div>

                    <div className="text-right">

                      <p className="text-[14px] font-bold text-[#264673]">
                        {station.predicted}
                      </p>

                      <p className="mt-0.5 text-[10px] font-semibold text-[#e31c2d]">
                        +{station.delay} min
                      </p>

                    </div>

                  </div>
                ))}

            </div>
          )}

        </div>

        {/* ===================================================
            LAST UPDATED
        ==================================================== */}
        <div className="mt-6 flex items-center justify-center gap-1.5 text-[10px] text-[#9aa3ae]">

          <Clock3 size={12} />

          Last updated just now

        </div>

      </section>
    </main>
  );
}