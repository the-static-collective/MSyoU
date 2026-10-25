import test from "node:test";
import assert from "node:assert/strict";
import {VERSION,ALPHABET,check16,makeBeacon,parseBeacon,toMorseBits,fromMorseBits,
 observeBeacon,lookupLocalCandidate,modelCone} from "../src/morse-cone.mjs";

const frame=makeBeacon("NODE01","A13F");
test("frame has fixed grammar and check; parser never authenticates",()=>{
 assert.match(frame,/^MC1 NODE01 A13F [0-9A-F]{4}$/);
 assert.equal(VERSION,"MC1");
 const parsed=parseBeacon(frame);
 assert.equal(parsed.ok,true);
 assert.equal(parsed.sourceId,"NODE01");
 assert.equal(parsed.authenticated,false);
 assert.equal(check16("MC1 NODE01 A13F"),frame.slice(-4));
});
test("ordinary Morse alphabet and clean keyed round trip",()=>{
 assert.equal(ALPHABET.A,".-");assert.equal(ALPHABET.N,"-.");
 assert.equal(toMorseBits("A"),"10111");
 assert.equal(fromMorseBits(toMorseBits("AN 50")), "AN 50");
 assert.equal(fromMorseBits(toMorseBits(frame)),frame);
});
test("corrupt checksums, stale frames and unsupported message shapes refuse",()=>{
 const changed=frame.replace("NODE01","NODE02");
 assert.equal(parseBeacon(changed).reason,"CHECK_FAILED");
 assert.equal(parseBeacon("MC1 NODE01 A13F BAD!").ok,false);
 assert.equal(parseBeacon("MC1 NODE01 A13F "+frame.slice(-4)+" EXECUTE").ok,false);
 assert.throws(()=>makeBeacon("longerid","A13F"));
 assert.throws(()=>makeBeacon("NODE01","random"));
 assert.throws(()=>toMorseBits("DROP TABLE"));
 assert.throws(()=>fromMorseBits("10100000000"));
 assert.throws(()=>fromMorseBits("11111"));
});
test("only decoded arrival creates nonauthoritative observation, not a resource grant",()=>{
 const r=observeBeacon(frame,{channel:"clear"});
 assert.equal(r.outcome,"DECODED_UNTRUSTED");
 assert.equal(r.identityVerified,false);
 assert.equal(r.provenance,"NONE");
 assert.equal(r.resourceGranted,false);
 assert.equal(r.execution,"NONE");
 assert.equal(r.next,"HOLD");
 assert.equal(r.beacon.sourceId,"NODE01");
 assert.equal(r.beacon.authenticated,false);
});
test("loss, collision and unreachable path remain distinct and cannot invent a receiver",()=>{
 const weak=observeBeacon(frame,{channel:"weak"});
 const collision=observeBeacon(frame,{channel:"collision"});
 const unreachable=observeBeacon(frame,{channel:"unreachable"});
 assert.equal(weak.outcome,"REJECTED");
 assert.equal(weak.beacon,null);
 assert.equal(collision.outcome,"AMBIGUOUS_COLLISION");
 assert.equal(collision.decode,null);
 assert.equal(unreachable.outcome,"NOT_OBSERVED");
 assert.equal(unreachable.receivedBits,0);
 for(const r of [weak,collision,unreachable]){
  assert.equal(r.execution,"NONE");
  assert.equal(r.next,"HOLD");
  assert.equal(lookupLocalCandidate(r,[{token:"NODE01",label:"Sample"}]).state,"HOLD");
 }
});
test("local catalog match is inspectable, never identity proof or execution",()=>{
 const r=observeBeacon(frame,{channel:"clear"});
 const matched=lookupLocalCandidate(r,[{token:"NODE01",label:"Fictional PC"}]);
 assert.equal(matched.state,"LOOKUP_CANDIDATE_ONLY");
 assert.equal(matched.originAssurance,"NONE");
 assert.equal(matched.execution,"NONE");
 assert.equal(lookupLocalCandidate(r,[{token:"other",label:"Other"}]).state,"HOLD");
 assert.equal(lookupLocalCandidate(r,[{token:"NODE01"},{token:"NODE01"}]).state,"HOLD");
 assert.equal(lookupLocalCandidate({...r,identityVerified:true},[{token:"NODE01"}]).state,"HOLD");
 assert.equal(lookupLocalCandidate({...r,next:"EXECUTE"},[{token:"NODE01"}]).state,"HOLD");
});
test("A/N overlap and synthetic overhead gap are separate from source identity",()=>{
 assert.equal(modelCone(-75).state,"A_DOMINANT");
 assert.equal(modelCone(75).state,"N_DOMINANT");
 assert.equal(modelCone(0).state,"OVERLAP");
 const gap=modelCone(0,{overhead:true});
 assert.equal(gap.state,"NO_OBSERVATION");
 assert.equal(gap.a,0);
 assert.equal(gap.n,0);
 assert.throws(()=>modelCone(120));
});
test("radio lab never invokes network or arbitrary device access",async()=>{
 const fs=await import("node:fs");
 for(const filename of ["src/morse-cone.mjs","radio/ui.mjs","radio/index.html"]){
  const source=fs.readFileSync(new URL("../"+filename,import.meta.url),"utf8");
  for(const bad of ["fetch(","XMLHttpRequest","WebSocket(","navigator.sendBeacon","child_process",
   "navigator.geolocation","<script src=\"https://","localStorage"]){
   assert.equal(source.includes(bad),false,filename+" contains "+bad);
  }
 }
});
