"use client";

import { useRouter, useParams } from "next/navigation";
import {
  TrainFront,
  ArrowLeft,
  MapPin,
  Clock3,
  Gauge,
  CircleCheck,
  AlertTriangle,
} from "lucide-react";

import { useState, useEffect } from "react";
import { fetchApi } from "../../../../services/api";

export default function TrainPage() {
  const router = useRouter();
  const params = useParams();

  const trainNumber = params.trainNumber;

  const [train, setTrain] = useState({
    name: "Loading...",
    status: "Loading...",
    delay: "--",
    currentLocation: "--",
    from: "--",
    destination: "--",
    speed: "--",
    platform: "--",
  });
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!trainNumber) return;

    const loadTrainData = async () => {
      try {
        setLoading(true);
        const [trainRes, statusRes, scheduleRes] = await Promise.all([
          fetchApi(`/trains/${trainNumber}`),
          fetchApi(`/trains/${trainNumber}/status`),
          fetchApi(`/trains/${trainNumber}/schedule`)
        ]);

        let updatedTrain = { ...train };
        if (trainRes.success && trainRes.data) {
          updatedTrain.name = trainRes.data.train_name || trainRes.data.train_number;
          updatedTrain.from = trainRes.data.origin_station_id || 'Unknown';
          updatedTrain.destination = trainRes.data.destination_station_id || 'Unknown';
        } else {
          updatedTrain.name = "Unknown Train";
        }

        if (statusRes.success && statusRes.data) {
          updatedTrain.status = statusRes.data.status || 'UNKNOWN';
          updatedTrain.delay = statusRes.data.current_delay_min > 0 ? `+${statusRes.data.current_delay_min} min` : 'On time';
          updatedTrain.currentLocation = statusRes.data.current_section_id || '--';
        }

        setTrain(updatedTrain);

        if (scheduleRes.success && scheduleRes.data) {
          const uniqueStations = new Map();
          scheduleRes.data.forEach(s => {
            if (!uniqueStations.has(s.station_id)) uniqueStations.set(s.station_id, s);
          });
          const deduplicated = Array.from(uniqueStations.values());
          const sortedSchedule = deduplicated.sort((a, b) => new Date(a.scheduled_arrival_time) - new Date(b.scheduled_arrival_time));
          setStations(sortedSchedule.map(s => {
            const timeObj = new Date(s.scheduled_arrival_time);
            return {
              name: s.station_id,
              code: s.station_id,
              time: isNaN(timeObj) ? '--:--' : timeObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              status: s.actual_arrival_time ? 'completed' : 'upcoming'
            };
          }));
        }
      } catch (err) {
        console.error("Error fetching train details:", err);
      } finally {
        setLoading(false);
      }
    };

    loadTrainData();
  }, [trainNumber]);

  return (
    <main className="min-h-screen bg-[#f5f7fa] text-[#192f4d]">

      {/* NAVBAR */}
      <header className="sticky top-0 z-40 h-[68px] border-b border-[#e1e6ec] bg-white">

        <div className="flex h-full items-center justify-between px-5 lg:px-8">

          <div className="flex items-center gap-3">

            <button
              onClick={() => router.back()}
              className="flex h-[36px] w-[36px] items-center justify-center rounded-[9px] border border-[#e1e6ec] bg-white hover:bg-[#f5f7fa]"
            >
              <ArrowLeft
                size={17}
                className="text-[#52647b]"
              />
            </button>

            <div className="flex h-[39px] w-[39px] items-center justify-center rounded-[11px] bg-[#ecf1f9]">
              <TrainFront
                size={22}
                className="text-[#264673]"
              />
            </div>

            <div>
              <p className="text-[15px] font-bold leading-none">
                AreThereYet ?
              </p>

              <p className="mt-[4px] text-[8px] font-semibold uppercase tracking-[0.15em] text-[#8995a5]">
                Train Intelligence
              </p>
            </div>

          </div>

          <div className="rounded-full bg-[#f3f7f5] px-3 py-[7px]">
            <div className="flex items-center gap-2">

              <span className="h-[7px] w-[7px] rounded-full bg-[#5cc639]" />

              <span className="text-[10px] font-semibold text-[#587267]">
                Monitoring
              </span>

            </div>
          </div>

        </div>

      </header>


      {/* CONTENT */}
      <div className="mx-auto max-w-[1250px] px-5 py-7 lg:px-8">

        {/* HEADER */}
        <div className="mb-5">

          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#4e8bb1]">
            Train details
          </p>

          <div className="mt-1 flex flex-wrap items-center gap-3">

            <h1 className="text-[26px] font-bold text-[#192f4d]">
              {trainNumber}
            </h1>

            <span className="text-[18px] text-[#a0a9b4]">
              ·
            </span>

            <h2 className="text-[18px] font-semibold text-[#52647b]">
              {train.name}
            </h2>

          </div>

          <p className="mt-1 text-[11px] text-[#8995a5]">
            Individual train movement and operational information.
          </p>

        </div>


        {/* OVERVIEW */}
        <section className="rounded-[15px] border border-[#dfe5eb] bg-white">

          <div className="border-b border-[#edf0f3] px-5 py-4">

            <h2 className="text-[14px] font-bold text-[#26364d]">
              Train overview
            </h2>

          </div>


          <div className="grid grid-cols-2 gap-3 p-5 md:grid-cols-4">

            <InfoCard
              icon={MapPin}
              label="Current location"
              value={train.currentLocation}
            />

            <InfoCard
              icon={Clock3}
              label="Delay"
              value={train.delay}
              warning={train.status === "Delayed"}
            />

            <InfoCard
              icon={Gauge}
              label="Current speed"
              value={train.speed}
            />

            <InfoCard
              icon={TrainFront}
              label="Platform"
              value={train.platform}
            />

          </div>

        </section>


        {/* STATUS */}
        <section className="mt-5 rounded-[15px] border border-[#dfe5eb] bg-white">

          <div className="border-b border-[#edf0f3] px-5 py-4">

            <h2 className="text-[14px] font-bold text-[#26364d]">
              Current status
            </h2>

          </div>

          <div className="flex items-center gap-4 p-5">

            <div
              className={`flex h-[42px] w-[42px] items-center justify-center rounded-full ${train.status === "DELAYED"
                  ? "bg-[#fce8ea]"
                  : "bg-[#eff9eb]"
                }`}
            >
              {train.status === "DELAYED" ? (
                <AlertTriangle
                  size={20}
                  className="text-[#e31c2d]"
                />
              ) : (
                <CircleCheck
                  size={20}
                  className="text-[#4a9e2e]"
                />
              )}
            </div>

            <div>

              <p className="text-[13px] font-bold text-[#26364d]">
                {train.status}
              </p>

              <p className="mt-1 text-[10px] text-[#8995a5]">
                Train is currently being monitored on the route.
              </p>

            </div>

          </div>

        </section>


        {/* ROUTE */}
        <section className="mt-5 rounded-[15px] border border-[#dfe5eb] bg-white">

          <div className="border-b border-[#edf0f3] px-5 py-4">

            <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#4e8bb1]">
              Journey
            </p>

            <h2 className="mt-1 text-[15px] font-bold text-[#26364d]">
              {train.from} → {train.destination}
            </h2>

          </div>


          <div className="px-6 py-8">

            <div className="relative">

              {/* LINE */}
              <div className="absolute left-[4%] right-[4%] top-[10px] h-[3px] bg-[#dce3ea]" />


              <div className="relative flex justify-between">

                {stations.length === 0 && !loading && (
                  <div className="text-center text-[#8995a5] text-sm w-full py-5">No schedule available.</div>
                )}
                {stations.map((station) => (

                  <div
                    key={station.code}
                    className="flex w-[90px] flex-col items-center"
                  >

                    <div
                      className={`flex h-[22px] w-[22px] items-center justify-center rounded-full ring-4 ${station.status === "completed"
                          ? "bg-[#5cc639] ring-[#e0f2da]"
                          : station.status === "current"
                            ? "bg-[#4e8bb1] ring-[#dcecf4]"
                            : "bg-white ring-[#dce3ea]"
                        }`}
                    >
                      {station.status === "completed" && (
                        <CircleCheck
                          size={12}
                          className="text-white"
                        />
                      )}
                    </div>

                    <p className="mt-3 whitespace-nowrap text-[9px] font-bold text-[#52647b]">
                      {station.name}
                    </p>

                    <p className="mt-1 text-[8px] text-[#a0a9b4]">
                      {station.code}
                    </p>

                    <p className="mt-1 text-[8px] font-semibold text-[#8995a5]">
                      {station.time}
                    </p>

                  </div>

                ))}

              </div>

            </div>

          </div>

        </section>


        {/* FOOTER */}
        <div className="flex items-center justify-between py-5">

          <p className="text-[9px] text-[#a2abb6]">
            RailTrack Operations System
          </p>

          <p className="text-[9px] text-[#a2abb6]">
            Train {trainNumber}
          </p>

        </div>

      </div>

    </main>
  );
}


/* =========================================================
   INFO CARD
========================================================= */

function InfoCard({
  icon: Icon,
  label,
  value,
  warning = false,
}) {

  return (
    <div className="rounded-[10px] border border-[#edf0f3] p-4">

      <div className="flex items-center justify-between">

        <p className="text-[8px] uppercase tracking-[0.07em] text-[#9aa5b3]">
          {label}
        </p>

        <Icon
          size={14}
          className={
            warning
              ? "text-[#e31c2d]"
              : "text-[#718096]"
          }
        />

      </div>

      <p
        className={`mt-2 text-[16px] font-bold ${warning
            ? "text-[#e31c2d]"
            : "text-[#264673]"
          }`}
      >
        {value}
      </p>

    </div>
  );
}