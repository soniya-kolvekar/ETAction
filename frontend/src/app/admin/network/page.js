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
  CircleStop
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
      className={`min-w-[145px] rounded-xl border bg-white p-2.5 shadow-xs transition-all duration-200 ${
        selected
          ? "border-[#2563eb] ring-2 ring-[#2563eb]/20 shadow-md"
          : "border-[#e2e8f0] hover:border-[#cbd5e1] hover:shadow-xs"
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
      <div className="flex items-center justify-between gap-2 border-b border-[#f1f5f9] pb-1.5 mb-1.5">
        <span className="font-mono text-[11px] font-bold text-[#0f172a] bg-[#f8fafc] px-1.5 py-0.5 rounded border border-[#e2e8f0]">
          {data.code}
        </span>
        <span
          className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
            isTerminal
              ? "bg-[#fef2f2] text-[#ef4444] border border-[#fecaca]"
              : isJunction
              ? "bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe]"
              : isSiding
              ? "bg-[#f5f3ff] text-[#7c3aed] border border-[#ddd6fe]"
              : "bg-[#f8fafc] text-[#64748b] border border-[#e2e8f0]"
          }`}
        >
          {data.type}
        </span>
      </div>

      {/* Name and Capacity */}
      <div>
        <p className="text-[11px] font-bold text-[#0f172a] truncate leading-tight">
          {data.name}
        </p>
        <p className="text-[9px] text-[#64748b] mt-0.5">
          {data.platforms} {data.platforms === 1 ? "Track" : "Platforms"} · Signal: <span className="text-[#10b981] font-semibold">AUTO</span>
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

  let strokeColor = "#10b981"; // CLEAR
  let strokeWidth = 3.5;
  let strokeDasharray = undefined;

  if (isOccupied) {
    strokeColor = status === "OCCUPIED_FREIGHT" ? "#6366f1" : status === "OCCUPIED_COASTAL" ? "#0ea5e9" : "#ef4444";
    strokeWidth = 4.5;
    strokeDasharray = "8,4";
  } else if (isCaution) {
    strokeColor = "#f59e0b";
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
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-bold text-white shadow-md border border-white/80 animate-pulse ${
                train.type === "freight"
                  ? "bg-[#6366f1]"
                  : train.type === "coastal"
                  ? "bg-[#0ea5e9]"
                  : "bg-[#ef4444]"
              }`}
            >
              <TrainFront size={11} />
              <span className="font-mono">{train.number}</span>
              <span className="bg-black/30 px-1 py-0.2 rounded font-mono text-[8px]">
                {train.speed} km/h
              </span>
            </div>
          ) : isCaution ? (
            <div className="rounded-full bg-[#fffbeb] px-2 py-0.5 text-[8px] font-bold text-[#d97706] border border-[#fde68a] shadow-xs">
              ⚠️ 30 km/h TCO
            </div>
          ) : (
            <div className="rounded bg-white/90 px-1.5 py-0.5 text-[8px] font-mono text-[#94a3b8] border border-[#e2e8f0] opacity-0 hover:opacity-100 transition shadow-xs">
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

  // Automated Scenario State (20s cycle)
  const [simStep, setSimStep] = useState(0);
  const [lastRefreshed, setLastRefreshed] = useState("");
  const [activeScenario, setActiveScenario] = useState({
    name: "Express Precedence Execution",
    tag: "DISPATCHING",
    description: "Express 16526 given green corridor; Freight 58210 looped in Hassan Siding for precedence."
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
        name: "Express Precedence Execution",
        tag: "DISPATCHING",
        description: "Express 16526 crosses Ghat section; Freight 58210 looped in Siding; Axle counts match 100%."
      },
      {
        name: "Temporary Caution Order Enforced",
        tag: "SAFETY_RESTRICTION",
        description: "Track renewal at SEC_HAS_ASK triggers automatic 30 km/h speed ceiling; Dynamic ETA auto-compounded (+6m)."
      },
      {
        name: "High-Speed Chord Clearance",
        tag: "OPTIMAL_FLOW",
        description: "Express 16526 advances to High-Speed Chord SEC_ASK_YPR; Section cleared behind it; Speed restored to 94.8 km/h."
      },
      {
        name: "Terminal Approach Corridor",
        tag: "TERMINAL_DISPATCH",
        description: "Express 16526 enters Bengaluru terminal block; Freight departs siding towards Mysuru; Intercity clear."
      }
    ];

    // Steady 20-second interval as requested
    const interval = setInterval(() => {
      setSimStep((prev) => {
        const next = (prev + 1) % 4;
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
        } else if (next === 2) {
          setTrainStates({
            express: { key: "express", number: "16526", name: "Kanyakumari Exp", type: "Superfast Express", section_id: "SEC_ASK_YPR", speed: 94.8, axlesPerSec: 5.12, delayMin: 3, status: "ON_TIME", etaDestination: "18:48 IST (KSR Bengaluru)", coaches: "24-coach LHB Rake (68 Axles)", precedence: "High-speed chord green signals granted", confidence: "98.9%" },
            freight: { key: "freight", number: "58210", name: "BCN Freight Rake", type: "Heavy Goods", section_id: "SEC_HAS_MYS", speed: 42.0, axlesPerSec: 2.27, delayMin: 22, status: "DELAYED", etaDestination: "22:30 IST (Mysuru Jn)", coaches: "58-wagon BCN Freight Rake (116 Axles)", precedence: "Departed siding towards Mysuru following Express clearance", confidence: "95.5%" },
            coastal: { key: "coastal", number: "12685", name: "Mangaluru-Goa Intercity", type: "Express", section_id: "SEC_UD_KUDA", speed: 76.2, axlesPerSec: 4.12, delayMin: 0, status: "ON_TIME", etaDestination: "11:22 IST (Kundapura)", coaches: "18-coach ICF Rake (72 Axles)", precedence: "Approaching Kundapura platform line", confidence: "99.1%" }
          });
          setActiveCautionSection(null);
          setSensorLogs((p) => [{ id: `log-${Date.now()}-${(Math.random() * 1e6) | 0}`, time: nowStr, sensor: "AC_OUT_SEC_HAS_ASK", event: "SECTION_CLEARED", axles: 68, speed: "94.8 km/h", status: "CLEAR" }, ...p.slice(0, 6)]);
        } else {
          setTrainStates({
            express: { key: "express", number: "16526", name: "Kanyakumari Exp", type: "Superfast Express", section_id: "SEC_YPR_SBC", speed: 48.6, axlesPerSec: 2.62, delayMin: 2, status: "ON_TIME", etaDestination: "18:47 IST (KSR Bengaluru)", coaches: "24-coach LHB Rake (68 Axles)", precedence: "Terminal corridor entry authorized", confidence: "99.3%" },
            freight: { key: "freight", number: "58210", name: "BCN Freight Rake", type: "Heavy Goods", section_id: "SEC_MYS_SBC", speed: 46.1, axlesPerSec: 2.49, delayMin: 24, status: "DELAYED", etaDestination: "22:35 IST (Mysuru Jn)", coaches: "58-wagon BCN Freight Rake (116 Axles)", precedence: "Main south corridor clear", confidence: "95.5%" },
            coastal: { key: "coastal", number: "12685", name: "Mangaluru-Goa Intercity", type: "Express", section_id: "SEC_MAJN_UD", speed: 81.3, axlesPerSec: 4.39, delayMin: 1, status: "ON_TIME", etaDestination: "11:20 IST (Kundapura)", coaches: "18-coach ICF Rake (72 Axles)", precedence: "Coastal block signal clear", confidence: "99.1%" }
          });
          setActiveCautionSection(null);
          setSensorLogs((p) => [{ id: `log-${Date.now()}-${(Math.random() * 1e6) | 0}`, time: nowStr, sensor: "AC_IN_SEC_YPR_SBC", event: "TERMINAL_BLOCK_ENTRY", axles: 68, speed: "48.6 km/h", status: "OCCUPIED" }, ...p.slice(0, 6)]);
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
    <main className="min-h-screen bg-[#f8fafc] text-[#0f172a]">

      {/* =====================================================
          TOP NAVIGATION HEADER (CLEANED UP PER REQUEST)
      ====================================================== */}
      <header className="sticky top-0 z-40 border-b border-[#e2e8f0] bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-[64px] max-w-[1600px] items-center justify-between px-5 lg:px-8">

          {/* Left: Brand "AreWeThereYet" */}
          <div className="flex items-center gap-3">
            <div className="flex h-[38px] w-[38px] items-center justify-center rounded-xl bg-gradient-to-tr from-[#2563eb] to-[#38bdf8] text-white shadow-xs">
              <TrainFront size={20} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[17px] font-bold tracking-tight text-[#0f172a]">
                  AreWeThereYet
                </span>
                <span className="rounded-full bg-[#eff6ff] px-2.5 py-0.5 text-[9px] font-bold text-[#2563eb] border border-[#bfdbfe]">
                  Section Control Room
                </span>
              </div>
              <p className="text-[10px] text-[#64748b]">
                Real-Time Physical Sensing · Axle Counter Topology · Dynamic ETA System
              </p>
            </div>
          </div>

          {/* Right: Refresh Status Indicator */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-[#94a3b8] hidden sm:inline">
              Topology cycle: 20s · Updated: <strong className="font-mono text-[#64748b]">{lastRefreshed || "Just now"}</strong>
            </span>
            <button
              type="button"
              onClick={loadDashboardData}
              className="flex items-center gap-1.5 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] px-3 py-1.5 text-[11px] font-semibold text-[#475569] shadow-xs transition hover:bg-white hover:text-[#2563eb]"
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
      <div className="mx-auto max-w-[1600px] px-5 py-6 lg:px-8 space-y-6">

        {/* =====================================================
            1. TOP METRIC CARDS (INFORMATIVE NETWORK FLOW)
        ====================================================== */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">

          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-xs hover:shadow-sm transition">
            <div className="flex items-center justify-between text-[#64748b]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">Monitored Blocks</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#eff6ff] text-[#2563eb]">
                <Layers size={14} />
              </div>
            </div>
            <div className="mt-2 text-2xl font-extrabold text-[#0f172a]">
              10 <span className="text-xs font-normal text-[#64748b]">Blocks</span>
            </div>
            <div className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-[#10b981]">
              <CheckCircle2 size={12} /> 100% Sensor Grid Active
            </div>
          </div>

          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-xs hover:shadow-sm transition">
            <div className="flex items-center justify-between text-[#64748b]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">Active Trains</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f0fdfa] text-[#0d9488]">
                <TrainFront size={14} />
              </div>
            </div>
            <div className="mt-2 text-2xl font-extrabold text-[#0f172a]">
              3 <span className="text-xs font-normal text-[#64748b]">On Track</span>
            </div>
            <div className="mt-1 text-[10px] font-semibold text-[#2563eb] truncate">
              Express · Freight · Intercity
            </div>
          </div>

          {/* REPLACED STAT CARD: NETWORK FLOW VELOCITY */}
          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-xs hover:shadow-sm transition">
            <div className="flex items-center justify-between text-[#64748b]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">Network Flow Velocity</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#fffbeb] text-[#d97706]">
                <Gauge size={14} />
              </div>
            </div>
            <div className="mt-2 text-2xl font-extrabold text-[#0f172a]">
              {networkAverageSpeed} <span className="text-xs font-normal text-[#64748b]">km/h</span>
            </div>
            <div className="mt-1 text-[10px] font-semibold text-[#059669]">
              Fleet: 42–95 km/h · 92% On-Time
            </div>
          </div>

          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-xs hover:shadow-sm transition">
            <div className="flex items-center justify-between text-[#64748b]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">Caution Orders</span>
              <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${activeCautionSection ? 'bg-[#fef2f2] text-[#ef4444]' : 'bg-[#ecfdf5] text-[#10b981]'}`}>
                <AlertTriangle size={14} />
              </div>
            </div>
            <div className="mt-2 text-2xl font-extrabold text-[#0f172a]">
              {activeCautionSection ? 1 : 0} <span className="text-xs font-normal text-[#64748b]">Active TCO</span>
            </div>
            <div className={`mt-1 text-[10px] font-semibold truncate ${activeCautionSection ? 'text-[#ef4444]' : 'text-[#10b981]'}`}>
              {activeCautionSection ? "30 km/h on Hassan-Arsikere" : "Nominal Speeds Permitted"}
            </div>
          </div>

          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-xs hover:shadow-sm transition">
            <div className="flex items-center justify-between text-[#64748b]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">ETA Accuracy</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#eff6ff] text-[#2563eb]">
                <ShieldCheck size={14} />
              </div>
            </div>
            <div className="mt-2 text-2xl font-extrabold text-[#0f172a]">
              98.4%
            </div>
            <div className="mt-1 text-[10px] font-semibold text-[#10b981]">
              Ground-Truth Calibrated
            </div>
          </div>

        </div>


        {/* =====================================================
            2. 2D RAILWAY NETWORK CANVAS (20s REFRESH CADENCE)
        ====================================================== */}
        <section className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-xs space-y-4">
          
          {/* Header & Scenario Banner */}
          <div className="flex flex-col justify-between gap-4 border-b border-[#f1f5f9] pb-4 lg:flex-row lg:items-center">
            <div>
              <div className="flex items-center gap-2">
                <Route size={18} className="text-[#2563eb]" />
                <h2 className="text-[15px] font-bold text-[#0f172a]">
                  Block Section Network Topology & Sensor Grid
                </h2>
                <span className="rounded-full bg-[#ecfdf5] border border-[#a7f3d0] px-2.5 py-0.5 text-[9px] font-bold text-[#059669]">
                  20s Cycle Active
                </span>
              </div>
              <p className="mt-0.5 text-[11px] text-[#64748b]">
                Real-time block occupancy from track circuits & axle counters. Click any station or track section to inspect telemetry.
              </p>
            </div>

            {/* Current Scenario Card */}
            <div className="flex items-center gap-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] px-3.5 py-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#2563eb]/10 text-[#2563eb]">
                <Activity size={14} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-[#0f172a]">{activeScenario.name}</span>
                  <span className="rounded bg-[#eff6ff] text-[#2563eb] text-[8px] font-mono px-1.5 py-0.5 font-bold">
                    AUTO 20s
                  </span>
                </div>
                <p className="text-[9px] text-[#64748b] truncate max-w-[340px]">
                  {activeScenario.description}
                </p>
              </div>
            </div>
          </div>

          {/* REACT FLOW CANVAS CONTAINER (SPACIOUS 560px HEIGHT) */}
          <div className="h-[560px] w-full rounded-xl border border-[#e2e8f0] bg-[#fafbfc] relative overflow-hidden">
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
              <Controls className="bg-white border border-[#e2e8f0] shadow-xs rounded-lg" />
            </ReactFlow>
          </div>

          {/* Legend & Selected Details Readout */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#f1f5f9] pt-4">
            
            {/* Status Legend */}
            <div className="flex flex-wrap items-center gap-4 text-[10px]">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#10b981]" />
                <span className="text-[#64748b]">Clear Block</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ef4444]" />
                <span className="text-[#64748b]">Occupied (Express)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#6366f1]" />
                <span className="text-[#64748b]">Freight Siding Loop</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#0ea5e9]" />
                <span className="text-[#64748b]">Coastal Intercity</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]" />
                <span className="text-[#64748b]">Caution Order (30 km/h)</span>
              </div>
            </div>

            {/* Selected Readout */}
            {selectedDetails && (
              <div className="flex items-center gap-3 text-[11px] font-semibold text-[#0f172a] bg-[#f8fafc] border border-[#e2e8f0] px-3.5 py-1.5 rounded-xl">
                <Cpu size={14} className="text-[#2563eb]" />
                <span>
                  Selected {selectedDetails.type === "station" ? "Station" : "Section"}:{" "}
                  <strong className="font-mono text-[#2563eb]">
                    {selectedDetails.code || selectedDetails.id}
                  </strong>{" "}
                  ({selectedDetails.name || selectedDetails.label})
                </span>
                <span className="text-[10px] text-[#64748b]">
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
          <section className="lg:col-span-7 rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-xs space-y-4">
            
            <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <TrainFront size={18} className="text-[#2563eb]" />
                  <h3 className="text-sm font-bold text-[#0f172a]">Currently Running Trains</h3>
                </div>
                <p className="text-[10px] text-[#64748b] mt-0.5">
                  Click any train below to inspect its dedicated Speed Derivation & Circumstance Engine.
                </p>
              </div>
              <span className="text-[10px] font-bold text-[#2563eb] bg-[#eff6ff] border border-[#bfdbfe] px-2 py-0.5 rounded-full">
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
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition cursor-pointer ${
                      isSelected
                        ? "border-[#2563eb] bg-[#eff6ff]/40 ring-2 ring-[#2563eb]/20 shadow-xs"
                        : "border-[#e2e8f0] bg-[#f8fafc] hover:bg-white hover:border-[#cbd5e1]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-xl text-white font-bold shadow-xs ${
                          train.key === "freight"
                            ? "bg-[#6366f1]"
                            : train.key === "coastal"
                            ? "bg-[#0ea5e9]"
                            : "bg-[#2563eb]"
                        }`}
                      >
                        <TrainFront size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#0f172a]">
                            {train.number}
                          </span>
                          <span className="text-[11px] font-semibold text-[#475569]">
                            {train.name}
                          </span>
                          <span className="text-[9px] text-[#94a3b8]">({train.type})</span>
                        </div>
                        <p className="text-[10px] text-[#64748b] flex items-center gap-1 mt-0.5">
                          <MapPin size={11} className="text-[#2563eb]" /> Block Section:{" "}
                          <strong className="font-mono text-[#0f172a]">{train.section_id}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center justify-end gap-1.5 font-mono text-xs font-bold text-[#0f172a]">
                        <Gauge size={13} className="text-[#d97706]" />
                        {train.speed} km/h
                      </div>
                      <div className="mt-0.5">
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            train.status === "HELD_IN_SIDING"
                              ? "bg-[#f5f3ff] text-[#7c3aed] border border-[#ddd6fe]"
                              : train.delayMin > 0
                              ? "bg-[#fffbeb] text-[#d97706] border border-[#fde68a]"
                              : "bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0]"
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
          <section className="lg:col-span-5 rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-xs space-y-4">
            
            <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3">
              <div className="flex items-center gap-2">
                <Activity size={18} className="text-[#ef4444]" />
                <h3 className="text-sm font-bold text-[#0f172a]">Network Delays & Alerts</h3>
              </div>
              <span className="text-[10px] font-mono text-[#64748b]">Live DB Sync</span>
            </div>

            {/* Delay Cause Bars */}
            <div className="space-y-2.5">
              <div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-[#0f172a] mb-1">
                  <span className="flex items-center gap-1.5"><Wrench size={13} className="text-[#d97706]" /> Maintenance Blocks (TCO)</span>
                  <span className="font-mono text-[10px] text-[#64748b]">1 Section (42%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#f1f5f9] overflow-hidden">
                  <div className="h-full bg-[#f59e0b] rounded-full" style={{ width: "42%" }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-[#0f172a] mb-1">
                  <span className="flex items-center gap-1.5"><CircleStop size={13} className="text-[#6366f1]" /> Siding Precedence Wait</span>
                  <span className="font-mono text-[10px] text-[#64748b]">1 Train (35%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#f1f5f9] overflow-hidden">
                  <div className="h-full bg-[#6366f1] rounded-full" style={{ width: "35%" }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-[#0f172a] mb-1">
                  <span className="flex items-center gap-1.5"><CloudRain size={13} className="text-[#0284c7]" /> Weather & Adhesion</span>
                  <span className="font-mono text-[10px] text-[#64748b]">Nominal (0%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#f1f5f9] overflow-hidden">
                  <div className="h-full bg-[#0ea5e9] rounded-full" style={{ width: "5%" }} />
                </div>
              </div>
            </div>

            {/* Active Alert Banner */}
            <div className="rounded-xl border border-[#fee2e2] bg-[#fef2f2]/60 p-3 text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-[#ef4444] font-bold text-[11px]">
                <AlertTriangle size={14} /> Operational Alert:
              </div>
              <p className="text-[10px] text-[#991b1b] leading-tight">
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
          <section className="rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-xs space-y-4">
            
            <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3">
              <div className="flex items-center gap-2">
                <Gauge size={18} className="text-[#d97706]" />
                <h3 className="text-sm font-bold text-[#0f172a]">
                  Speed & Axle Derivation: Train {currentSelectedTrain.number}
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-[#2563eb] bg-[#eff6ff] px-2.5 py-1 rounded-full border border-[#bfdbfe]">
                {currentSelectedTrain.name}
              </span>
            </div>

            {/* Two Derivation Methods for Selected Train */}
            <div className="grid grid-cols-2 gap-3">
              
              <div className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-3.5 space-y-1">
                <div className="flex items-center justify-between text-[10px] text-[#64748b]">
                  <span className="font-bold">Method 1: Axles / Second</span>
                  <Radio size={13} className="text-[#0284c7]" />
                </div>
                <div className="text-2xl font-bold font-mono text-[#0f172a]">
                  {currentSelectedTrain.speed} <span className="text-xs text-[#64748b] font-normal">km/h</span>
                </div>
                <p className="text-[9px] text-[#64748b] font-mono">
                  Speed ≈ Axle Spacing / Δt (Freq: {currentSelectedTrain.axlesPerSec} Hz)
                </p>
              </div>

              <div className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-3.5 space-y-1">
                <div className="flex items-center justify-between text-[10px] text-[#64748b]">
                  <span className="font-bold">Method 2: Block Transit Time</span>
                  <Clock3 size={13} className="text-[#10b981]" />
                </div>
                <div className="text-2xl font-bold font-mono text-[#0f172a]">
                  {currentSelectedTrain.speed > 0 ? +(currentSelectedTrain.speed * 0.98).toFixed(1) : 0.0}{" "}
                  <span className="text-xs text-[#64748b] font-normal">km/h</span>
                </div>
                <p className="text-[9px] text-[#64748b] font-mono">
                  v = d / (t_exit - t_entry) across block section
                </p>
              </div>

            </div>

            {/* Live Sensor Ticker */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold text-[#64748b]">
                <span>Live Axle Counter Trigger Feed</span>
                <span className="flex items-center gap-1 text-[#059669]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10b981] animate-ping" /> Live Stream
                </span>
              </div>

              <div className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-3 font-mono text-[10px] space-y-2 max-h-[145px] overflow-y-auto">
                {sensorLogs.map((log, idx) => (
                  <div key={`${log.id || log.time}-${idx}`} className="flex items-center justify-between border-b border-[#e2e8f0] pb-1.5 last:border-0 last:pb-0">
                    <span className="text-[#94a3b8]">{log.time}</span>
                    <span className="text-[#2563eb] font-bold">{log.sensor}</span>
                    <span className="text-[#334155]">{log.event}</span>
                    <span className="text-[#d97706] font-bold">{log.speed}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                        log.status === "OCCUPIED"
                          ? "bg-[#fef2f2] text-[#ef4444]"
                          : log.status === "CAUTION"
                          ? "bg-[#fffbeb] text-[#d97706]"
                          : "bg-[#ecfdf5] text-[#059669]"
                      }`}
                    >
                      {log.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </section>


          {/* Custom Train Identification & Circumstance Pipeline for Selected Train */}
          <section className="rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-xs space-y-4">

            <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-[#2563eb]" />
                <h3 className="text-sm font-bold text-[#0f172a]">
                  Train Circumstance Engine: Train {currentSelectedTrain.number}
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-[#7c3aed] bg-[#f5f3ff] px-2.5 py-1 rounded-full border border-[#ddd6fe]">
                Confidence: {currentSelectedTrain.confidence}
              </span>
            </div>

            {/* 3-Step Process Flow Cards */}
            <div className="space-y-2.5 text-xs">
              
              {/* Step 1 */}
              <div className="flex items-start gap-3 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#eff6ff] text-[#2563eb] font-bold text-[11px]">
                  1
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-[#0f172a]">Physical Axle Telemetry Detection</p>
                  <p className="text-[10px] text-[#64748b] mt-0.5">
                    Sensor <strong className="font-mono text-[#2563eb]">{currentSelectedTrain.section_id}</strong> registered wheel passes. Formation: <strong className="text-[#0f172a]">{currentSelectedTrain.coaches}</strong>.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f5f3ff] text-[#7c3aed] font-bold text-[11px]">
                  2
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-[#0f172a]">Timetable & Network Topology Match</p>
                  <p className="text-[10px] text-[#64748b] mt-0.5">
                    Correlated against Working Time Table (WTT): Confirmed Train <strong className="font-mono font-bold text-[#0f172a]">{currentSelectedTrain.number} ({currentSelectedTrain.name})</strong> with <strong className="text-[#059669]">{currentSelectedTrain.confidence} confidence</strong>.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ecfdf5] text-[#059669] font-bold text-[11px]">
                  3
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-[#0f172a]">Circumstance Assessment & Dynamic ETA</p>
                  <p className="text-[10px] text-[#64748b] mt-0.5">
                    {currentSelectedTrain.precedence}. Predicted Destination ETA:{" "}
                    <strong className="font-mono text-[#2563eb] font-bold">
                      {currentSelectedTrain.etaDestination} ({currentSelectedTrain.delayMin > 0 ? `+${currentSelectedTrain.delayMin}m delay` : 'On Time'})
                    </strong>.
                  </p>
                </div>
              </div>

            </div>

          </section>

        </div>

      </div>

    </main>
  );
}
