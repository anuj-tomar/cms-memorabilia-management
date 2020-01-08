export function excelToList(data, isFirst = false) {
  if (!data.body || !data.body.length) {
    return isFirst ? {} : [];
  }
  let list = data.body.map(element => {
    let obj = {};
    data.head.forEach((h, i) => {
      obj[h] = element[i];
    });
    return obj;
  });
  return isFirst ? list[0] : list;
}

export function createComboList(data, key, value) {
  let obj = {};
  if (data.length && key && value) {
    data.forEach(element => {
      obj[element[key]] = element[value];
    });
  }
  return obj;
}

export function createMuliselectList(data, key, value,){
  let obj = [];
  if (data.length && key && value) {
    data.forEach(element => {
      obj = [...obj, {label: element[value] , value: element[key]}]
    });
  }
  return obj;
}

export function groupReservationType(data=[]){
   let r = {}; 
   if(data && data.length){
      data.forEach(item =>{
        r[item.groupName] = r[item.groupName] ? r[item.groupName] : [];
        r[item.groupName] = [...r[item.groupName], item];
      })
   }
   return r;
}

const COLOR = ['#B0E0E6', '#00ADEF', '#FF732C', '#CAC636', '#3CCB55']

export function formatReservationData(data, height=30, totalH=24) {
  let r = {};
  let rtype = [];
  let studios = {};
  let hh1 = height;
  let hm1 = hh1 / 60;
  let hs1 = hh1 / (60 * 60);
  data.forEach((room, j) => {
    rtype = [...rtype, room.id];
    studios[room.id] = room.type;
    r[room.id] = [];
    let color = COLOR[j];
    if(room.booking && room.booking.length){
      let lastend = { h: 8, m: 0, s: 0 };
      room.booking.forEach((item, i) => {
        let st = (item.startTime.split(' ')[1]).split(':');
        let et = (item.endTime.split(' ')[1]).split(':');
        let empty = {};
        if (parseInt(st[0]) > lastend.h || parseInt(st[1]) > lastend.m || parseInt(st[2]) > lastend.s) {
          empty.color = '#000';
          empty.st = `${lastend.h}:${lastend.m}:${lastend.s}`;
          empty.et = st.join(':');
          empty.isEmpty = true;
          empty.rtypeId = room.id;
          empty.height = ((parseInt(st[0]) - lastend.h) * hh1) + ((parseInt(st[1]) - lastend.m) * hm1) + ((parseInt(st[2]) - lastend.s) * hs1);
        }
        lastend = { h: parseInt(et[0]), m: parseInt(et[1]), s: parseInt(et[2]) };
        if (empty.isEmpty) {
          r[room.id]  = [...r[room.id] , empty];
        }
        item.color = color;
        item.st = st.join(':');
        item.et = et.join(':');
        item.isEmpty = false;
        item.height = ((lastend.h - parseInt(st[0])) * hh1) + ((lastend.m - parseInt(st[1])) * hm1) + ((lastend.s - parseInt(st[2])) * hs1);
        r[room.id]  = [...r[room.id] , item];
      });
      let empty = {};
      if (23 > lastend.h || 59 > lastend.m || 59 > lastend.s) {
        empty.color = '#000';
        empty.st = `${lastend.h}:${lastend.m}:${lastend.s}`;
        empty.et = "23:59:59";
        empty.isEmpty = true;
        empty.rtypeId = room.id;
        empty.height = ((23 - lastend.h) * hh1) + ((59 - lastend.m) * hm1) + ((59 - lastend.s) * hs1);
      }
      if (empty.isEmpty) {
        r[room.id] = [...r[room.id], empty];
      }
    }else{
      r[room.id] = [{
        color: '#000',
        isEmpty: true,
        rtypeId: room.id,
        st: '00:00',
        et: '24:00',
        height: hh1 * totalH
      }];
    }
  })
  return {graphData: r, rtype, rooms: studios};
}

export function replaceUpdateData(data, dataToReplace=[]){
  if(dataToReplace.length){
    dataToReplace.forEach((item, i)=>{
      data[item.key] = item.value;
    })
  }
  return data;
}

