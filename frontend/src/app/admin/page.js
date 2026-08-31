"use client";

import { useState } from "react";
import {
  TrainFront,
  Route,
  Activity,
  Bell,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  MapPin,
  Clock3,
  AlertTriangle,
  CloudRain,
  Wrench,
  CircleStop,
  Gauge,
} from "lucide-react";
import { useRouter } from "next/navigation";

const trains = [
  {
    number: "12685",
    name: "Mangaluru Express",
    location: "Hassan",
    delay: "+12 min",
    status: "Delayed",
    color: "orange",
  },
  {
    number: "16526",
    name: "Karnataka Express",
    location: "Udupi",
    delay: "+04 min",
    status: "Minor delay",
    color: "yellow",
  },
  {
    number: "16575",
    name: "Gomateshwara Express",
    location: "Kundapura",
    delay: "On time",
    status: "On time",
    color: "green",
  },
];

const delayReasons = [
  {
    name: "Congestion",
    count: 9,
    icon: Activity,
  },
  {
    name: "Weather",
    count: 6,
    icon: CloudRain,
  },
  {
    name: "Maintenance",
    count: 4,
    icon: Wrench,
  },
  {
    name: "Unscheduled stoppage",
    count: 3,
    icon: CircleStop,
  },
  {
    name: "Operational",
    count: 5,
    icon: Gauge,
  },
];

const alerts = [
  {
    type: "critical",
    train: "12685",
    title: "Critical delay",
    detail: "Delay increased to +24 min",
  },
  {
    type: "warning",
    train: "16526",
    title: "Congestion ahead",
    detail: "Additional +4–7 min predicted",
  },
  {
    type: "info",
    train: "Block B18",
    title: "Maintenance block",
    detail: "Scheduled 14:30 – 15:15",
  },
];

