import {makeBeacon,toMorseBits,observeBeacon,modelCone,lookupLocalCandidate} from "../src/morse-cone.mjs";
const by=id=>document.getElementById(id);
const frame=makeBeacon("NODE01","A13F");
by("frame").textContent=frame+"\nSIMULATED / NOT SIGNED / NOT TRANSMITTED";
const bits=toMorseBits(frame);
by("pulse").textContent=bits.slice(0,380)+(bits.length>380?"…":"")+"\n1 = keyed mark · 0 = gap · "+bits.length+" symbolic units";
let latest=null;
function simulate(){
 const channel=by("channel").value;
 const r=observeBeacon(frame,{channel});
 latest=r;
 by("status").textContent=r.outcome.replaceAll("_"," ");
 by("status").className="outcome"+(r.outcome==="DECODED_UNTRUSTED"?"":" bad");
 const explanations={
  DECODED_UNTRUSTED:"The signal was decoded and its checksum matched. That establishes only that this synthetic codeword survived the demo channel—not who sent it.",
  REJECTED:"The observed timing marks could not be decoded as a valid check-passing frame. Do not make up a sender.",
  AMBIGUOUS_COLLISION:"The simulated carriers overlap. The receiver does not pretend to separate them or identify a source.",
  NOT_OBSERVED:"This receiver did not observe a signal on this toy path. That is not evidence the sender does not exist."
 };
 by("explain").textContent=explanations[r.outcome]||"The observation stays held.";
 by("receipt").textContent=
  "CHANNEL: "+channel.toUpperCase()+"\nOBSERVATION: "+r.outcome+
  "\nDECODED: "+(r.decode??"NONE")+"\nIDENTITY VERIFIED: NO"+
  "\nRESOURCE GRANTED: NO\nEXECUTION: NONE\nDISPOSITION: HOLD";
 by("lookup").disabled=r.outcome!=="DECODED_UNTRUSTED";
 by("lookupOut").textContent="No resource lookup has been made. Even a decoded identifier carries no authority.";
}
by("send").addEventListener("click",simulate);
by("channel").addEventListener("change",()=>{
 latest=null;by("status").textContent="NOT OBSERVED YET";by("lookup").disabled=true;
 by("explain").textContent="Channel setting changed. No observation has been performed under this condition.";
 by("receipt").textContent="HOLD / no receiver acceptance";
 by("lookupOut").textContent="Nothing has been looked up.";
});
by("lookup").addEventListener("click",()=>{
 const found=lookupLocalCandidate(latest,[{token:"NODE01",label:"Independent fictional volunteer desktop"}]);
 by("lookupOut").textContent=found.state==="LOOKUP_CANDIDATE_ONLY"?
  "LOCAL LOOKUP CANDIDATE: "+found.label+". NOT authenticated. Never dispatched. A device owner must authorize participation separately.":
  "HOLD: "+found.reason.replaceAll("_"," ").toLowerCase();
});
function cone(){
 const p=Number(by("position").value);
 const result=modelCone(p,{overhead:by("overhead").checked});
 by("positionOut").textContent=p.toString();
 by("aBar").style.width=result.a+"%";by("nBar").style.width=result.n+"%";
 by("aValue").textContent=String(result.a);by("nValue").textContent=String(result.n);
 by("coneState").textContent=result.state.replaceAll("_"," ");
 by("coneMeaning").textContent=result.meaning;
}
by("position").addEventListener("input",cone);
by("overhead").addEventListener("change",cone);
cone();
