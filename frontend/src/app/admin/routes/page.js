"use client";



import { useState } from "react";
import {
  TrainFront,
  ArrowLeft,
  RefreshCw,
  ChevronDown,
  MapPin,
  Clock3,
  Gauge,
  AlertTriangle,
  Users,
  Route as RouteIcon,
  CircleCheck,
  CircleAlert,
  CircleDot,
  ChevronRight
} from "lucide-react";
import { useRouter } from "next/navigation";

const routeOptions = [
  "Mangaluru → Bengaluru",
  "Bengaluru → Mysuru",
  "Mangaluru → Hassan",
  "Udupi → Bengaluru",
];

const stations = [
  {
    name: "Mangaluru",
    code: "MAQ",
    status: "normal",
  },
  {
    name: "Udupi",
    code: "UD",
    status: "normal",
  },
  {
    name: "Kundapura",
    code: "KU",
    status: "busy",
  },
  {
    name: "Shivamogga",
    code: "SME",
    status: "normal",
  },
  {
    name: "Hassan",
    code: "HAS",
    status: "critical",
  },
  {
    name: "Yeshwanthpur",
    code: "YPR",
    status: "risk",
  },
  {
    name: "Bengaluru",
    code: "SBC",
    status: "normal",
  },
];

const currentTrains = [
  {
    number: "12685",
    name: "Mangaluru Express",
    location: "Hassan",
    section: "Shivamogga → Hassan",
    delay: "+12 min",
    status: "Delayed",
    statusType: "delayed",
  },
  {
    number: "16526",
    name: "Karnataka Express",
    location: "Udupi",
    section: "Mangaluru → Udupi",
    delay: "+04 min",
    status: "Minor delay",
    statusType: "minor",
  },
  {
    number: "16575",
    name: "Gomateshwara Express",
    location: "Kundapura",
    section: "Udupi → Kundapura",
    delay: "On time",
    status: "On time",
    statusType: "normal",
  },
];

const upcomingTrains = [
  {
    time: "06:15",
    number: "12685",
    name: "Mangaluru Express",
    status: "Running",
  },
  {
    time: "07:00",
    number: "16526",
    name: "Karnataka Express",
    status: "Running",
  },
  {
    time: "09:30",
    number: "16575",
    name: "Gomateshwara Express",
    status: "Upcoming",
  },
  {
    time: "11:15",
    number: "12789",
    name: "Coastal Express",
    status: "Upcoming",
  },
  {
    time: "14:20",
    number: "12845",
    name: "Intercity Express",
    status: "Upcoming",
  },
];

const sections = [
  {
    name: "Mangaluru → Udupi",
    running: "58 min",
    average: "56 min",
    delay: "+2 min",
    trains: 1,
    congestion: "Low",
    impact: "Minimal",
    status: "normal",
  },
  {
    name: "Udupi → Kundapura",
    running: "43 min",
    average: "38 min",
    delay: "+5 min",
    trains: 1,
    congestion: "Moderate",
    impact: "+3–5 min",
    status: "busy",
  },
  {
    name: "Kundapura → Shivamogga",
    running: "91 min",
    average: "89 min",
    delay: "+2 min",
    trains: 0,
    congestion: "Low",
    impact: "Minimal",
    status: "normal",
  },
  {
    name: "Shivamogga → Hassan",
    running: "78 min",
    average: "69 min",
    delay: "+9 min",
    trains: 1,
    congestion: "High",
    impact: "+7–10 min",
    status: "critical",
  },
  {
    name: "Hassan → Yeshwanthpur",
    running: "146 min",
    average: "137 min",
    delay: "+9 min",
    trains: 0,
    congestion: "Moderate",
    impact: "+3–6 min",
    status: "risk",
  },
];

