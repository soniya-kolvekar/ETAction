"use client";

import { useState } from "react";
import {
  Search,
  ArrowRight,
  TrainFront,
  Clock3,
  MapPin,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

const trains = [
  {
    number: "12685",
    name: "Mangaluru Central Express",
    from: "Mangaluru Central",
    to: "KSR Bengaluru",
    departure: "06:15",
    arrival: "18:45",
  },
  {
    number: "16526",
    name: "KSR Bengaluru Express",
    from: "KSR Bengaluru",
    to: "Mangaluru Central",
    departure: "07:00",
    arrival: "19:30",
  },
  {
    number: "12627",
    name: "Karnataka Express",
    from: "Bengaluru",
    to: "New Delhi",
    departure: "19:20",
    arrival: "10:30",
  },
];

export default function TrainSearchPage() {
    const router = useRouter();
  const [trainNumber, setTrainNumber] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);

  const selectedTrain = trains.find(
    (train) => train.number === trainNumber
  );

  const handleSearch = (e) => {
    e.preventDefault();

    if (!trainNumber.trim()) return;

    const exists = trains.some(
      (train) => train.number === trainNumber.trim()
    );

    if (!exists) {
      alert("Train not found. Try 12685, 16526 or 12627.");
      return;
    }

    if (!recentSearches.includes(trainNumber)) {
      setRecentSearches((prev) => [
        trainNumber,
        ...prev.slice(0, 2),
      ]);
    }

    // Later:
    // router.push(`/train/${trainNumber}`);
    console.log("Selected train:", trainNumber);
  };

  const clearSearch = () => {
    setTrainNumber("");
  };

  const selectRecentTrain = (number) => {
    setTrainNumber(number);
  };

  return (
    <main className="min-h-screen bg-[#f5f7fa] text-[#192f4d]">

      {/* =====================================================
          NAVBAR
      ====================================================== */}
      <header className="h-[72px] border-b border-[#e4e8ee] bg-white">
        <div className="mx-auto flex h-full max-w-[1180px] items-center justify-between px-6">

          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-[42px] w-[42px] items-center justify-center rounded-[12px] bg-[#ecf1f9]">
              <TrainFront
                size={23}
                strokeWidth={2}
                className="text-[#264673]"
              />
            </div>

            <div>
              <p className="text-[16px] font-bold leading-none text-[#264673]">
                RailTrack
              </p>

              <p className="mt-[4px] text-[10px] font-medium tracking-[0.12em] text-[#7c8796]">
                SMART ETA
              </p>
            </div>
          </div>

          {/* User */}
          <button
            type="button"
            className="flex items-center gap-2 rounded-full border border-[#e1e6ed] bg-white px-3 py-2 transition hover:bg-[#f7f9fc]"
          >
            <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#264673] text-[12px] font-bold text-white">
              J
            </div>

            <span className="text-[13px] font-semibold text-[#35445a]">
              Passenger
            </span>
          </button>
        </div>
      </header>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}
      <section className="mx-auto max-w-[900px] px-6 pb-16 pt-[70px]">

        {/* ===================================================
            HERO
        ==================================================== */}
        <div className="text-center">

          <div className="mx-auto mb-5 flex h-[58px] w-[58px] items-center justify-center rounded-[18px] bg-[#ecf1f9]">
            <TrainFront
              size={30}
              strokeWidth={1.8}
              className="text-[#264673]"
            />
          </div>

          <h1 className="text-[34px] font-bold tracking-[-0.02em] text-[#192f4d]">
            Track your train
          </h1>

          <p className="mx-auto mt-3 max-w-[510px] text-[15px] leading-6 text-[#718096]">
            Enter your train number to see its live location,
            predicted arrival times and route status.
          </p>
        </div>

        {/* ===================================================
            SEARCH CARD
        ==================================================== */}
        <div className="mx-auto mt-9 max-w-[700px]">

          <form
            onSubmit={handleSearch}
            className="
              rounded-[20px]
              border
              border-[#e0e6ee]
              bg-white
              p-[9px]
              shadow-[0_8px_30px_rgba(25,47,77,0.08)]
            "
          >
            <div className="flex items-center">

              {/* Search icon */}
              <div className="flex w-[54px] shrink-0 items-center justify-center">
                <Search
                  size={22}
                  strokeWidth={2}
                  className="text-[#6b7c92]"
                />
              </div>

              {/* Input */}
              <input
                type="text"
                value={trainNumber}
                onChange={(e) =>
                  setTrainNumber(e.target.value)
                }
                placeholder="Enter train number"
                inputMode="numeric"
                className="
                  h-[54px]
                  min-w-0
                  flex-1
                  bg-transparent
                  text-[16px]
                  font-medium
                  text-[#192f4d]
                  outline-none
                  placeholder:text-[#9aa5b4]
                "
              />

              {/* Clear */}
              {trainNumber && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="mr-2 flex h-[34px] w-[34px] items-center justify-center rounded-full text-[#8995a5] transition hover:bg-[#f0f3f7]"
                >
                  <X size={17} />
                </button>
              )}

              {/* Search button */}
              <button
                type="submit"
                className="
                  flex
                  h-[54px]
                  shrink-0
                  items-center
                  justify-center
                  gap-2
                  rounded-[14px]
                  bg-[#264673]
                  px-7
                  text-[14px]
                  font-bold
                  text-white
                  transition
                  duration-200
                  hover:bg-[#192f4d]
                "
              >
                SEARCH

                <ArrowRight
                  size={18}
                  strokeWidth={2}
                />
              </button>
            </div>
          </form>

          {/* Hint */}
          <p className="mt-3 text-center text-[12px] text-[#8995a5]">
            Try <span className="font-semibold text-[#536983]">12685</span>
            {" "}for the demo
          </p>
        </div>

        {/* ===================================================
            SEARCH RESULT PREVIEW
        ==================================================== */}
        {selectedTrain && (
          <div className="mx-auto mt-7 max-w-[700px] overflow-hidden rounded-[18px] border border-[#dce3eb] bg-white shadow-[0_6px_22px_rgba(25,47,77,0.06)]">

            <div className="border-b border-[#edf0f4] px-5 py-4">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="flex h-[42px] w-[42px] items-center justify-center rounded-[11px] bg-[#ecf1f9]">
                    <TrainFront
                      size={21}
                      className="text-[#264673]"
                    />
                  </div>

                  <div>
                    <p className="text-[15px] font-bold text-[#192f4d]">
                      {selectedTrain.number}
                    </p>

                    <p className="text-[12px] text-[#7b8797]">
                      {selectedTrain.name}
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-[#eff9eb] px-3 py-1 text-[11px] font-semibold text-[#377722]">
                  TRAIN FOUND
                </span>

              </div>
            </div>

            {/* Route */}
            <div className="grid grid-cols-[1fr_50px_1fr] items-center px-5 py-5">

              <div>
                <p className="text-[16px] font-bold text-[#192f4d]">
                  {selectedTrain.from}
                </p>

                <div className="mt-2 flex items-center gap-1.5 text-[12px] text-[#7b8797]">
                  <Clock3 size={13} />
                  {selectedTrain.departure}
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="h-[1px] w-full bg-[#cfd8e3]" />
              </div>

              <div className="text-right">
                <p className="text-[16px] font-bold text-[#192f4d]">
                  {selectedTrain.to}
                </p>

                <div className="mt-2 flex items-center justify-end gap-1.5 text-[12px] text-[#7b8797]">
                  <Clock3 size={13} />
                  {selectedTrain.arrival}
                </div>
              </div>

            </div>

            {/* View route */}
            <button
              type="button"
             onClick={() =>
  router.push(`/train/${selectedTrain.number}`)
}
              className="
                flex
                h-[48px]
                w-full
                items-center
                justify-center
                gap-2
                border-t
                border-[#edf0f4]
                bg-[#fafbfd]
                text-[13px]
                font-bold
                text-[#264673]
                transition
                hover:bg-[#f4f7fb]
              "
            >
              VIEW LIVE TRAIN STATUS

              <ArrowRight size={17} />
            </button>

          </div>
        )}

        {/* ===================================================
            RECENT SEARCHES
        ==================================================== */}
        {recentSearches.length > 0 && (
          <div className="mx-auto mt-10 max-w-[700px]">

            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[13px] font-bold text-[#52647b]">
                Recent searches
              </h2>

              <button
                type="button"
                onClick={() => setRecentSearches([])}
                className="text-[11px] font-medium text-[#8995a5] hover:text-[#264673]"
              >
                Clear
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {recentSearches.map((number) => {
                const train = trains.find(
                  (item) => item.number === number
                );

                return (
                  <button
                    key={number}
                    type="button"
                    onClick={() =>
                      selectRecentTrain(number)
                    }
                    className="
                      rounded-[14px]
                      border
                      border-[#e0e6ee]
                      bg-white
                      p-4
                      text-left
                      transition
                      hover:-translate-y-[1px]
                      hover:border-[#b8c7da]
                      hover:shadow-[0_5px_15px_rgba(25,47,77,0.06)]
                    "
                  >
                    <div className="flex items-center gap-2">
                      <TrainFront
                        size={16}
                        className="text-[#264673]"
                      />

                      <span className="text-[14px] font-bold text-[#192f4d]">
                        {number}
                      </span>
                    </div>

                    <p className="mt-2 truncate text-[11px] text-[#7b8797]">
                      {train?.name}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ===================================================
            BOTTOM INFORMATION
        ==================================================== */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[11px] font-medium text-[#8b96a5]">

          <div className="flex items-center gap-2">
            <MapPin size={14} />
            Live location
          </div>

          <div className="flex items-center gap-2">
            <Clock3 size={14} />
            Dynamic ETA
          </div>

          <div className="flex items-center gap-2">
            <TrainFront size={14} />
            Route status
          </div>

        </div>

      </section>
    </main>
  );
}