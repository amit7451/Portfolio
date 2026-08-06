fetch('https://github.com/users/amit7451/contributions').then(res=>res.text()).then(t=>{
  const levels = [...t.matchAll(/data-level="(\d+)"/g)];
  console.log('levels', levels.length);
  const dates = [...t.matchAll(/data-date="([^"]+)"/g)];
  console.log('dates', dates.length);
});
