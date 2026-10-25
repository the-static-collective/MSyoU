/**
 * MORSE-CONE-001 — offline fictional discovery channel.
 * Never touches a radio, browser network, device, shell, or job executor.
 * Morse is a human-readable laboratory code, not a cryptographic transport.
 */
export const VERSION="MC1";
export const ALPHABET=Object.freeze({
 A:".-",B:"-...",C:"-.-.",D:"-..",E:".",F:"..-.",G:"--.",H:"....",I:"..",J:".---",
 K:"-.-",L:".-..",M:"--",N:"-.",O:"---",P:".--.",Q:"--.-",R:".-.",S:"...",T:"-",
 U:"..-",V:"...-",W:".--",X:"-..-",Y:"-.--",Z:"--..",
 0:"-----",1:".----",2:"..---",3:"...--",4:"....-",5:".....",
 6:"-....",7:"--...",8:"---..",9:"----"
});
const REVERSE=Object.freeze(Object.fromEntries(Object.entries(ALPHABET).map(([letter,code])=>[code,letter])));
const idPattern=/^[A-Z0-9]{6}$/;
const noncePattern=/^[0-9A-F]{4}$/;
export function check16(text){
 if(typeof text!=="string"||!/^[A-Z0-9 ]+$/.test(text))throw new TypeError("Expected uppercase ASCII frame text");
 let crc=65535;
 for(const ch of text){
  crc^=ch.charCodeAt(0)<<8;
  for(let j=0;j<8;j++)crc=crc&32768?((crc<<1)^4129)&65535:(crc<<1)&65535;
 }
 return crc.toString(16).toUpperCase().padStart(4,"0");
}
export function makeBeacon(id,nonce){
 if(!idPattern.test(id)||!noncePattern.test(nonce))throw new TypeError("Beacon needs 6 uppercase alphanumeric ID and 4 uppercase hex digits");
 const unsigned=VERSION+" "+id+" "+nonce;
 return unsigned+" "+check16(unsigned);
}
export function parseBeacon(text){
 if(typeof text!=="string")return {ok:false,reason:"INVALID_FRAME_SHAPE"};
 const match=/^MC1 ([A-Z0-9]{6}) ([0-9A-F]{4}) ([0-9A-F]{4})$/.exec(text);
 if(!match)return {ok:false,reason:"INVALID_FRAME_SHAPE"};
 if(check16(VERSION+" "+match[1]+" "+match[2])!==match[3])return {ok:false,reason:"CHECK_FAILED"};
 return {ok:true,sourceId:match[1],nonce:match[2],check:match[3],authenticated:false};
}
export function toMorseBits(text){
 if(typeof text!=="string"||!/^[A-Z0-9 ]+$/.test(text)||!text.trim()||/ {2,}/.test(text)||text.startsWith(" ")||text.endsWith(" "))throw new TypeError("Morse encoder accepts normalized uppercase alphanumerics");
 return text.split(" ").map(word=>[...word].map(ch=>ALPHABET[ch].split("").map(mark=>"1".repeat(mark==="."?1:3)).join("0")).join("000")).join("0000000");
}
export function fromMorseBits(bits){
 if(typeof bits!=="string"||!bits||!/^[01]+$/.test(bits)||bits[0]!=="1"||bits.at(-1)!=="1"||/0{8,}/.test(bits))throw new TypeError("Malformed keyed signal");
 return bits.split("0000000").map(word=>{
  if(!word)throw new TypeError("Empty Morse word");
  return word.split("000").map(letter=>{
   if(!letter||letter.includes("00"))throw new TypeError("Broken Morse letter");
   const marks=letter.split("0").map(pulse=>pulse.length===1?".":pulse.length===3?"-":null);
   if(marks.includes(null))throw new TypeError("Invalid pulse width");
   const decoded=REVERSE[marks.join("")];
   if(!decoded)throw new TypeError("Unknown Morse symbol");
   return decoded;
  }).join("");
 }).join(" ");
}
export function modelCone(offset,{overhead=false}={}){
 if(!Number.isInteger(offset)||offset< -100||offset>100||typeof overhead!=="boolean")throw new TypeError("Synthetic location offset out of range");
 // Conceptual A/N sectors, not an electromagnetic field simulation or navigation fix.
 if(overhead)return {a:0,n:0,state:"NO_OBSERVATION",meaning:"Fictional overhead gap. Non-observation is not physical silence."};
 const a=Math.round(Math.max(0,Math.min(100,50-offset)));
 const n=Math.round(Math.max(0,Math.min(100,50+offset)));
 return {a,n,state:Math.abs(offset)<=10?"OVERLAP":offset<0?"A_DOMINANT":"N_DOMINANT",
 meaning:"Arbitrary drawing weights, not power, signal strength, or antenna geometry."};
}
export function observeBeacon(frame,{channel="clear"}={}){
 if(!["clear","weak","collision","unreachable"].includes(channel))throw new TypeError("Unknown simulated channel");
 if(typeof frame!=="string"||frame.length>100)throw new TypeError("Invalid sample frame");
 const bits=toMorseBits(frame);
 const base={schema:"msyou.morse-cone-observation/v0",channel,mode:"SIMULATED_ONLY",
  reception:"NO_PROVEN_RF",provenance:"NONE",identityVerified:false,resourceGranted:false,
  execution:"NONE",publication:"NONE",next:"HOLD",sentBits:bits.length};
 if(channel==="unreachable")return {...base,outcome:"NOT_OBSERVED",receivedBits:0,decode:null,beacon:null};
 if(channel==="collision")return {...base,outcome:"AMBIGUOUS_COLLISION",receivedBits:bits.length,decode:null,beacon:null};
 const altered=channel==="weak"?bits.slice(0,1)+"0"+bits.slice(2):bits;
 // Altering the second bit intentionally damages a short initial pulse.
 try{
  const decoded=fromMorseBits(altered),parsed=parseBeacon(decoded);
  return {...base,outcome:parsed.ok?"DECODED_UNTRUSTED":"REJECTED",receivedBits:altered.length,decode:decoded,
   reason:parsed.ok?"IDENTITY_NOT_VERIFIED":parsed.reason,
   beacon:parsed.ok?{sourceId:parsed.sourceId,nonce:parsed.nonce,authenticated:false}:null};
 }catch{
  return {...base,outcome:"REJECTED",receivedBits:altered.length,decode:null,reason:"DAMAGED_SYMBOLS",beacon:null};
 }
}
export function lookupLocalCandidate(observation,localCatalog){
 if(!observation||observation.schema!=="msyou.morse-cone-observation/v0"||observation.outcome!=="DECODED_UNTRUSTED"||
    observation.next!=="HOLD"||observation.mode!=="SIMULATED_ONLY"||observation.resourceGranted!==false||
    observation.identityVerified!==false||!observation.beacon)return {state:"HOLD",reason:"NO_VALID_OBSERVATION"};
 if(!Array.isArray(localCatalog))return {state:"HOLD",reason:"NO_LOCAL_CATALOG"};
 const matching=localCatalog.filter(x=>x&&x.token===observation.beacon.sourceId);
 if(matching.length!==1)return {state:"HOLD",reason:"NO_UNIQUE_LOCAL_MATCH"};
 return {state:"LOOKUP_CANDIDATE_ONLY",reason:"LOCAL_LABEL_MATCH_IS_NOT_AUTHENTICATION",label:String(matching[0].label||"").slice(0,80),
  originAssurance:"NONE",execution:"NONE"};
}
