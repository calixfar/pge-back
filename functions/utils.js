exports.filterObjByProperty = (obj, property, value) => {
  const keys = Object.keys(obj);
  // console.log('keys', keys);
  let temp = {};
  for( let key of keys ) {
    // console.log('initial',key, obj[key]);
    if( obj[key][property] !== value ) temp[key] = obj[key];
    // if( obj[key].socketId === socketId ) delete obj[key];
    // console.log('end',key, obj[key]);
  }
  return temp;
}
exports.findObjByProperty = (obj, property, value) => {
  const keys = Object.keys(obj);
  // console.log('keys', keys);
  let temp = {};
  for( let key of keys ) {
    // console.log('initial',key, obj[key]);
    if( obj[key][property] === value ) {
      temp = obj[key];
      break;
    }
    // if( obj[key].socketId === socketId ) delete obj[key];
    // console.log('end',key, obj[key]);
  }
  return temp;
}
