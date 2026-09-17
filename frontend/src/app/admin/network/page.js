"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  EdgeLabelRenderer,
  BaseEdge,
  getSmoothStepPath,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import {
  TrainFront,
  Route,
  Activity,
  Clock3,
  AlertTriangle,
  Gauge,
  Radio,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
  MapPin,
  RefreshCw,
  TrendingUp,
  CloudRain,
  Wrench,
  CircleStop,
  Zap,
  GitBranch
} from "lucide-react";
import { useRouter } from "next/navigation";
import { fetchApi } from "../../../services/api";

/* =========================================================================
   CUSTOM REACT FLOW STATION NODE COMPONENT
========================================================================= */
function StationNode({ data, selected }) {
  const isJunction = data.type === "junction";
  const isTerminal = data.type === "terminal";
  const isSiding = data.type === "siding";

  return (
    <div
      className={`min-w-[145px] rounded-xl border-2 bg-white p-2.5 shadow-sm transition-all duration-200 ${
        selected
          ? "border-[#0284c7] ring-4 ring-[#0284c7]/20 shadow-md"
          : "border-[#1e293b]/70 hover:border-[#1e293b] hover:shadow-xs"
      }`}
    >
      {/* Handles on 4 cardinal directions */}
      <Handle type="target" position={Position.Left} id="left-in" className="!opacity-0 !w-2 !h-2" />
      <Handle type="source" position={Position.Left} id="left-out" className="!opacity-0 !w-2 !h-2" />
      <Handle type="target" position={Position.Right} id="right-in" className="!opacity-0 !w-2 !h-2" />
      <Handle type="source" position={Position.Right} id="right-out" className="!opacity-0 !w-2 !h-2" />
      <Handle type="target" position={Position.Top} id="top-in" className="!opacity-0 !w-2 !h-2" />
      <Handle type="source" position={Position.Top} id="top-out" className="!opacity-0 !w-2 !h-2" />
      <Handle type="target" position={Position.Bottom} id="bottom-in" className="!opacity-0 !w-2 !h-2" />
      <Handle type="source" position={Position.Bottom} id="bottom-out" className="!opacity-0 !w-2 !h-2" />

      {/* Code Badge & Type Pill */}
      <div className="flex items-center justify-between gap-2 border-b-2 border-[#1e293b]/10 pb-1.5 mb-1.5">
        <span className="font-mono text-[11px] font-black text-[#0f172a] bg-[#fef9c3] px-1.5 py-0.5 rounded border border-[#1e293b]">
          {data.code}
        </span>
        <span
          className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-2xs ${
            isTerminal
              ? "bg-[#ff4d4d] text-white border border-[#b91c1c]"
              : isJunction
              ? "bg-[#0284c7] text-white border border-[#0369a1]"
              : isSiding
              ? "bg-[#ff8a00] text-white border border-[#c2410c]"
              : "bg-[#ede8da] text-[#1e293b] border border-[#1e293b]/30"
          }`}
        >
          {data.type}
        </span>
      </div>

      {/* Name and Capacity */}
      <div>
        <p className="text-[12px] font-black text-[#0f172a] truncate leading-tight">
          {data.name}
        </p>
        <p className="text-[9px] text-[#475569] mt-0.5 font-medium">
          {data.platforms} {data.platforms === 1 ? "Track" : "Platforms"} · Signal: <span className="text-[#00875a] font-black">AUTO</span>
        </p>
      </div>
    </div>
  );
}

/* =========================================================================
   CUSTOM REACT FLOW TRACK EDGE COMPONENT
========================================================================= */
function TrackEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 20,
  });

  const status = data?.status || "CLEAR";
  const train = data?.train;
  const isCaution = status === "CAUTION";
  const isOccupied = status.startsWith("OCCUPIED");
  const isSiding = data?.isSiding;

  let strokeColor = "#00875a"; // SCENARIO 1: Clear Network (Forest Green)
  let strokeWidth = 3.5;
  let strokeDasharray = undefined;

  if (isOccupied) {
    strokeColor = status === "OCCUPIED_FREIGHT" ? "#0284c7" : status === "OCCUPIED_COASTAL" ? "#ff8a00" : "#ff4d4d";
    strokeWidth = 4.5;
    strokeDasharray = "8,4";
  } else if (isCaution) {
    strokeColor = "#facc15"; // SCENARIO 2: Disruption / Caution (Sun Yellow)
    strokeWidth = 4;
    strokeDasharray = "6,4";
  } else if (isSiding) {
    strokeColor = "#94a3b8";
    strokeWidth = 2.5;
    strokeDasharray = "4,4";
  }

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: strokeColor,
          strokeWidth,
          strokeDasharray,
          transition: "stroke 0.4s ease, stroke-width 0.4s ease",
        }}
      />

      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
          }}
          className="nodrag nopan"
        >
          {train ? (
            <div
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-black text-white shadow-md border-2 border-[#1e293b] animate-pulse ${
                train.type === "freight"
                  ? "bg-[#0284c7]"
                  : train.type === "coastal"
                  ? "bg-[#ff8a00]"
                  : "bg-[#ff4d4d]"
              }`}
            >
              <TrainFront size={11} />
              <span className="font-mono">{train.number}</span>
              <span className="bg-black/35 px-1 py-0.2 rounded font-mono text-[8px]">
                {train.speed} km/h
              </span>
            </div>
          ) : isCaution ? (
            <div className="rounded-full bg-[#fef9c3] px-2 py-0.5 text-[8px] font-black text-[#854d0e] border-2 border-[#ca8a04] shadow-xs">
              ⚠️ 30 km/h TCO
            </div>
          ) : (
            <div className="rounded-md bg-white px-1.5 py-0.5 text-[8px] font-mono font-bold text-[#64748b] border border-[#1e293b]/20 opacity-0 hover:opacity-100 transition shadow-xs">
              {data?.label}
            </div>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

// Node and Edge registration
const nodeTypes = { station: StationNode };
const edgeTypes = { track: TrackEdge };

/* =========================================================================
   MAIN COMPONENT: AREWETHEREYET UNIFIED CONTROL CENTER
========================================================================= */
export default function NetworkCommandCenter() {
  const router = useRouter();

  // Selected Train Key for Driving Detail Widgets: 'express' | 'freight' | 'coastal'
  const [selectedTrainKey, setSelectedTrainKey] = useState("express");
  const [selectedDetails, setSelectedDetails] = useState(null);

  // MongoDB Summary & Delays
  const [summaryData, setSummaryData] = useState(null);

  // Automated Scenario State (20s cycle matching Slide 1 Scenarios)
  const [simStep, setSimStep] = useState(0);
  const [lastRefreshed, setLastRefreshed] = useState("");
  const [activeScenario, setActiveScenario] = useState({
    name: "SCENARIO 1: Normal Operation (Clear Network)",
    tag: "NORMAL_OPERATION",
    color: "#00875a",
    process: "Sensors ping -> Kafka streams -> ETA calculated via physics base -> UI updates",
    latency: "< 1 second",
    accuracy: "98+%",
    description: "Trains running normally with clear signals and no unexpected restrictions across Hassan & coastal lines."
  });

  const [activeCautionSection, setActiveCautionSection] = useState(null);
  const [sensorLogs, setSensorLogs] = useState([]);

  // Dynamic multi-train state across the network
  const [trainStates, setTrainStates] = useState({
    express: {
      key: "express",
      number: "16526",
      name: "Kanyakumari Exp",
      type: "Superfast Express",
      section_id: "SEC_MAJN_HAS",
      speed: 78.4,
      axlesPerSec: 4.24,
      delayMin: 0,
      status: "ON_TIME",
      etaDestination: "18:45 IST (KSR Bengaluru)",
      coaches: "24-coach LHB Rake (68 Axles)",
      precedence: "Primary Green Signal corridor granted",
      confidence: "98.6%"
    },
    freight: {
      key: "freight",
      number: "58210",
      name: "BCN Freight Rake",
      type: "Heavy Goods",
      section_id: "LOOP_HAS_SIDING",
      speed: 0.0,
      axlesPerSec: 0.0,
      delayMin: 14,
      status: "HELD_IN_SIDING",
      etaDestination: "22:15 IST (Mysuru Jn)",
      coaches: "58-wagon BCN Freight Rake (116 Axles)",
      precedence: "Looped in Hassan siding for Express 16526 clearance",
      confidence: "96.2%"
    },
    coastal: {
      key: "coastal",
      number: "12685",
      name: "Mangaluru-Goa Intercity",
      type: "Express",
      section_id: "SEC_MAJN_UD",
      speed: 84.1,
      axlesPerSec: 4.55,
      delayMin: 1,
      status: "ON_TIME",
      etaDestination: "11:20 IST (Kundapura)",
      coaches: "18-coach ICF Rake (72 Axles)",
      precedence: "Coastal single line token automatic block clear",
      confidence: "99.1%"
    }
  });

  // Average Network Velocity calculated across active trains
  const networkAverageSpeed = useMemo(() => {
    const list = Object.values(trainStates);
    const sum = list.reduce((acc, t) => acc + t.speed, 0);
    return +(sum / list.length).toFixed(1);
  }, [trainStates]);

  // Base Station Nodes Layout (Spacious, well-separated 2D coordinates)
  const initialNodes = useMemo(() => [
    { id: "MAJN", type: "station", position: { x: 40, y: 220 }, data: { code: "MAJN", name: "Mangaluru Jn", type: "junction", platforms: 5 } },
    { id: "UD", type: "station", position: { x: 280, y: 70 }, data: { code: "UD", name: "Udupi", type: "station", platforms: 3 } },
    { id: "KUDA", type: "station", position: { x: 540, y: 20 }, data: { code: "KUDA", name: "Kundapura", type: "terminal", platforms: 2 } },
    { id: "HAS", type: "station", position: { x: 440, y: 280 }, data: { code: "HAS", name: "Hassan Jn", type: "junction", platforms: 4 } },
    { id: "HAS_SIDING", type: "station", position: { x: 440, y: 440 }, data: { code: "SID_01", name: "Hassan Freight Loop", type: "siding", platforms: 1 } },
    { id: "SMET", type: "station", position: { x: 800, y: 30 }, data: { code: "SMET", name: "Shivamogga Town", type: "terminal", platforms: 3 } },
    { id: "ASK", type: "station", position: { x: 820, y: 220 }, data: { code: "ASK", name: "Arsikere Jn", type: "junction", platforms: 4 } },
    { id: "MYS", type: "station", position: { x: 740, y: 440 }, data: { code: "MYS", name: "Mysuru Jn", type: "junction", platforms: 6 } },
    { id: "YPR", type: "station", position: { x: 1140, y: 200 }, data: { code: "YPR", name: "Yeshwanthpur Jn", type: "junction", platforms: 6 } },
    { id: "SBC", type: "station", position: { x: 1400, y: 310 }, data: { code: "SBC", name: "KSR Bengaluru", type: "terminal", platforms: 10 } },
  ], []);

  // React Flow State Hooks
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Fetch MongoDB Dashboard Summary & Seed Telemetry
  const loadDashboardData = async () => {
    try {
      const summaryRes = await fetchApi("/dashboard/summary");
      if (summaryRes.success) {
        setSummaryData(summaryRes.data);
      }
    } catch (err) {
      console.error("Error loading dashboard summary:", err);
    }
    const t = new Date();
    setLastRefreshed(t.toLocaleTimeString());
    setSensorLogs([
      { id: 1, time: t.toLocaleTimeString(), sensor: "AC_IN_SEC_MAJN_HAS", event: "AXLE_PULSE_ENTRY", axles: 68, speed: "78.4 km/h", status: "OCCUPIED" },
      { id: 2, time: new Date(t.getTime() - 14000).toLocaleTimeString(), sensor: "AC_LOOP_HAS", event: "SIDING_OCCUPANCY", axles: 116, speed: "0.0 km/h", status: "HELD" },
      { id: 3, time: new Date(t.getTime() - 31000).toLocaleTimeString(), sensor: "AC_OUT_SEC_MAJN_UD", event: "SECTION_CLEARED", axles: 72, speed: "84.1 km/h", status: "CLEAR" }
    ]);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Generate Edges according to train positions and caution orders
  const buildEdges = useCallback((currentTrains, cautionSec) => {
    const rawEdges = [
      { id: "SEC_MAJN_UD", source: "MAJN", sourceHandle: "right-out", target: "UD", targetHandle: "left-in", label: "68 km · MPS 100", length: 68, mps: 100 },
      { id: "SEC_UD_KUDA", source: "UD", sourceHandle: "right-out", target: "KUDA", targetHandle: "left-in", label: "32 km · MPS 100", length: 32, mps: 100 },
      { id: "SEC_MAJN_HAS", source: "MAJN", sourceHandle: "right-out", target: "HAS", targetHandle: "left-in", label: "118 km · Ghat Main", length: 118, mps: 85 },
      { id: "SEC_HAS_ASK", source: "HAS", sourceHandle: "right-out", target: "ASK", targetHandle: "left-in", label: "47 km · Central Chord", length: 47, mps: 110 },
      { id: "SEC_ASK_SMET", source: "ASK", sourceHandle: "top-out", target: "SMET", targetHandle: "bottom-in", label: "66 km · Spur", length: 66, mps: 90 },
      { id: "SEC_HAS_MYS", source: "HAS", sourceHandle: "bottom-out", target: "MYS", targetHandle: "left-in", label: "120 km · South Line", length: 120, mps: 100 },
      { id: "SEC_MYS_SBC", source: "MYS", sourceHandle: "right-out", target: "SBC", targetHandle: "left-in", label: "139 km · Main South", length: 139, mps: 110 },
      { id: "SEC_ASK_YPR", source: "ASK", sourceHandle: "right-out", target: "YPR", targetHandle: "left-in", label: "166 km · High Speed", length: 166, mps: 120 },
      { id: "SEC_YPR_SBC", source: "YPR", sourceHandle: "right-out", target: "SBC", targetHandle: "top-in", label: "6 km · Terminal", length: 6, mps: 60 },
      { id: "LOOP_HAS_SIDING", source: "HAS", sourceHandle: "bottom-out", target: "HAS_SIDING", targetHandle: "top-in", label: "Freight Siding", isSiding: true, length: 1.2, mps: 30 }
    ];

    return rawEdges.map((e) => {
      let status = "CLEAR";
      let activeTrain = null;

      if (cautionSec === e.id) {
        status = "CAUTION";
      } else if (currentTrains.express.section_id === e.id) {
        status = "OCCUPIED_EXPRESS";
        activeTrain = currentTrains.express;
      } else if (currentTrains.freight.section_id === e.id) {
        status = "OCCUPIED_FREIGHT";
        activeTrain = currentTrains.freight;
      } else if (currentTrains.coastal.section_id === e.id) {
        status = "OCCUPIED_COASTAL";
        activeTrain = currentTrains.coastal;
      }

      return {
        ...e,
        type: "track",
        data: {
          ...e,
          status,
          train: activeTrain
        }
      };
    });
  }, []);

  // Update edges on change
  useEffect(() => {
    setEdges(buildEdges(trainStates, activeCautionSection));
  }, [trainStates, activeCautionSection, buildEdges, setEdges]);

  // =========================================================================
  // AUTOMATED REAL-TIME SCENARIO CYCLE (20 SECONDS REFRESH)
  // =========================================================================
  useEffect(() => {
    const scenarios = [
      {
        name: "SCENARIO 1: Normal Operation (Clear Network)",
        tag: "NORMAL_OPERATION",
        color: "#00875a",
        process: "Sensors ping -> Kafka streams -> ETA calculated via physics base -> UI updates",
        latency: "< 1 second",
        accuracy: "98+%",
        description: "Trains running normally with clear signals and no unexpected restrictions across Hassan & coastal lines."
      },
      {
        name: "SCENARIO 2: Dynamic Disruption (Congestion)",
        tag: "DYNAMIC_DISRUPTION",
        color: "#facc15",
        process: "Neo4j detects blockage -> XGBoost recalculates delay -> UI updates smoothly",
        latency: "2-5 seconds",
        accuracy: "90-95%",
        description: "Temporary Caution Order on SEC_HAS_ASK (30 km/h ceiling); Dynamic delay calculated and auto-propagated (+6m)."
      },
      {
        name: "SCENARIO 3: Hardware Failure (Missing Data)",
        tag: "HARDWARE_FAILURE",
        color: "#ff4d4d",
        process: "Pipeline detects missing ping -> Pandas imputes historical average -> ETA maintained",
        latency: "10-15 seconds",
        accuracy: "85-90%",
        description: "Axle counter ping dropped at SEC_ASK_YPR; Imputation engine active; Express 16526 tracked via run profile."
      }
    ];

    // Steady 20-second interval
    const interval = setInterval(() => {
      setSimStep((prev) => {
        const next = (prev + 1) % 3;
        setActiveScenario(scenarios[next]);
        const nowStr = new Date().toLocaleTimeString();
        setLastRefreshed(nowStr);

        if (next === 0) {
          setTrainStates({
            express: { key: "express", number: "16526", name: "Kanyakumari Exp", type: "Superfast Express", section_id: "SEC_MAJN_HAS", speed: 79.2, axlesPerSec: 4.28, delayMin: 0, status: "ON_TIME", etaDestination: "18:45 IST (KSR Bengaluru)", coaches: "24-coach LHB Rake (68 Axles)", precedence: "Primary Green Signal corridor granted", confidence: "98.6%" },
            freight: { key: "freight", number: "58210", name: "BCN Freight Rake", type: "Heavy Goods", section_id: "LOOP_HAS_SIDING", speed: 0.0, axlesPerSec: 0.0, delayMin: 14, status: "HELD_IN_SIDING", etaDestination: "22:15 IST (Mysuru Jn)", coaches: "58-wagon BCN Freight Rake (116 Axles)", precedence: "Looped in Hassan siding for Express 16526 clearance", confidence: "96.2%" },
            coastal: { key: "coastal", number: "12685", name: "Mangaluru-Goa Intercity", type: "Express", section_id: "SEC_MAJN_UD", speed: 82.5, axlesPerSec: 4.45, delayMin: 1, status: "ON_TIME", etaDestination: "11:20 IST (Kundapura)", coaches: "18-coach ICF Rake (72 Axles)", precedence: "Coastal single line token automatic block clear", confidence: "99.1%" }
          });
          setActiveCautionSection(null);
          setSensorLogs((p) => [{ id: `log-${Date.now()}-${(Math.random() * 1e6) | 0}`, time: nowStr, sensor: "AC_IN_SEC_MAJN_HAS", event: "AXLE_PULSE_ENTRY", axles: 68, speed: "79.2 km/h", status: "OCCUPIED" }, ...p.slice(0, 6)]);
        } else if (next === 1) {
          setTrainStates({
            express: { key: "express", number: "16526", name: "Kanyakumari Exp", type: "Superfast Express", section_id: "SEC_HAS_ASK", speed: 29.4, axlesPerSec: 1.59, delayMin: 6, status: "DELAYED", etaDestination: "18:51 IST (KSR Bengaluru)", coaches: "24-coach LHB Rake (68 Axles)", precedence: "Caution order speed ceiling (30 km/h enforced)", confidence: "97.4%" },
            freight: { key: "freight", number: "58210", name: "BCN Freight Rake", type: "Heavy Goods", section_id: "LOOP_HAS_SIDING", speed: 0.0, axlesPerSec: 0.0, delayMin: 18, status: "HELD_IN_SIDING", etaDestination: "22:25 IST (Mysuru Jn)", coaches: "58-wagon BCN Freight Rake (116 Axles)", precedence: "Looped in Hassan siding for Express 16526 clearance", confidence: "96.2%" },
            coastal: { key: "coastal", number: "12685", name: "Mangaluru-Goa Intercity", type: "Express", section_id: "SEC_UD_KUDA", speed: 85.0, axlesPerSec: 4.6, delayMin: 0, status: "ON_TIME", etaDestination: "11:21 IST (Kundapura)", coaches: "18-coach ICF Rake (72 Axles)", precedence: "Automatic block token clear", confidence: "99.1%" }
          });
          setActiveCautionSection("SEC_HAS_ASK");
          setSensorLogs((p) => [{ id: `log-${Date.now()}-${(Math.random() * 1e6) | 0}`, time: nowStr, sensor: "AC_IN_SEC_HAS_ASK", event: "TCO_RESTRICTION_TRIGGER", axles: 68, speed: "29.4 km/h (Capped)", status: "CAUTION" }, ...p.slice(0, 6)]);
        } else {
          setTrainStates({
            express: { key: "express", number: "16526", name: "Kanyakumari Exp", type: "Superfast Express", section_id: "SEC_ASK_YPR", speed: 94.8, axlesPerSec: 5.12, delayMin: 3, status: "ON_TIME", etaDestination: "18:48 IST (KSR Bengaluru)", coaches: "24-coach LHB Rake (68 Axles)", precedence: "Pandas missing ping imputation active", confidence: "88.5%" },
            freight: { key: "freight", number: "58210", name: "BCN Freight Rake", type: "Heavy Goods", section_id: "SEC_HAS_MYS", speed: 42.0, axlesPerSec: 2.27, delayMin: 22, status: "DELAYED", etaDestination: "22:30 IST (Mysuru Jn)", coaches: "58-wagon BCN Freight Rake (116 Axles)", precedence: "Departed siding towards Mysuru", confidence: "95.5%" },
            coastal: { key: "coastal", number: "12685", name: "Mangaluru-Goa Intercity", type: "Express", section_id: "SEC_UD_KUDA", speed: 76.2, axlesPerSec: 4.12, delayMin: 0, status: "ON_TIME", etaDestination: "11:22 IST (Kundapura)", coaches: "18-coach ICF Rake (72 Axles)", precedence: "Approaching Kundapura platform line", confidence: "99.1%" }
          });
          setActiveCautionSection(null);
          setSensorLogs((p) => [{ id: `log-${Date.now()}-${(Math.random() * 1e6) | 0}`, time: nowStr, sensor: "AC_SYS_FAIL_SEC_ASK_YPR", event: "IMPUTED_AVERAGE_PATCH", axles: 68, speed: "94.8 km/h (Imputed)", status: "OCCUPIED" }, ...p.slice(0, 6)]);
        }

        return next;
      });
    }, 20000); // 20-second cadence

    return () => clearInterval(interval);
  }, []);

  // Currently selected train object (for driving telemetry widgets)
  const currentSelectedTrain = trainStates[selectedTrainKey] || trainStates.express;

  // React Flow clicks
  const onNodeClick = useCallback((_, node) => {
    setSelectedDetails({ type: "station", ...node.data });
  }, []);

  const onEdgeClick = useCallback((_, edge) => {
    setSelectedDetails({ type: "section", ...edge.data });
  }, []);

  return (
    <main className="min-h-screen bg-[#FAF7EE] text-[#0F172A] pb-12">

      {/* =====================================================
          TOP NAVIGATION HEADER (SIH 2026 PRESENTATION IDENTITY)
      ====================================================== */}
      <header className="sticky top-0 z-40 border-b-2 border-[#1E293B]/15 bg-[#FAF7EE]/95 backdrop-blur-md">
        <div className="mx-auto flex h-[66px] max-w-[1600px] items-center justify-between px-5 lg:px-8">

          {/* Left: Brand "AreWeThereYet" */}
          <div className="flex items-center gap-3">
            <div className="flex h-[40px] w-[40px] items-center justify-center rounded-xl bg-[#FF8A00] text-white shadow-xs border-2 border-[#1E293B]">
              <TrainFront size={22} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[18px] font-black tracking-tight text-[#0F172A]">
                  AreWeThereYet
                </span>
                <span className="rounded-full bg-[#0284C7] px-2.5 py-0.5 text-[9px] font-black text-white border border-[#0369A1] shadow-2xs">
                  Smart India Hackathon 2026
                </span>
              </div>
              <p className="text-[10px] font-medium text-[#475569]">
                Real-Time Physical Sensing · Axle Counter Topology · Dynamic ETA System
              </p>
            </div>
          </div>

          {/* Right: GHAZAL Team Badge & Sync DB Button */}
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center rounded-full border-2 border-[#1E293B] bg-white px-4 py-1.5 text-xs font-black text-[#0F172A] shadow-2xs tracking-wider uppercase">
              GHAZAL
            </span>
            <button
              type="button"
              onClick={loadDashboardData}
              className="flex items-center gap-1.5 rounded-xl border-2 border-[#1E293B] bg-white px-3.5 py-1.5 text-[11px] font-black text-[#0F172A] shadow-xs transition hover:bg-[#FF8A00] hover:text-white"
            >
              <RefreshCw size={13} />
              Sync DB
            </button>
          </div>

        </div>
      </header>


      {/* =====================================================
          MAIN DASHBOARD BODY
      ====================================================== */}
      <div className="mx-auto max-w-[1600px] w-full px-5 py-6 lg:px-8 space-y-6">

        {/* =====================================================
            1. TOP METRIC CARDS (SIH HIGH-CONTRAST PALETTE)
        ====================================================== */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">

          <div className="rounded-2xl border-2 border-[#1E293B]/20 bg-white p-4 shadow-sm hover:border-[#1E293B] transition">
            <div className="flex items-center justify-between text-[#64748b]">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#475569]">Monitored Blocks</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0284C7] text-white border border-[#0369A1] shadow-2xs">
                <Layers size={14} />
              </div>
            </div>
            <div className="mt-2 text-2xl font-black text-[#0F172A]">
              10 <span className="text-xs font-semibold text-[#64748b]">Blocks</span>
            </div>
            <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-[#00875A]">
              <CheckCircle2 size={12} /> 100% Sensor Grid Active
            </div>
          </div>

          <div className="rounded-2xl border-2 border-[#1E293B]/20 bg-white p-4 shadow-sm hover:border-[#1E293B] transition">
            <div className="flex items-center justify-between text-[#64748b]">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#475569]">Active Trains</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FF8A00] text-white border border-[#EA580C] shadow-2xs">
                <TrainFront size={14} />
              </div>
            </div>
            <div className="mt-2 text-2xl font-black text-[#0F172A]">
              3 <span className="text-xs font-semibold text-[#64748b]">On Track</span>
            </div>
            <div className="mt-1 text-[10px] font-bold text-[#0284C7] truncate">
              Express · Freight · Intercity
            </div>
          </div>

          {/* STAT CARD: NETWORK FLOW VELOCITY */}
          <div className="rounded-2xl border-2 border-[#1E293B]/20 bg-white p-4 shadow-sm hover:border-[#1E293B] transition">
            <div className="flex items-center justify-between text-[#64748b]">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#475569]">Network Velocity</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FACC15] text-[#0F172A] border border-[#CA8A04] shadow-2xs">
                <Gauge size={14} />
              </div>
            </div>
            <div className="mt-2 text-2xl font-black text-[#0F172A]">
              {networkAverageSpeed} <span className="text-xs font-semibold text-[#64748b]">km/h</span>
            </div>
            <div className="mt-1 text-[10px] font-bold text-[#00875A]">
              Fleet: 42–95 km/h · 92% On-Time
            </div>
          </div>

          <div className="rounded-2xl border-2 border-[#1E293B]/20 bg-white p-4 shadow-sm hover:border-[#1E293B] transition">
            <div className="flex items-center justify-between text-[#64748b]">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#475569]">Caution Orders</span>
              <div className={`flex h-7 w-7 items-center justify-center rounded-lg border shadow-2xs ${activeCautionSection ? 'bg-[#FF4D4D] text-white border-[#DC2626]' : 'bg-[#00875A] text-white border-[#047857]'}`}>
                <AlertTriangle size={14} />
              </div>
            </div>
            <div className="mt-2 text-2xl font-black text-[#0F172A]">
              {activeCautionSection ? 1 : 0} <span className="text-xs font-semibold text-[#64748b]">Active TCO</span>
            </div>
            <div className={`mt-1 text-[10px] font-bold truncate ${activeCautionSection ? 'text-[#DC2626]' : 'text-[#00875A]'}`}>
              {activeCautionSection ? "30 km/h on Hassan-Arsikere" : "Nominal Speeds Permitted"}
            </div>
          </div>

          <div className="rounded-2xl border-2 border-[#1E293B]/20 bg-white p-4 shadow-sm hover:border-[#1E293B] transition">
            <div className="flex items-center justify-between text-[#64748b]">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#475569]">ETA Accuracy</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0F4C81] text-white border border-[#0A3358] shadow-2xs">
                <ShieldCheck size={14} />
              </div>
            </div>
            <div className="mt-2 text-2xl font-black text-[#0F172A]">
              98.4%
            </div>
            <div className="mt-1 text-[10px] font-bold text-[#00875A]">
              Ground-Truth Calibrated
            </div>
          </div>

        </div>


        {/* =====================================================
            2. 2D RAILWAY NETWORK CANVAS (20s REFRESH CADENCE)
        ====================================================== */}
        <section className="rounded-2xl border-2 border-[#1E293B]/20 bg-white p-6 shadow-sm space-y-4">
          
          {/* Header & Slide 1 Scenario Banner */}
          <div className="flex flex-col justify-between gap-4 border-b-2 border-[#1E293B]/10 pb-4 lg:flex-row lg:items-center">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0284C7] text-white border border-[#0369A1]">
                  <Route size={16} />
                </div>
                <h2 className="text-[16px] font-black text-[#0F172A]">
                  Block Section Network Topology & Sensor Grid
                </h2>
                <span className="rounded-full bg-[#00875A] border border-[#047857] px-2.5 py-0.5 text-[9px] font-black text-white shadow-2xs">
                  20s Cycle Active
                </span>
              </div>
              <p className="mt-0.5 text-[11px] font-medium text-[#475569]">
                Real-time block occupancy from track circuits & axle counters. Click any station or track section to inspect telemetry.
              </p>
            </div>

            {/* Current Scenario Card (Slide 1 "How we work?") */}
            <div className="flex items-center gap-3 rounded-xl bg-[#FFFBEB] border-2 border-[#1E293B]/20 px-3.5 py-2 shadow-2xs">
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white font-black shadow-2xs"
                style={{
                  backgroundColor:
                    activeScenario.tag === "NORMAL_OPERATION"
                      ? "#00875A"
                      : activeScenario.tag === "DYNAMIC_DISRUPTION"
                      ? "#FACC15"
                      : "#FF4D4D",
                  color: activeScenario.tag === "DYNAMIC_DISRUPTION" ? "#0F172A" : "#FFFFFF",
                }}
              >
                <Activity size={16} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black text-[#0F172A]">{activeScenario.name}</span>
                  <span
                    className="rounded px-2 py-0.5 text-[8px] font-mono font-black"
                    style={{
                      backgroundColor:
                        activeScenario.tag === "NORMAL_OPERATION"
                          ? "#00875A"
                          : activeScenario.tag === "DYNAMIC_DISRUPTION"
                          ? "#FACC15"
                          : "#FF4D4D",
                      color: activeScenario.tag === "DYNAMIC_DISRUPTION" ? "#0F172A" : "#FFFFFF",
                    }}
                  >
                    AUTO 20s
                  </span>
                </div>
                <p className="text-[9px] text-[#475569] font-medium truncate max-w-[360px]">
                  {activeScenario.description}
                </p>
              </div>
            </div>
          </div>

          {/* REACT FLOW CANVAS CONTAINER (SPACIOUS 560px HEIGHT) */}
          <div className="h-[560px] w-full rounded-xl border-2 border-[#1E293B]/20 bg-[#FDFBF7] relative overflow-hidden">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              onNodeClick={onNodeClick}
              onEdgeClick={onEdgeClick}
              fitView
              fitViewOptions={{ padding: 0.15 }}
              minZoom={0.35}
              maxZoom={1.5}
            >
              <Background variant="dots" gap={16} size={1} color="#cbd5e1" />
              <Controls className="bg-white border-2 border-[#1E293B]/30 shadow-xs rounded-xl" />
            </ReactFlow>
          </div>

          {/* Legend & Selected Details Readout */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t-2 border-[#1E293B]/10 pt-4">
            
            {/* Status Legend */}
            <div className="flex flex-wrap items-center gap-4 text-[10px]">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-[#00875A] border border-[#047857]" />
                <span className="font-bold text-[#475569]">Clear Block (Scenario 1)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-[#FF4D4D] border border-[#B91C1C]" />
                <span className="font-bold text-[#475569]">Occupied (Express 16526)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-[#0284C7] border border-[#0369A1]" />
                <span className="font-bold text-[#475569]">Freight Siding Loop (58210)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-[#FF8A00] border border-[#EA580C]" />
                <span className="font-bold text-[#475569]">Coastal Intercity (12685)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-[#FACC15] border border-[#CA8A04]" />
                <span className="font-bold text-[#475569]">Caution Order / TCO (Scenario 2)</span>
              </div>
            </div>

            {/* Selected Readout */}
            {selectedDetails && (
              <div className="flex items-center gap-3 text-[11px] font-bold text-[#0F172A] bg-[#FFFBEB] border-2 border-[#1E293B]/20 px-3.5 py-1.5 rounded-xl shadow-2xs">
                <Cpu size={14} className="text-[#0284C7]" />
                <span>
                  Selected {selectedDetails.type === "station" ? "Station" : "Section"}:{" "}
                  <strong className="font-mono text-[#0284C7]">
                    {selectedDetails.code || selectedDetails.id}
                  </strong>{" "}
                  ({selectedDetails.name || selectedDetails.label})
                </span>
                <span className="text-[10px] text-[#475569]">
                  {selectedDetails.platforms ? `· ${selectedDetails.platforms} Platforms` : `· MPS: ${selectedDetails.mps || 100} km/h`}
                </span>
              </div>
            )}

          </div>

        </section>


        {/* =====================================================
            3. CURRENTLY RUNNING TRAINS (INTERACTIVE SELECTION LIST)
               & DELAY ROOT CAUSES / ACTIVE ALERTS OVERVIEW
        ====================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Currently Running Trains (7 Columns) - Drives Telemetry Below */}
          <section className="lg:col-span-7 rounded-2xl border-2 border-[#1E293B]/20 bg-white p-5 shadow-sm space-y-4">
            
            <div className="flex items-center justify-between border-b-2 border-[#1E293B]/10 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0284C7] text-white">
                    <TrainFront size={16} />
                  </div>
                  <h3 className="text-[15px] font-black text-[#0F172A]">Currently Running Trains</h3>
                </div>
                <p className="text-[10px] font-medium text-[#475569] mt-0.5">
                  Click any train below to inspect its dedicated Speed Derivation & Circumstance Engine.
                </p>
              </div>
              <span className="text-[9px] font-black text-white bg-[#0284C7] border border-[#0369A1] px-2.5 py-0.5 rounded-full shadow-2xs">
                3 Active Trains
              </span>
            </div>

            {/* Train List Rows */}
            <div className="space-y-2.5">
              {Object.values(trainStates).map((train) => {
                const isSelected = selectedTrainKey === train.key;

                return (
                  <div
                    key={train.key}
                    onClick={() => setSelectedTrainKey(train.key)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border-2 transition cursor-pointer ${
                      isSelected
                        ? "border-[#0284C7] bg-[#E0F2FE]/50 ring-2 ring-[#0284C7]/20 shadow-2xs"
                        : "border-[#1E293B]/10 bg-[#FAF7EE] hover:bg-white hover:border-[#1E293B]/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-xl text-white font-bold shadow-xs border-2 border-[#1E293B] ${
                          train.key === "freight"
                            ? "bg-[#0284C7]"
                            : train.key === "coastal"
                            ? "bg-[#FF8A00]"
                            : "bg-[#FF4D4D]"
                        }`}
                      >
                        <TrainFront size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black text-[#0F172A]">
                            {train.number}
                          </span>
                          <span className="text-[11px] font-bold text-[#334155]">
                            {train.name}
                          </span>
                          <span className="text-[9px] font-semibold text-[#64748B]">({train.type})</span>
                        </div>
                        <p className="text-[10px] text-[#475569] font-medium flex items-center gap-1 mt-0.5">
                          <MapPin size={11} className="text-[#0284C7]" /> Block Section:{" "}
                          <strong className="font-mono text-[#0F172A]">{train.section_id}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center justify-end gap-1.5 font-mono text-xs font-black text-[#0F172A]">
                        <Gauge size={13} className="text-[#FF8A00]" />
                        {train.speed} km/h
                      </div>
                      <div className="mt-0.5">
                        <span
                          className={`text-[9px] font-black px-2 py-0.5 rounded-full shadow-2xs ${
                            train.status === "HELD_IN_SIDING"
                              ? "bg-[#0284C7] text-white border border-[#0369A1]"
                              : train.delayMin > 0
                              ? "bg-[#FACC15] text-[#0F172A] border-2 border-[#CA8A04]"
                              : "bg-[#00875A] text-white border border-[#047857]"
                          }`}
                        >
                          {train.status === "HELD_IN_SIDING"
                            ? "HELD IN SIDING (+14m)"
                            : train.delayMin > 0
                            ? `+${train.delayMin}m DELAY`
                            : "ON TIME"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </section>


          {/* Delay Root Causes & Active Alerts (5 Columns) */}
          <section className="lg:col-span-5 rounded-2xl border-2 border-[#1E293B]/20 bg-white p-5 shadow-sm space-y-4">
            
            <div className="flex items-center justify-between border-b-2 border-[#1E293B]/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FF4D4D] text-white">
                  <Activity size={16} />
                </div>
                <h3 className="text-[15px] font-black text-[#0F172A]">Network Delays & Alerts</h3>
              </div>
              <span className="text-[9px] font-mono font-bold text-[#475569] bg-[#FFFBEB] border border-[#1E293B]/20 px-2 py-0.5 rounded-md">
                Live DB Sync
              </span>
            </div>

            {/* Delay Cause Bars */}
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-[11px] font-bold text-[#0F172A] mb-1">
                  <span className="flex items-center gap-1.5"><Wrench size={13} className="text-[#FF8A00]" /> Maintenance Blocks (TCO)</span>
                  <span className="font-mono text-[10px] text-[#475569]">1 Section (42%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#E5E7EB] overflow-hidden">
                  <div className="h-full bg-[#FF8A00] rounded-full" style={{ width: "42%" }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-[11px] font-bold text-[#0F172A] mb-1">
                  <span className="flex items-center gap-1.5"><CircleStop size={13} className="text-[#0284C7]" /> Siding Precedence Wait</span>
                  <span className="font-mono text-[10px] text-[#475569]">1 Train (35%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#E5E7EB] overflow-hidden">
                  <div className="h-full bg-[#0284C7] rounded-full" style={{ width: "35%" }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-[11px] font-bold text-[#0F172A] mb-1">
                  <span className="flex items-center gap-1.5"><CloudRain size={13} className="text-[#0EA5E9]" /> Weather & Adhesion</span>
                  <span className="font-mono text-[10px] text-[#475569]">Nominal (0%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#E5E7EB] overflow-hidden">
                  <div className="h-full bg-[#0EA5E9] rounded-full" style={{ width: "5%" }} />
                </div>
              </div>
            </div>

            {/* Active Alert Banner */}
            <div className="rounded-xl border-2 border-[#FF4D4D] bg-[#FEF2F2] p-3.5 text-xs space-y-1 shadow-2xs">
              <div className="flex items-center gap-1.5 text-[#DC2626] font-black text-[11px]">
                <AlertTriangle size={15} /> Operational Alert:
              </div>
              <p className="text-[10px] text-[#991B1B] font-bold leading-tight">
                {activeCautionSection
                  ? `Caution Order enforced on ${activeCautionSection} (30 km/h speed ceiling active).`
                  : "All main lines clear. Freight 58210 held in Hassan Siding to maintain Express priority."}
              </p>
            </div>

          </section>

        </div>


        {/* =====================================================
            4. SELECTED TRAIN SPEED DERIVATION & CUSTOM PIPELINE
        ====================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Real-Time Speed Derivation for the Selected Train */}
          <section className="rounded-2xl border-2 border-[#1E293B]/20 bg-white p-5 shadow-sm space-y-4">
            
            <div className="flex items-center justify-between border-b-2 border-[#1E293B]/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FF8A00] text-white">
                  <Gauge size={16} />
                </div>
                <h3 className="text-[15px] font-black text-[#0F172A]">
                  Speed & Axle Derivation: Train {currentSelectedTrain.number}
                </h3>
              </div>
              <span className="text-[10px] font-mono font-black text-white bg-[#0284C7] px-2.5 py-1 rounded-full border border-[#0369A1] shadow-2xs">
                {currentSelectedTrain.name}
              </span>
            </div>

            {/* Two Derivation Methods for Selected Train */}
            <div className="grid grid-cols-2 gap-3">
              
              <div className="rounded-xl border-2 border-[#1E293B]/20 bg-[#FFFBEB] p-3.5 space-y-1 shadow-2xs">
                <div className="flex items-center justify-between text-[10px] text-[#475569]">
                  <span className="font-bold">Method 1: Axles / Second</span>
                  <Radio size={13} className="text-[#0284C7]" />
                </div>
                <div className="text-2xl font-black font-mono text-[#0F172A]">
                  {currentSelectedTrain.speed} <span className="text-xs text-[#64748B] font-normal">km/h</span>
                </div>
                <p className="text-[9px] text-[#475569] font-mono font-medium">
                  Speed ≈ Axle Spacing / Δt (Freq: {currentSelectedTrain.axlesPerSec} Hz)
                </p>
              </div>

              <div className="rounded-xl border-2 border-[#1E293B]/20 bg-[#FFFBEB] p-3.5 space-y-1 shadow-2xs">
                <div className="flex items-center justify-between text-[10px] text-[#475569]">
                  <span className="font-bold">Method 2: Block Transit Time</span>
                  <Clock3 size={13} className="text-[#00875A]" />
                </div>
                <div className="text-2xl font-black font-mono text-[#0F172A]">
                  {currentSelectedTrain.speed > 0 ? +(currentSelectedTrain.speed * 0.98).toFixed(1) : 0.0}{" "}
                  <span className="text-xs text-[#64748B] font-normal">km/h</span>
                </div>
                <p className="text-[9px] text-[#475569] font-mono font-medium">
                  v = d / (t_exit - t_entry) across block section
                </p>
              </div>

            </div>

            {/* Live Sensor Ticker */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] font-black text-[#475569]">
                <span>Live Axle Counter Trigger Feed</span>
                <span className="flex items-center gap-1 text-[#00875A]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00875A] animate-ping" /> Live Stream
                </span>
              </div>

              <div className="rounded-xl border-2 border-[#1E293B]/20 bg-[#FAF7EE] p-3 font-mono text-[10px] space-y-2 max-h-[145px] overflow-y-auto">
                {sensorLogs.map((log, idx) => (
                  <div key={`${log.id || log.time}-${idx}`} className="flex items-center justify-between border-b border-[#1E293B]/10 pb-1.5 last:border-0 last:pb-0">
                    <span className="text-[#64748B]">{log.time}</span>
                    <span className="text-[#0284C7] font-bold">{log.sensor}</span>
                    <span className="text-[#0F172A] font-semibold">{log.event}</span>
                    <span className="text-[#FF8A00] font-black">{log.speed}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[8px] font-black shadow-2xs ${
                        log.status === "OCCUPIED"
                          ? "bg-[#FF4D4D] text-white border border-[#B91C1C]"
                          : log.status === "CAUTION"
                          ? "bg-[#FACC15] text-[#0F172A] border border-[#CA8A04]"
                          : "bg-[#00875A] text-white border border-[#047857]"
                      }`}
                    >
                      {log.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </section>


          {/* Authentic Section Control & Interlocking Telemetry Panel */}
          <section className="rounded-2xl border-2 border-[#1E293B]/20 bg-white p-5 shadow-sm space-y-4">

            {/* Header with selected train and section */}
            <div className="flex items-center justify-between border-b-2 border-[#1E293B]/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0284C7] text-white">
                  <ShieldCheck size={16} />
                </div>
                <h3 className="text-[15px] font-black text-[#0F172A]">
                  Section Control & Interlocking: Train {currentSelectedTrain.number}
                </h3>
              </div>
              <span className="text-[10px] font-mono font-black text-white bg-[#0284C7] px-2.5 py-1 rounded-full border border-[#0369A1] shadow-2xs">
                ABS Corridor · SEC: {currentSelectedTrain.section_id}
              </span>
            </div>

            {/* Operational Telemetry Cards */}
            <div className="space-y-2.5 text-xs">
              
              {/* Telemetry Block 1: Signal Aspect & Route Interlocking */}
              <div className="rounded-xl border-2 border-[#1E293B]/20 bg-[#FFFBEB] p-3.5 space-y-2 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-black text-[#0F172A]">
                    <GitBranch size={14} className="text-[#0284C7]" /> Signal Aspect & Route Interlocking
                  </span>
                  <span className="flex items-center gap-1 font-mono text-[9px] font-black text-[#00875A] bg-[#00875A]/10 px-2 py-0.5 rounded border border-[#00875A]/30">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#00875A] animate-pulse" />
                    ROUTE LOCKED & DETECTED
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div className="rounded-lg bg-white border border-[#1E293B]/20 p-2">
                    <span className="text-[9px] font-bold text-[#475569] block">Signal Aspect</span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#00875A] shadow-xs" />
                      <span className="font-mono font-black text-[11px] text-[#00875A]">CLEAR (Green)</span>
                    </div>
                  </div>

                  <div className="rounded-lg bg-white border border-[#1E293B]/20 p-2">
                    <span className="text-[9px] font-bold text-[#475569] block">Point Machine</span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="font-mono font-black text-[11px] text-[#0F172A]">NORMAL (101-A)</span>
                    </div>
                  </div>

                  <div className="rounded-lg bg-white border border-[#1E293B]/20 p-2">
                    <span className="text-[9px] font-bold text-[#475569] block">Headway Buffer</span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Clock3 size={12} className="text-[#0284C7]" />
                      <span className="font-mono font-black text-[11px] text-[#0284C7]">7.8 km · 5.4m</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Telemetry Block 2: Electrical Traction (OHE) & Track Structure */}
              <div className="rounded-xl border-2 border-[#1E293B]/20 bg-[#FFFBEB] p-3.5 space-y-2 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-black text-[#0F172A]">
                    <Zap size={14} className="text-[#FF8A00]" /> 25 kV AC Traction & P-Way Structure
                  </span>
                  <span className="font-mono text-[9px] font-black text-[#0284C7] bg-[#0284C7]/10 px-2 py-0.5 rounded border border-[#0284C7]/30">
                    OHE SUBSTATION STABLE
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div className="rounded-lg bg-white border border-[#1E293B]/20 p-2">
                    <span className="text-[9px] font-bold text-[#475569] block">Feeder Voltage</span>
                    <span className="font-mono font-black text-[11px] text-[#0F172A] mt-1 block">
                      24.8 kV <span className="text-[9px] text-[#00875A] font-bold">(±1.2%)</span>
                    </span>
                  </div>

                  <div className="rounded-lg bg-white border border-[#1E293B]/20 p-2">
                    <span className="text-[9px] font-bold text-[#475569] block">Rail Temp (CWR)</span>
                    <span className="font-mono font-black text-[11px] text-[#00875A] mt-1 block">
                      +34°C <span className="text-[9px] text-[#475569] font-normal">(Safe &lt;52°C)</span>
                    </span>
                  </div>

                  <div className="rounded-lg bg-white border border-[#1E293B]/20 p-2">
                    <span className="text-[9px] font-bold text-[#475569] block">Axle Redundancy</span>
                    <span className="font-mono font-black text-[11px] text-[#0284C7] mt-1 block">
                      CH-A & CH-B <span className="text-[9px] text-[#00875A] font-bold">HOT</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Telemetry Block 3: Precedence Rule & Section Clearance Status */}
              <div className="rounded-xl border-2 border-[#1E293B]/20 bg-[#FFFBEB] p-3.5 space-y-1.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-black text-[#0F172A]">
                    <Activity size={14} className="text-[#00875A]" /> Precedence Rule & ETA Projection
                  </span>
                  <span className="font-mono text-[9px] font-black text-[#0F172A] bg-white border border-[#1E293B]/20 px-2 py-0.5 rounded">
                    WTT Rule: 402-B
                  </span>
                </div>
                <p className="text-[10px] text-[#475569] font-medium leading-relaxed">
                  <strong className="text-[#0F172A]">Corridor Dispatching:</strong> {currentSelectedTrain.precedence}. Rake formation verified with <strong className="text-[#0F172A]">{currentSelectedTrain.coaches}</strong>.
                </p>
                <div className="flex items-center justify-between border-t border-[#1E293B]/10 pt-1.5 text-[10px]">
                  <span className="text-[#475569]">Predicted Destination ETA:</span>
                  <strong className="font-mono text-[#0284C7] font-black">
                    {currentSelectedTrain.etaDestination} {currentSelectedTrain.delayMin > 0 ? `(+${currentSelectedTrain.delayMin}m delay)` : "(On Time)"}
                  </strong>
                </div>
              </div>

            </div>

          </section>

        </div>

      </div>

    </main>
  );
}
