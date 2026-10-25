import test from "node:test";import assert from "node:assert/strict";
import {NODES,JOBS,route,inspect,validateNode,validateJob} from "../src/resource-router.mjs";
const copy=x=>structuredClone(x);
test("synthetic offers/jobs validate",()=>{for(const n of NODES)assert.ok(validateNode(n));for(const j of JOBS)assert.ok(validateJob(j));});
test("route returns only candidate or hold with no remote side effects",()=>{
 const r=route(copy(NODES),copy(JOBS[0]));
 assert.equal(r.status,"CANDIDATE_ONLY");assert.equal(r.execution,"NONE");assert.equal(r.transport,"NONE");assert.equal(r.lease,"NONE");assert.equal(r.campusAccess,"NONE");assert.equal(r.energyMeasurement,"NOT_MEASURED");
});
test("refused owner means no participation",()=>{
 const ns=copy(NODES).map(n=>({...n,optIn:false}));const r=route(ns,copy(JOBS[0]));
 assert.equal(r.status,"HOLD");assert.ok(r.reviewed.every(n=>n.reasons.includes("Owner did not opt in")));
});
test("low battery and overheating are hard stops",()=>{
 const n={...copy(NODES[0]),power:"battery",surplus:false,battery:11};
 assert.ok(inspect(n,JOBS[0]).reasons.includes("Protect battery reserve"));
 const hot={...copy(NODES[1]),thermalC:98};
 assert.ok(inspect(hot,JOBS[0]).reasons.includes("Critical thermal pressure"));
});
test("budgets and absent capabilities are hard stops",()=>{
 const n={...copy(NODES[1]),budgetWh:0,maxWatts:1,capabilities:[]};
 const r=inspect(n,JOBS[1]);
 for(const reason of ["Energy budget","Power ceiling","Capability absent"])assert.ok(r.reasons.includes(reason));
});
test("normal solar surplus is preferred where eligible",()=>{
 assert.equal(route(copy(NODES),copy(JOBS[0])).selected.id,"solar-workshop");
});
test("forged capability and duplicated nodes rejected",()=>{
 assert.equal(validateNode({...copy(NODES[0]),capabilities:["unsafe"]}),false);
 assert.equal(validateJob({...copy(JOBS[0]),capability:"unsafe"}),false);
 assert.throws(()=>route([NODES[0],NODES[0]],JOBS[0]),/Duplicate/);
});
test("planner cannot use hidden network APIs",async()=>{
 const fs=await import("node:fs");const text=fs.readFileSync(new URL("../src/resource-router.mjs",import.meta.url),"utf8");
 for(const forbidden of ["fetch(","WebSocket(","XMLHttpRequest","child_process","http.request"])assert.ok(!text.includes(forbidden));
});