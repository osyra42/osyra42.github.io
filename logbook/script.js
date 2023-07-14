const colours = {
  "Project": "#DDDDDD",
  "Vanity": "#DD7034",
  "vanity_py": "#DD7034",
  "vanity_js": "#DD7034",
  "Discord": "#7289DA",
  "Logbook": "#888888",
  "Dashboard": "#F47FFF",
  "Star Drive": "#FFE417",
  "PC Repair": "#888888",
  "Quicklinks": "#7A958E",
  "Youtube": "#E31937",
  "Book": "#D6BB87"
};

$.each(database, function(i) {
  function quad(num) {
    let temp = "";
    if (num < 1000) {
      temp = "0"
    }
    if (num < 100) {
      temp = "00"
    }
    if (num < 10) {
      temp = "000"
    }
    return temp + num;
  }

  project = database[i].project;
  index = database[i].index;
  timestamp = database[i].timestamp;
  category = database[i].category;
  project = database[i].project;
  details = database[i].details;


  color = colours[project];
  index = quad(index);
  timestamp = new Date(timestamp).toDateString();
  let count = Object.keys(database).length;
  id = (count - i) - 1;
  id = quad(id);

  let post = `    
<details style="border-color:${color}">
  <summary id="${id}" style="background-color:${color}">
    <span>#${index}</span>
    <span>${timestamp}</span> |
    <span>${category}</span>
    <br><span>${project}</span>
  </summary>
  <pre>
${details}
  </pre>
</details>
`

  $(".center").append(post);

  console.log((i + 1) + "/" + count + " " + project + " gets colored " + color)

})



