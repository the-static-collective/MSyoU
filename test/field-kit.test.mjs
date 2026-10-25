import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createCard,advance,makePacket,validCard,validPacket} from "../src/field-kit.mjs";

const base = () => createCard({id:"demo-001",kind:"NEED",title:"Fictional pantry vegetables",detail:"Only a fictional example.",at:"2026-10-24T22:00:00Z"});
const t = "2026-10-24T22:01:00Z";
test("draft → explicit HOLD → prepared, with no false remote claim", () => {
  const draft=base(), held=advance(draft,"LOCAL_HOLD",t), prepared=advance(held,"HANDOFF_PREPARED",t);
  const p=makePacket(prepared,t);
  assert.equal(draft.stage,"DRAFT");
  assert.equal(prepared.submitted,false);
  assert.equal(p.status,"PREPARED_NOT_SENT");
  assert.equal(p.review,"NOT_RECEIVED");
  assert.equal(p.publication,"NOT_PUBLISHED");
  assert.equal(p.proofOfWork,"NONE");
  assert.equal(validPacket(p),true);
});
test("no jumping ahead and no exporting DRAFT", () => {
  assert.throws(()=>advance(base(),"HANDOFF_PREPARED",t));
  assert.throws(()=>makePacket(base(),t));
});
test("reject invented witness, unauthorized state, and forged submission", () => {
  const a=base();
  assert.equal(validCard({...a,submitted:true}),false);
  assert.equal(validCard({...a,stage:"WITNESSED"}),false);
  assert.equal(validCard({...a,witnessedBy:"MSU"}),false);
  assert.equal(validCard({...a,events:[{...a.events[0],actor:"VERIFIED_HUMAN"}]}),false);
  assert.equal(validCard({...a,title:""}),false);
});
test("tampering with packet truth status is rejected", () => {
  const packet=makePacket(advance(advance(base(),"LOCAL_HOLD",t),"HANDOFF_PREPARED",t),t);
  assert.equal(validPacket({...packet,status:"SENT"}),false);
  assert.equal(validPacket({...packet,publication:"PUBLISHED"}),false);
  assert.equal(validPacket({...packet,review:"ACCEPTED"}),false);
});
test("no browser storage, outbound requests or remote script dependencies", () => {
  for (const file of ["app.js","src/field-kit.mjs","index.html"]) {
    const body=readFileSync(new URL("../"+file, import.meta.url),"utf8");
    for (const forbidden of ["localStorage","sessionStorage","XMLHttpRequest","navigator.sendBeacon","WebSocket(","fetch(","http-equiv=\"refresh\"","<script src=\"https://"]) {
      assert.equal(body.includes(forbidden),false, file+" contains "+forbidden);
    }
  }
});
