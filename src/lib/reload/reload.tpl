(function() {
  // js 1.0
  window.location.href = window.location.pathname + window.location.search + window.location.hash;
  // creates a history entry

  // js 1.1
  window.location.replace(window.location.pathname + window.location.search + window.location.hash);
  // does not create a history entry

  // js 1.2 (latest)
  window.location.reload(true); 
  // If we needed to pull the document from
  //  the web-server again (such as where the document contents
  //  change dynamically) we would pass the argument as 'true'.
})();
