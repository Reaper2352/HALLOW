(function(){
  function rank(s){
    if(!s) return 0;
    var n = 0;
    n += Math.min(4, s.streak|0);
    n += Math.min(3, s.houseWins|0);
    n += Math.min(2, Math.floor((s.holds|0)/2));
    if(s.sophie) n += 1;
    return Math.max(0, Math.min(10, n));
  }
  var titles = ["UNLISTED","NOTICED","LOGGED","HELD","EXTRACTED","SEAL CRACKED","HABIT","WIRE-TRAINED","CAMPAIGN","HANDLER","ENGINEER"];
  function paint(){
    var raw = localStorage.getItem("hallow.night.v2");
    var s = {};
    try { s = JSON.parse(raw||"{}"); } catch(e){}
    var r = rank(s);
    var chip = document.getElementById("leonaChip");
    if(!chip){
      chip = document.createElement("div");
      chip.id = "leonaChip";
      chip.style.cssText = "position:fixed;right:16px;bottom:56px;z-index:15;font-family:IBM Plex Mono,monospace;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:#d4a0b0;border:1px solid rgba(212,160,176,.35);background:#0a0a0b;padding:8px 10px;";
      document.body.appendChild(chip);
    }
    chip.textContent = "Leona " + r + "/10 · " + titles[r];
  }
  setInterval(paint, 1000);
  paint();
})();