export default function RouteIntelligencePage() {
  const router = useRouter();

  const [selectedRoute, setSelectedRoute] = useState(
    "Mangaluru → Bengaluru"
  );

  const [showRoutes, setShowRoutes] = useState(false);

  const [selectedSection, setSelectedSection] = useState(
    sections[3]
  );

  const handleTrainClick = (trainNumber) => {
    router.push(`/admin/train/${trainNumber}`);
  };

  return (
    <main className="min-h-screen bg-[#f5f7fa] text-[#192f4d]">

      {/* =====================================================
          TOP NAVBAR
      ====================================================== */}
      <header className="sticky top-0 z-40 h-[68px] border-b border-[#e1e6ec] bg-white">

        <div className="flex h-full items-center justify-between px-5 lg:px-8">

          <div className="flex items-center gap-3">

            <button
              onClick={() => router.push("/admin")}
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
              <p className="text-[15px] font-bold leading-none text-[#192f4d]">
                RailTrack
              </p>

              <p className="mt-[4px] text-[8px] font-semibold uppercase tracking-[0.15em] text-[#8995a5]">
                Route Intelligence
              </p>
            </div>

          </div>

          <div className="flex items-center gap-3">

            <div className="hidden items-center gap-2 rounded-full bg-[#f3f7f5] px-3 py-[7px] sm:flex">
              <span className="h-[7px] w-[7px] rounded-full bg-[#5cc639]" />

              <span className="text-[10px] font-semibold text-[#587267]">
                Live monitoring
              </span>
            </div>

            <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#264673] text-[10px] font-bold text-white">
              AD
            </div>

          </div>

        </div>
      </header>


      {/* =====================================================
          CONTENT
      ====================================================== */}
      <div className="mx-auto max-w-[1450px] px-5 py-6 lg:px-8">

        {/* HEADER */}
        <div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">

          <div>

            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#4e8bb1]">
              Network monitoring
            </p>

            <h1 className="mt-1 text-[25px] font-bold tracking-[-0.02em] text-[#192f4d]">
              Route Intelligence
            </h1>

            <p className="mt-1 text-[11px] text-[#8995a5]">
              Monitor train movement, section conditions and predicted
              delay impact.
            </p>

          </div>


          {/* ROUTE SELECTOR */}
          <div className="relative">

            <button
              onClick={() => setShowRoutes(!showRoutes)}
              className="flex h-[42px] min-w-[250px] items-center justify-between gap-4 rounded-[9px] border border-[#dce3ea] bg-white px-3 shadow-sm"
            >

              <div className="text-left">

                <p className="text-[8px] uppercase tracking-[0.1em] text-[#9aa5b3]">
                  Monitoring route
                </p>

                <p className="mt-[2px] text-[11px] font-bold text-[#264673]">
                  {selectedRoute}
                </p>

              </div>

              <ChevronDown
                size={15}
                className="text-[#718096]"
              />

            </button>


            {showRoutes && (
              <div className="absolute right-0 top-[47px] z-50 w-[250px] overflow-hidden rounded-[9px] border border-[#dce3ea] bg-white shadow-xl">

                {routeOptions.map((route) => (
                  <button
                    key={route}
                    onClick={() => {
                      setSelectedRoute(route);
                      setShowRoutes(false);
                    }}
                    className="w-full px-4 py-3 text-left text-[10px] font-semibold text-[#52647b] hover:bg-[#f4f7fb]"
                  >
                    {route}
                  </button>
                ))}

              </div>
            )}

          </div>

        </div>


        {/* =====================================================
            ROUTE MAP
        ====================================================== */}
        <section className="overflow-hidden rounded-[15px] border border-[#dfe5eb] bg-white">

          <div className="flex items-center justify-between border-b border-[#edf0f3] px-5 py-4">

            <div className="flex items-center gap-2">

              <div className="flex h-[30px] w-[30px] items-center justify-center rounded-[8px] bg-[#ecf1f9]">
                <RouteIcon
                  size={16}
                  className="text-[#264673]"
                />
              </div>

              <div>

                <h2 className="text-[14px] font-bold text-[#26364d]">
                  Live Route
                </h2>

                <p className="text-[9px] text-[#8995a5]">
                  7 stations · 6 monitored sections
                </p>

              </div>

            </div>


            <button className="flex h-[34px] items-center gap-2 rounded-[8px] border border-[#dce3ea] px-3 text-[9px] font-semibold text-[#52647b] hover:bg-[#f8fafc]">
              <RefreshCw size={13} />
              Refresh
            </button>

          </div>


          {/* VISUAL ROUTE */}
          <div className="overflow-x-auto px-6 py-9">

            <div className="min-w-[850px]">

              <div className="relative">

                {/* LINE */}
                <div className="absolute left-[5%] right-[5%] top-[17px] h-[4px] rounded-full bg-[#dce3ea]" />

                {/* STATIONS */}
                <div className="relative flex justify-between">

                  {stations.map((station) => (
                    <Station
                      key={station.code}
                      station={station}
                    />
                  ))}

                </div>

              </div>


              {/* TRAIN POSITIONS */}
              <div className="relative mt-8 h-[82px]">

                <div className="absolute left-[14%] top-[10px]">
                  <TrainMarker
                    number="16526"
                    delay="+4 min"
                  />
                </div>

                <div className="absolute left-[38%] top-[43px]">
                  <TrainMarker
                    number="16575"
                    delay="ON TIME"
                  />
                </div>

                <div className="absolute left-[67%] top-[10px]">
                  <TrainMarker
                    number="12685"
                    delay="+12 min"
                    delayed
                  />
                </div>

              </div>


              {/* LEGEND */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[#edf0f3] pt-4">

                <Legend
                  color="bg-[#5cc639]"
                  text="Normal"
                />

                <Legend
                  color="bg-[#e3b522]"
                  text="Busy"
                />

                <Legend
                  color="bg-[#e88a22]"
                  text="Delay risk"
                />

                <Legend
                  color="bg-[#e31c2d]"
                  text="Critical"
                />

                <span className="ml-auto text-[9px] text-[#9aa5b3]">
                  3 trains currently on route
                </span>

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            SECTION PERFORMANCE
        ====================================================== */}
        <section className="mt-5 rounded-[15px] border border-[#dfe5eb] bg-white">

          <div className="border-b border-[#edf0f3] px-5 py-4">

            <div className="flex items-center gap-2">

              <Gauge
                size={17}
                className="text-[#264673]"
              />

              <div>

                <h2 className="text-[14px] font-bold text-[#26364d]">
                  Section Performance
                </h2>

                <p className="mt-1 text-[10px] text-[#8995a5]">
                  Current conditions compared with historical running times
                </p>

              </div>

            </div>

          </div>


          <div className="overflow-x-auto">

            <table className="w-full min-w-[850px]">

              <thead>

                <tr className="border-b border-[#edf0f3] bg-[#fafbfd]">

                  <TableHead>
                    Section
                  </TableHead>

                  <TableHead>
                    Current
                  </TableHead>

                  <TableHead>
                    Historical
                  </TableHead>

                  <TableHead>
                    Delay
                  </TableHead>

                  <TableHead>
                    Trains
                  </TableHead>

                  <TableHead>
                    Congestion
                  </TableHead>

                  <TableHead>
                    Predicted impact
                  </TableHead>

                </tr>

              </thead>

              <tbody>

                {sections.map((section) => (

                  <tr
                    key={section.name}
                    onClick={() =>
                      setSelectedSection(section)
                    }
                    className={`cursor-pointer border-b border-[#f0f2f5] last:border-0 ${
                      selectedSection.name === section.name
                        ? "bg-[#f7faff]"
                        : "hover:bg-[#fafbfd]"
                    }`}
                  >

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-2">

                        <SectionDot
                          status={section.status}
                        />

                        <span className="text-[10px] font-bold text-[#52647b]">
                          {section.name}
                        </span>

                      </div>

                    </td>

                    <td className="px-5 py-4 text-[10px] font-semibold text-[#52647b]">
                      {section.running}
                    </td>

                    <td className="px-5 py-4 text-[10px] text-[#8995a5]">
                      {section.average}
                    </td>

                    <td className="px-5 py-4">

                      <span
                        className={`text-[10px] font-bold ${
                          section.delay === "+9 min"
                            ? "text-[#e31c2d]"
                            : section.delay === "+5 min"
                            ? "text-[#e88a22]"
                            : "text-[#5a728b]"
                        }`}
                      >
                        {section.delay}
                      </span>

                    </td>

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-1 text-[10px] text-[#52647b]">
                        <TrainFront size={12} />
                        {section.trains}
                      </div>

                    </td>

                    <td className="px-5 py-4 text-[10px] font-semibold text-[#52647b]">
                      {section.congestion}
                    </td>

                    <td className="px-5 py-4">

                      <span
                        className={`text-[10px] font-bold ${
                          section.impact === "Minimal"
                            ? "text-[#4a9e2e]"
                            : section.impact.includes("7")
                            ? "text-[#e31c2d]"
                            : "text-[#e88a22]"
                        }`}
                      >
                        {section.impact}
                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </section>


        {/* =====================================================
            SELECTED SECTION DETAIL
        ====================================================== */}
        <section className="mt-5 rounded-[15px] border border-[#dfe5eb] bg-white">

          <div className="border-b border-[#edf0f3] px-5 py-4">

            <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#4e8bb1]">
              Selected section
            </p>

            <h2 className="mt-1 text-[15px] font-bold text-[#26364d]">
              {selectedSection.name}
            </h2>

          </div>


          <div className="grid grid-cols-2 gap-3 p-5 md:grid-cols-5">

            <DetailCard
              label="Current running"
              value={selectedSection.running}
              icon={Clock3}
            />

            <DetailCard
              label="Historical average"
              value={selectedSection.average}
              icon={Clock3}
            />

            <DetailCard
              label="Delay accumulation"
              value={selectedSection.delay}
              icon={ActivityIcon}
              warning
            />

            <DetailCard
              label="Trains in section"
              value={selectedSection.trains}
              icon={Users}
            />

            <DetailCard
              label="Predicted impact"
              value={selectedSection.impact}
              icon={AlertTriangle}
              warning
            />

          </div>

        </section>


        {/* =====================================================
            TRAINS
        ====================================================== */}
        <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_1fr]">


          {/* CURRENT TRAINS */}
          <section className="rounded-[15px] border border-[#dfe5eb] bg-white">

            <div className="flex items-center justify-between border-b border-[#edf0f3] px-5 py-4">

              <div>

                <h2 className="text-[14px] font-bold text-[#26364d]">
                  Currently on route
                </h2>

                <p className="mt-1 text-[10px] text-[#8995a5]">
                  Trains currently occupying this route
                </p>

              </div>

              <div className="rounded-full bg-[#ecf1f9] px-2 py-1 text-[8px] font-bold text-[#264673]">
                3 ACTIVE
              </div>

            </div>


            <div>

              {currentTrains.map((train) => (

                <button
                  key={train.number}
                  onClick={() =>
                    handleTrainClick(train.number)
                  }
                  className="group flex w-full items-center gap-3 border-b border-[#f0f2f5] px-5 py-4 text-left last:border-0 hover:bg-[#fafbfd]"
                >

                  <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[9px] bg-[#ecf1f9]">
                    <TrainFront
                      size={17}
                      className="text-[#264673]"
                    />
                  </div>


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

                      <span className="mx-1 text-[#d0d5dc]">
                        •
                      </span>

                      <span className="text-[9px] text-[#9aa5b3]">
                        {train.section}
                      </span>

                    </div>

                  </div>


                  <div className="hidden text-right sm:block">

                    <p
                      className={`text-[10px] font-bold ${
                        train.statusType === "delayed"
                          ? "text-[#e31c2d]"
                          : train.statusType === "minor"
                          ? "text-[#e88a22]"
                          : "text-[#4a9e2e]"
                      }`}
                    >
                      {train.delay}
                    </p>

                    <p className="mt-1 text-[8px] text-[#8995a5]">
                      {train.status}
                    </p>

                  </div>


                  <ChevronRightIcon />

                </button>

              ))}

            </div>

          </section>


          {/* TODAY'S TRAINS */}
          <section className="rounded-[15px] border border-[#dfe5eb] bg-white">

            <div className="flex items-center justify-between border-b border-[#edf0f3] px-5 py-4">

              <div>

                <h2 className="text-[14px] font-bold text-[#26364d]">
                  Today's trains
                </h2>

                <p className="mt-1 text-[10px] text-[#8995a5]">
                  Trains scheduled to cross this route today
                </p>

              </div>

              <div className="flex items-center gap-1 text-[9px] text-[#8995a5]">
                <Clock3 size={12} />
                Today
              </div>

            </div>


            <div>

              {upcomingTrains.map((train) => (

                <button
                  key={`${train.time}-${train.number}`}
                  onClick={() =>
                    handleTrainClick(train.number)
                  }
                  className="flex w-full items-center gap-4 border-b border-[#f0f2f5] px-5 py-3.5 text-left last:border-0 hover:bg-[#fafbfd]"
                >

                  <div className="w-[42px]">

                    <p className="text-[10px] font-bold text-[#52647b]">
                      {train.time}
                    </p>

                  </div>


                  <div className="flex h-[31px] w-[31px] items-center justify-center rounded-[8px] bg-[#f3f6f9]">

                    <TrainFront
                      size={15}
                      className="text-[#52647b]"
                    />

                  </div>


                  <div className="min-w-0 flex-1">

                    <div className="flex items-center gap-2">

                      <p className="text-[10px] font-bold text-[#26364d]">
                        {train.number}
                      </p>

                      <span className="truncate text-[9px] text-[#8995a5]">
                        {train.name}
                      </span>

                    </div>

                  </div>


                  <span
                    className={`rounded-full px-2 py-1 text-[8px] font-bold ${
                      train.status === "Running"
                        ? "bg-[#eff9eb] text-[#4a9e2e]"
                        : "bg-[#edf3f7] text-[#3e6f8e]"
                    }`}
                  >
                    {train.status}
                  </span>


                  <ChevronRightIcon />

                </button>

              ))}

            </div>

          </section>

        </div>


        {/* FOOTER */}
        <div className="flex items-center justify-between py-5">

          <p className="text-[9px] text-[#a2abb6]">
            RailTrack Operations System
          </p>

          <p className="text-[9px] text-[#a2abb6]">
            Route data · Static demo
          </p>

        </div>

      </div>

    </main>
  );
}


/* =========================================================
   STATION
========================================================= */

function Station({ station }) {
  const styles = {
    normal: {
      dot: "bg-[#5cc639]",
      ring: "ring-[#dff2d8]",
    },
    busy: {
      dot: "bg-[#e3b522]",
      ring: "ring-[#faf0c8]",
    },
    risk: {
      dot: "bg-[#e88a22]",
      ring: "ring-[#fce8d2]",
    },
    critical: {
      dot: "bg-[#e31c2d]",
      ring: "ring-[#f8d7da]",
    },
  };

  const style = styles[station.status];

  return (
    <div className="relative z-10 flex w-[105px] flex-col items-center">

      <div
        className={`flex h-[34px] w-[34px] items-center justify-center rounded-full ring-[5px] ${style.ring} ${style.dot}`}
      >
        <span className="h-[9px] w-[9px] rounded-full bg-white" />
      </div>

      <p className="mt-3 whitespace-nowrap text-[10px] font-bold text-[#52647b]">
        {station.name}
      </p>

      <p className="mt-[2px] text-[8px] font-medium text-[#a0a9b4]">
        {station.code}
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
}) {
  return (
    <div className="flex items-center gap-2">

      <div
        className={`flex h-[31px] w-[31px] items-center justify-center rounded-full border-2 border-white shadow-md ${
          delayed
            ? "bg-[#e88a22]"
            : "bg-[#264673]"
        }`}
      >
        <TrainFront
          size={15}
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

    </div>
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
   SECTION DOT
========================================================= */

function SectionDot({ status }) {
  const colors = {
    normal: "bg-[#5cc639]",
    busy: "bg-[#e3b522]",
    risk: "bg-[#e88a22]",
    critical: "bg-[#e31c2d]",
  };

  return (
    <span
      className={`h-[7px] w-[7px] rounded-full ${colors[status]}`}
    />
  );
}


/* =========================================================
   DETAIL CARD
========================================================= */

function DetailCard({
  label,
  value,
  icon: Icon,
  warning,
}) {
  return (
    <div className="rounded-[10px] border border-[#edf0f3] p-3">

      <div className="flex items-center justify-between">

        <p className="text-[8px] uppercase tracking-[0.07em] text-[#9aa5b3]">
          {label}
        </p>

        <Icon
          size={13}
          className={
            warning
              ? "text-[#e88a22]"
              : "text-[#718096]"
          }
        />

      </div>

      <p
        className={`mt-2 text-[15px] font-bold ${
          warning
            ? "text-[#e88a22]"
            : "text-[#264673]"
        }`}
      >
        {value}
      </p>

    </div>
  );
}


/* =========================================================
   TABLE HEAD
========================================================= */

function TableHead({ children }) {
  return (
    <th className="px-5 py-3 text-left text-[8px] font-bold uppercase tracking-[0.08em] text-[#9aa5b3]">
      {children}
    </th>
  );
}


/* =========================================================
   CHEVRON
========================================================= */

function ChevronRightIcon() {
  return (
    <ChevronRight
      size={15}
      className="text-[#b5bec8]"
    />
  );
}


/* =========================================================
   ACTIVITY ICON
========================================================= */

function ActivityIcon() {
  return (
    <ActivityPlaceholder />
  );
}

function ActivityPlaceholder() {
  return (
    <Gauge size={13} />
  );
}