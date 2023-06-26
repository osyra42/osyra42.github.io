PROJECT = "#DDDDDD";
VANITY = "#DD7034";
DISCORD = "#7289DA";
LOGBOOK = "#888888";
STARDRIVE = "#E5B723";
PCFIXIT = "#9A698C";

function recolor(y, i, c) {
  console.log("coloring " + y + " " + c);
  var z = document.querySelectorAll("details");
  z[i].querySelector("summary").style.backgroundColor = c;
  z[i].style.borderColor = c;

}

function loop() {
  let x = document.querySelectorAll("details > summary > span:nth-child(5)");

  var i;
  var color;
  for (i = 0; i < x.length; i++) {
    y = x[i].innerText;

    y == "Project" ? c = PROJECT :
      y == "Vanity" ? c = VANITY :
        y == "Discord" ? c = DISCORD :
          y == "Logbook" ? c = LOGBOOK :
            y == "Star Drive" ? c = STARDRIVE :
              y == "PC FIxIT" ? c = PCFIXIT:
                c = "#111111";
    recolor(y, i, c);
  }
}

loop();

`
<details>
  <summary>
    <span>{index}</span>
    <span>{timestamp}</span> |
    <span>{category}</span>
    <br><span>{project}</span>
  </summary>
  <pre>
{details}
  </pre>
</details>
`
