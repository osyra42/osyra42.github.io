Project = "#DDDDDD";
Vanity  = "#DD7034";
Discord = "#7289DA";
Logbook = "#888888";

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
    
    y == "Project" ? c = Project:
    y == "Vanity"  ? c = Vanity:
    y == "Discord" ? c = Discord:
    y == "Logbook" ? c = Logbook:
                     c = "#000000";
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
