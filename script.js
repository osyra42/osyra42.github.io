const colours = {
  "Project": "#DDDDDD",
  "Vanity": "#DD7034",
  "Discord": "#7289DA",
  "Logbook": "#888888",
  "Star Drive": "#E5B723",
  "PC FIxIT": "#9A698C",
  "Quicklinks": "",
  "Youtube": "",
  "Book": ""
};

function recolor(y, i, c) {
  console.log("coloring " + y + " " + c);
  var z = document.querySelectorAll("details");
  z[i].querySelector("summary").style.backgroundColor = c;
  z[i].style.borderColor = c;

}

function loop() {
  let x = document.querySelectorAll("details > summary > span:nth-child(5)");

  var i;
  for (i = 0; i < x.length; i++) {
    y = x[i].innerText;
    c = colours[y] ?? "#111111";

    recolor(y, i, c);
  }
}

loop();


