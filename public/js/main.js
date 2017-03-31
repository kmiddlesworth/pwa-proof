if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js').catch(function(err){
  	console.log(err);
  });
}