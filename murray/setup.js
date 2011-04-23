
if(process.argv[2] != undefined){
  process.argv.forEach(function(val,index,array){
    console.log(index + ':' + val);
  });
} else {
  console.log('no arguments');
}