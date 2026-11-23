const SPREADSHEET_ID = '1OUq9l88w42q0n0LSJ3eD_5PAbibHJ9lc_JTRodbK_5E';
const RECORD_HEADERS = ['기록ID','소유자ID','연도','이름','한글','영어','풀이','선택이유','작은실천','회고','공개','작성일','수정일'];
const PROFILE_HEADERS = ['소유자ID','이름','수정일'];
function doGet() { return output_({ok:true,service:'MY ONE WORD'}); }
function doPost(e) {
  let lock;
  try {
    const p=JSON.parse(e.postData.contents||'{}');
    const ownerToken=String(p.ownerToken||'');
    if(!/^[a-f0-9-]{72}$/.test(ownerToken))return output_({error:'기록 소유권을 확인할 수 없습니다.',status:403});
    const owner=Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,ownerToken,Utilities.Charset.UTF_8).map(b=>((b+256)%256).toString(16).padStart(2,'0')).join('');
    if(Math.abs(Date.now()-Number(p.timestamp))>300000)return output_({error:'요청 시간이 만료되었습니다.',status:403});
    lock=LockService.getScriptLock();lock.waitLock(20000);
    const db=SpreadsheetApp.openById(SPREADSHEET_ID),records=db.getSheetByName('기록'),profiles=db.getSheetByName('참여자');
    if(!records||!profiles)throw new Error('DB 시트가 없습니다.');
    const a=p.args||{},r=rows_(records,13),users=rows_(profiles,3),user=users.find(v=>String(v[0])===owner),now=new Date().toISOString();
    const names={};users.forEach(v=>names[String(v[0])]=String(v[1]));
    const supportSheet=db.getSheetByName('지지'),supports=supportSheet?rows_(supportSheet,4):[];
    function withSupport_(v,privateView){const item=record_(v,names,owner,privateView),matches=supports.filter(x=>String(x[2])===String(v[0]));item.id=String(v[0]);item.supportCount=matches.length;item.supported=matches.some(x=>String(x[1])===owner);return item;}
    if(p.action==='me')return output_({authenticated:true,profile:user?{nickname:String(user[1])}:null,records:r.filter(v=>String(v[1])===owner).map(v=>withSupport_(v,true))});
    if(p.action==='profile'){
      const nickname=text_(a.nickname,24,true),i=users.findIndex(v=>String(v[0])===owner),values=[[safe_(owner),safe_(nickname),now]];
      profiles.getRange(i<0?profiles.getLastRow()+1:i+2,1,1,3).setValues(values);
      r.forEach((v,j)=>{if(String(v[1])===owner)records.getRange(j+2,4).setValue(safe_(nickname));});
      return output_({profile:{nickname}});
    }
    if(p.action==='save'){
      if(!user)return output_({error:'이름 또는 별칭을 먼저 입력해 주세요.',status:400});
      const year=year_(a.year),word=a.word||{},ko=text_(word.ko,30,true),en=text_(word.en,80),meaning=text_(word.meaning,500),reason=text_(a.reason,2000),action=text_(a.action,300),reflection=text_(a.reflection,2000);
      if(typeof a.isShared!=='boolean')throw new Error('공개 설정을 확인해 주세요.');
      const id=owner+':'+year,i=r.findIndex(v=>String(v[0])===id),created=i<0?now:r[i][11];
      const values=[id,owner,year,String(user[1]),ko,en,meaning,reason,action,reflection,a.isShared?'공개':'비공개',created,now].map(safe_);
      records.getRange(i<0?records.getLastRow()+1:i+2,1,1,13).setValues([values]);
      return output_({ok:true});
    }
    if(p.action==='delete'){
      const year=year_(a.year),i=r.findIndex(v=>String(v[1])===owner&&Number(v[2])===year);
      if(i>=0){const id=String(r[i][0]);records.deleteRow(i+2);if(supportSheet)for(let j=supports.length-1;j>=0;j--)if(String(supports[j][2])===id)supportSheet.deleteRow(j+2);}
      return output_({ok:true});
    }
    if(p.action==='support'){
      if(!user)return output_({error:'이름 또는 별칭을 먼저 입력해 주세요.',status:400});
      if(!supportSheet)throw new Error('지지 저장소를 연결하는 중입니다.');
      const id=text_(a.recordId,80,true),target=r.find(v=>String(v[0])===id&&v[10]==='공개');
      if(!target)return output_({error:'나눈 기록을 찾을 수 없습니다.',status:404});
      if(String(target[1])===owner)return output_({error:'내 기록에는 하트를 누를 수 없어요.',status:400});
      if(typeof a.supported!=='boolean')throw new Error('지지 상태를 확인해 주세요.');
      const mine=supports.map((v,i)=>({v,i})).filter(x=>String(x.v[1])===owner&&String(x.v[2])===id);
      if(a.supported&&mine.length===0)supportSheet.getRange(supportSheet.getLastRow()+1,1,1,4).setValues([[owner+':'+id,owner,id,now]]);
      if(!a.supported)for(let j=mine.length-1;j>=0;j--)supportSheet.deleteRow(mine[j].i+2);
      const current=rows_(supportSheet,4).filter(v=>String(v[2])===id);
      return output_({recordId:id,supportCount:current.length,supported:current.some(v=>String(v[1])===owner)});
    }
    if(p.action==='list'){
      const year=a.year?year_(a.year):null,q=text_(a.q,80).toLocaleLowerCase(),page=Math.floor(Math.max(0,Math.min(Number(a.page)||0,10000)));
      const filtered=r.filter(v=>v[10]==='공개'&&(!year||Number(v[2])===year)&&(!q||(names[String(v[1])]||'').toLocaleLowerCase().includes(q)||String(v[4]).toLocaleLowerCase().includes(q))).sort((a,b)=>String(b[12]).localeCompare(String(a[12]))||String(a[0]).localeCompare(String(b[0])));
      return output_({records:filtered.slice(page*24,page*24+24).map(v=>withSupport_(v,false)),hasMore:filtered.length>(page+1)*24});
    }
    if(p.action==='words'){
      const sheet=db.getSheetByName('단어목록');if(!sheet)throw new Error('단어목록 시트가 없습니다.');
      const seen=new Set();const words=rows_(sheet,3).filter(v=>String(v[0]).trim()).map(v=>({ko:text_(String(v[0]),30,true),en:text_(String(v[1]||''),80),meaning:text_(String(v[2]||''),500)})).filter(v=>{if(seen.has(v.ko))return false;seen.add(v.ko);return true});
      return output_({words});
    }
    return output_({error:'요청을 찾을 수 없습니다.',status:404});
  } catch(err) { return output_({error:String(err.message||'요청을 완료하지 못했습니다.'),status:400}); }
  finally { if(lock)lock.releaseLock(); }
}
function rows_(sheet,width){const n=sheet.getLastRow()-1;if(n<=0)return [];if(n>20000)throw new Error('기록이 많아 저장소 점검이 필요합니다.');return sheet.getRange(2,1,n,width).getValues();}
function record_(v,names,owner,privateView){const result={year:Number(v[2]),nickname:names[String(v[1])]||String(v[3]),word:{ko:String(v[4]),en:String(v[5]),meaning:String(v[6])},reason:String(v[7]),action:String(v[8]),isShared:v[10]==='공개',updatedAt:String(v[12]),isMine:String(v[1])===owner};if(privateView)result.reflection=String(v[9]);return result;}
function year_(v){const n=Number(v);if(n!==2026&&n!==2027)throw new Error('연도를 확인해 주세요.');return n;}
function text_(v,max,required){if(v===undefined||v===null)v='';if(typeof v!=='string')throw new Error('입력 내용을 확인해 주세요.');const s=v.trim();if((required&&!s)||s.length>max)throw new Error('입력 길이를 확인해 주세요.');return s;}
function safe_(v){return typeof v==='string'&&/^[=+\-@]/.test(v)?"'"+v:v;}
function output_(v){return ContentService.createTextOutput(JSON.stringify(v)).setMimeType(ContentService.MimeType.JSON);}