export default function AdminDashboard() {
  const router = useRouter();

  const [selectedRoute, setSelectedRoute] =
    useState("Mangaluru → Bengaluru");

  const [showRoutes, setShowRoutes] = useState(false);

  const routeOptions = [
    "Mangaluru → Bengaluru",
    "Bengaluru → Mysuru",
    "Mangaluru → Hassan",
    "Udupi → Bengaluru",
  ];

  // Open individual train page
  const openTrain = (trainNumber) => {
    router.push(`/admin/train/${trainNumber}`);
  };

  return (
    <main className="min-h-screen bg-[#f5f7fa] text-[#192f4d]">

      {/* =====================================================
          TOP NAVBAR
      ====================================================== */}

      <header className="sticky top-0 z-40 h-[68px] border-b border-[#e1e6ec] bg-white">
        <div className="flex h-full items-center justify-between px-5 lg:px-8">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-[39px] w-[39px] items-center justify-center rounded-[11px] bg-[#ecf1f9]">
              <TrainFront
                size={22}
                className="text-[#264673]"
              />
            </div>

            <div>
              <p className="text-[15px] font-bold leading-none text-[#192f4d]">
                RailTrack
              </p>

              <p className="mt-[4px] text-[8px] font-semibold uppercase tracking-[0.15em] text-[#8995a5]">
                Control Centre
              </p>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">

            <div className="hidden items-center gap-2 rounded-full bg-[#f3f7f5] px-3 py-[7px] sm:flex">
              <span className="h-[7px] w-[7px] rounded-full bg-[#5cc639]" />

              <span className="text-[10px] font-semibold text-[#587267]">
                System operational
              </span>
            </div>

            <button
              type="button"
              className="relative flex h-[36px] w-[36px] items-center justify-center rounded-full border border-[#e3e8ee] bg-white hover:bg-[#f7f9fb]"
            >
              <Bell
                size={17}
                className="text-[#52647b]"
              />

              <span className="absolute right-[7px] top-[6px] h-[6px] w-[6px] rounded-full bg-[#e31c2d]" />
            </button>

            <div className="flex items-center gap-2">
              <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#264673] text-[11px] font-bold text-white">
                AD
              </div>

              <div className="hidden lg:block">
                <p className="text-[11px] font-bold text-[#26364d]">
                  Admin
                </p>

                <p className="text-[9px] text-[#8995a5]">
                  Control Room
                </p>
              </div>

              <ChevronDown
                size={14}
                className="hidden text-[#8995a5] lg:block"
              />
            </div>

          </div>
        </div>
      </header>


      {/* =====================================================
          PAGE
      ====================================================== */}

      <div className="mx-auto max-w-[1450px] px-5 py-6 lg:px-8">

        {/* Heading */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#4e8bb1]">
              Operations overview
            </p>

            <h1 className="mt-1 text-[25px] font-bold tracking-[-0.02em] text-[#192f4d]">
              Operations Dashboard
            </h1>

            <p className="mt-1 text-[11px] text-[#8995a5]">
              Live overview of train movement, delays and route conditions.
            </p>
          </div>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="flex h-[37px] items-center justify-center gap-2 rounded-[9px] border border-[#dce3ea] bg-white px-3 text-[10px] font-semibold text-[#52647b] shadow-sm hover:bg-[#f8fafc]"
          >
            <RefreshCw size={14} />
            Refresh data
          </button>

        </div>


        {/* =====================================================
            KPI CARDS
        ====================================================== */}

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">

          <StatCard
            label="Total trains"
            value="128"
            description="Running today"
            icon={TrainFront}
          />

          <StatCard
            label="On time"
            value="94"
            description="73.4% of trains"
            icon={Clock3}
          />

          <StatCard
            label="Delayed"
            value="27"
            description="Requires monitoring"
            icon={Activity}
            highlight
          />

          <StatCard
            label="Critical"
            value="07"
            description="Immediate attention"
            icon={AlertTriangle}
            critical
          />

        </div>


        {/* =====================================================
            NETWORK OPERATIONS
        ====================================================== */}

        <section className="mt-5 overflow-hidden rounded-[15px] border border-[#dfe5eb] bg-white">

          {/* Header */}
          <div className="flex flex-col justify-between gap-3 border-b border-[#edf0f3] px-5 py-4 sm:flex-row sm:items-center">

            <div>
              <div className="flex items-center gap-2">

                <div className="flex h-[29px] w-[29px] items-center justify-center rounded-[8px] bg-[#ecf1f9]">
                  <Route
                    size={16}
                    className="text-[#264673]"
                  />
                </div>

                <h2 className="text-[14px] font-bold text-[#26364d]">
                  Network Operations
                </h2>

              </div>

              <p className="mt-1 text-[10px] text-[#8995a5]">
                Live route and section condition overview
              </p>
            </div>


            {/* Route selector */}
            <div className="relative">

              <button
                type="button"
                onClick={() => setShowRoutes((prev) => !prev)}
                className="flex h-[37px] min-w-[230px] items-center justify-between gap-3 rounded-[8px] border border-[#dce3ea] bg-white px-3 text-left hover:bg-[#f8fafc]"
              >

                <div>
                  <p className="text-[8px] uppercase tracking-[0.1em] text-[#9aa5b3]">
                    Selected route
                  </p>

                  <p className="mt-[2px] text-[10px] font-bold text-[#264673]">
                    {selectedRoute}
                  </p>
                </div>

                <ChevronDown
                  size={14}
                  className="text-[#718096]"
                />

              </button>

              {showRoutes && (
                <div className="absolute right-0 top-[42px] z-30 w-[230px] overflow-hidden rounded-[9px] border border-[#dce3ea] bg-white shadow-lg">

                  {routeOptions.map((route) => (
                    <button
                      type="button"
                      key={route}
                      onClick={() => {
                        setSelectedRoute(route);
                        setShowRoutes(false);
                      }}
                      className="block w-full px-3 py-3 text-left text-[10px] font-semibold text-[#52647b] hover:bg-[#f4f7fb]"
                    >
                      {route}
                    </button>
                  ))}

                </div>
              )}

            </div>

          </div>


          {/* Route visualization */}
          <div className="overflow-x-auto px-5 py-7">

            <div className="min-w-[760px]">

              {/* Stations */}
              <div className="relative">

                <div className="absolute left-[5%] right-[5%] top-[14px] h-[3px] rounded-full bg-[#d9e1e9]" />

                <div className="relative flex justify-between">

                  <RouteStation
                    name="Mangaluru"
                    status="normal"
                  />

                  <RouteStation
                    name="Udupi"
                    status="normal"
                  />

                  <RouteStation
                    name="Kundapura"
                    status="busy"
                  />

                  <RouteStation
                    name="Shivamogga"
                    status="normal"
                  />

                  <RouteStation
                    name="Hassan"
                    status="critical"
                  />

                  <RouteStation
                    name="Yeshwanthpur"
                    status="risk"
                  />

                  <RouteStation
                    name="Bengaluru"
                    status="normal"
                  />

                </div>

              </div>


              {/* Train positions */}
              <div className="relative mt-8 h-[62px]">

                <div className="absolute left-[13%] top-[20px]">
                  <TrainMarker
                    number="16526"
                    delay="+4m"
                    onClick={() => openTrain("16526")}
                  />
                </div>

                <div className="absolute left-[64%] top-[3px]">
                  <TrainMarker
                    number="12685"
                    delay="+12m"
                    delayed
                    onClick={() => openTrain("12685")}
                  />
                </div>

                <div className="absolute left-[36%] top-[38px]">
                  <TrainMarker
                    number="16575"
                    delay="ON TIME"
                    onClick={() => openTrain("16575")}
                  />
                </div>

              </div>


              {/* Legend */}
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[#edf0f3] pt-4">

                <Legend
                  color="bg-[#5cc639]"
                  text="Normal"
                />

                <Legend
                  color="bg-[#e3b522]"
                  text="Busy"
                />

                <Legend
                  color="bg-[#e31c2d]"
                  text="Critical"
                />

                <Legend
                  color="bg-[#e88a22]"
                  text="Delay risk"
                />

                <span className="ml-auto text-[9px] text-[#9aa5b3]">
                  7 stations · 6 sections monitored
                </span>

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            LOWER CONTENT
        ====================================================== */}

        <div className="mt-5 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">

          {/* CURRENT TRAINS */}
          <section className="rounded-[15px] border border-[#dfe5eb] bg-white">

            <div className="flex items-center justify-between border-b border-[#edf0f3] px-5 py-4">

              <div>
                <h2 className="text-[14px] font-bold text-[#26364d]">
                  Currently running
                </h2>

                <p className="mt-1 text-[10px] text-[#8995a5]">
                  Trains currently operating on selected route
                </p>
              </div>

              <button
                type="button"
                onClick={() => router.push("/admin/trains")}
                className="flex items-center gap-1 text-[9px] font-bold text-[#4e8bb1] hover:text-[#264673]"
              >
                View all
                <ChevronRight size={13} />
              </button>

            </div>


            {/* Train rows */}
            <div>

              {trains.map((train) => (
                <button
                  type="button"
                  key={train.number}
                  onClick={() => openTrain(train.number)}
                  className="group flex w-full cursor-pointer items-center gap-3 border-b border-[#f0f2f5] px-5 py-4 text-left last:border-0 hover:bg-[#fafbfd] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#4e8bb1]"
                >

                  {/* Train icon */}
                  <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[9px] bg-[#ecf1f9]">
                    <TrainFront
                      size={17}
                      className="text-[#264673]"
                    />
                  </div>


                  {/* Train information */}
                  <div className="min-w-0 flex-1">

                    <div className="flex items-center gap-2">

                      <p className="text-[11px] font-bold text-[#26364d]">
                        {train.number}
                      </p>

                      <span className="truncate text-[9px] text-[#8995a5]">
                        {train.name}
                      </span>

                    </div>

                    <div className="mt-1 flex items-center gap-1">

                      <MapPin
                        size={11}
                        className="text-[#9aa5b3]"
                      />

                      <span className="text-[9px] text-[#8995a5]">
                        {train.location}
                      </span>

                    </div>

                  </div>


                  {/* Delay */}
                  <div className="hidden text-right sm:block">

                    <p className="text-[10px] font-bold text-[#52647b]">
                      {train.delay}
                    </p>

                    <p
                      className={`mt-1 text-[8px] font-semibold ${
                        train.color === "green"
                          ? "text-[#4a9e2e]"
                          : train.color === "yellow"
                          ? "text-[#b28700]"
                          : "text-[#e88a22]"
                      }`}
                    >
                      {train.status}
                    </p>

                  </div>


                  {/* Arrow */}
                  <ChevronRight
                    size={15}
                    className="text-[#b3bcc7] transition group-hover:translate-x-1 group-hover:text-[#52647b]"
                  />

                </button>
              ))}

            </div>

          </section>


          {/* ACTIVE ALERTS */}
          <section className="rounded-[15px] border border-[#dfe5eb] bg-white">

            <div className="flex items-center justify-between border-b border-[#edf0f3] px-5 py-4">

              <div>
                <h2 className="text-[14px] font-bold text-[#26364d]">
                  Active alerts
                </h2>

                <p className="mt-1 text-[10px] text-[#8995a5]">
                  Events requiring attention
                </p>
              </div>

              <div className="flex h-[23px] min-w-[23px] items-center justify-center rounded-full bg-[#fce8ea] px-2 text-[9px] font-bold text-[#b61624]">
                3
              </div>

            </div>


            <div>

              {alerts.map((alert, index) => (
                <AlertRow
                  key={index}
                  alert={alert}
                />
              ))}

            </div>

          </section>

        </div>


        {/* =====================================================
            DELAY OVERVIEW
        ====================================================== */}

        <section className="mt-5 rounded-[15px] border border-[#dfe5eb] bg-white">

          <div className="border-b border-[#edf0f3] px-5 py-4">

            <h2 className="text-[14px] font-bold text-[#26364d]">
              Delay overview
            </h2>

            <p className="mt-1 text-[10px] text-[#8995a5]">
              Current delay distribution by operational cause
            </p>

          </div>


          <div className="grid gap-4 px-5 py-5 md:grid-cols-5">

            {delayReasons.map((reason) => (
              <DelayReason
                key={reason.name}
                reason={reason}
              />
            ))}

          </div>

        </section>


        {/* Footer */}
        <div className="flex items-center justify-between py-5">

          <p className="text-[9px] text-[#a2abb6]">
            RailTrack Operations System
          </p>

          <p className="text-[9px] text-[#a2abb6]">
            Data refreshed just now
          </p>

        </div>

      </div>

    </main>
  );
}


/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  label,
  value,
  description,
  icon: Icon,
  highlight = false,
  critical = false,
}) {
  return (
    <div className="rounded-[13px] border border-[#dfe5eb] bg-white p-4">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[#8995a5]">
            {label}
          </p>

          <p
            className={`mt-2 text-[27px] font-bold leading-none ${
              critical
                ? "text-[#b61624]"
                : highlight
                ? "text-[#e88a22]"
                : "text-[#264673]"
            }`}
          >
            {value}
          </p>

        </div>

        <div
          className={`flex h-[32px] w-[32px] items-center justify-center rounded-[9px] ${
            critical
              ? "bg-[#fce8ea]"
              : highlight
              ? "bg-[#fff5e8]"
              : "bg-[#ecf1f9]"
          }`}
        >

          <Icon
            size={16}
            className={
              critical
                ? "text-[#b61624]"
                : highlight
                ? "text-[#e88a22]"
                : "text-[#264673]"
            }
          />

        </div>

      </div>

      <p className="mt-2 text-[9px] text-[#9aa5b3]">
        {description}
      </p>

    </div>
  );
}


/* =========================================================
   ROUTE STATION
========================================================= */

function RouteStation({ name, status }) {
  const statusClasses = {
    normal: "bg-[#5cc639] ring-[#dff2d8]",
    busy: "bg-[#e3b522] ring-[#faf0c8]",
    critical: "bg-[#e31c2d] ring-[#f8d7da]",
    risk: "bg-[#e88a22] ring-[#fce8d2]",
  };

  return (
    <div className="relative z-10 flex w-[100px] flex-col items-center">

      <div
        className={`flex h-[28px] w-[28px] items-center justify-center rounded-full ring-[5px] ${statusClasses[status]}`}
      >
        <span className="h-[7px] w-[7px] rounded-full bg-white" />
      </div>

      <p className="mt-3 whitespace-nowrap text-[9px] font-bold text-[#52647b]">
        {name}
      </p>

    </div>
  );
}


/* =========================================================
   TRAIN MARKER
========================================================= */

function TrainMarker({
  number,
  delay,
  delayed = false,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Open train ${number}`}
      className="flex cursor-pointer items-center gap-2 rounded-[8px] text-left transition hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-[#4e8bb1]"
    >

      <div
        className={`flex h-[29px] w-[29px] items-center justify-center rounded-full border-2 border-white shadow-md ${
          delayed
            ? "bg-[#e88a22]"
            : "bg-[#264673]"
        }`}
      >
        <TrainFront
          size={14}
          className="text-white"
        />
      </div>

      <div className="rounded-[7px] border border-[#e5e9ee] bg-white px-2 py-1 shadow-sm">

        <p className="text-[8px] font-bold text-[#26364d]">
          {number}
        </p>

        <p
          className={`text-[7px] font-semibold ${
            delayed
              ? "text-[#e88a22]"
              : "text-[#5a728b]"
          }`}
        >
          {delay}
        </p>

      </div>

    </button>
  );
}


/* =========================================================
   LEGEND
========================================================= */

function Legend({ color, text }) {
  return (
    <div className="flex items-center gap-1.5">

      <span
        className={`h-[7px] w-[7px] rounded-full ${color}`}
      />

      <span className="text-[9px] text-[#8995a5]">
        {text}
      </span>

    </div>
  );
}


/* =========================================================
   ALERT ROW
========================================================= */

function AlertRow({ alert }) {
  const styles = {
    critical: {
      bg: "bg-[#fce8ea]",
      icon: "text-[#b61624]",
      dot: "bg-[#e31c2d]",
    },

    warning: {
      bg: "bg-[#fff5e8]",
      icon: "text-[#c57a13]",
      dot: "bg-[#e88a22]",
    },

    info: {
      bg: "bg-[#edf3f7]",
      icon: "text-[#3e6f8e]",
      dot: "bg-[#4e8bb1]",
    },
  };

  const style = styles[alert.type];

  return (
    <div className="flex gap-3 border-b border-[#f0f2f5] px-5 py-4 last:border-0">

      <div
        className={`mt-[1px] flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[8px] ${style.bg}`}
      >
        <AlertTriangle
          size={14}
          className={style.icon}
        />
      </div>

      <div className="min-w-0 flex-1">

        <div className="flex items-center gap-2">

          <span
            className={`h-[6px] w-[6px] rounded-full ${style.dot}`}
          />

          <p className="text-[10px] font-bold text-[#26364d]">
            {alert.train}
          </p>

        </div>

        <p className="mt-1 text-[10px] font-semibold text-[#52647b]">
          {alert.title}
        </p>

        <p className="mt-[2px] text-[9px] text-[#9aa5b3]">
          {alert.detail}
        </p>

      </div>

      <ChevronRight
        size={14}
        className="mt-2 text-[#b3bcc7]"
      />

    </div>
  );
}


/* =========================================================
   DELAY REASON
========================================================= */

function DelayReason({ reason }) {
  const Icon = reason.icon;

  const max = 10;
  const width = `${Math.min((reason.count / max) * 100, 100)}%`;

  return (
    <div className="rounded-[10px] border border-[#edf0f3] p-3">

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-2">

          <div className="flex h-[27px] w-[27px] items-center justify-center rounded-[7px] bg-[#f4f7fa]">

            <Icon
              size={14}
              className="text-[#52647b]"
            />

          </div>

          <p className="text-[9px] font-semibold text-[#52647b]">
            {reason.name}
          </p>

        </div>

        <p className="text-[13px] font-bold text-[#264673]">
          {reason.count}
        </p>

      </div>

      <div className="mt-3 h-[4px] overflow-hidden rounded-full bg-[#edf0f3]">

        <div
          className="h-full rounded-full bg-[#4e8bb1]"
          style={{ width }}
        />

      </div>

    </div>
  );
}