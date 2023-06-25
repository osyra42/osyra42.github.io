function recolor(y, i, c) {
  console.log("coloring " + y + " " + c);
  var z = document.querySelectorAll("details");
  z[i].querySelector("summary").style.backgroundColor = c;
  z[i].style.borderColor = c;

}


let x = document.querySelectorAll("details > summary > span:nth-child(5)");

var i;
var color;
for (i = 0; i < x.length; i++) {
  y = x[i].innerText;
  
  y == "project" ?
    c = "#DDDDDD":
    
  y == "Vanity [bot]" ?
    c = "#DD7034":
    
  y == "Discord" ?
    c = "#7289DA":

    
    c = "#888888";
  recolor(y, i, c);
}



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
