$(document).ready(function() {
  const colours = {
    "Project": "#DDDDDD",
    "vanity_py": "#EC7D3C",
    "vanity_js": "#EC7D3C",
    "Discord": "#7289DA",
    "Logbook": "#888888",
    "Dashboard": "#B67A4F",
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


    let color = colours[project];
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

    $("#content").append(post);

    console.log((i + 1) + "/" + count + " " + project + " gets colored " + color)

  })

});
