const colours = {
  "Project": "#DDDDDD",
  "Vanity": "#DD7034",
  "Discord": "#7289DA",
  "Logbook": "#888888",
  "Star Drive": "#FFE417",
  "PC FIxIT": "#9A698C",
  "Quicklinks": "#7A958E",
  "Youtube": "#E31937",
  "Book": "#D6BB87"
};

function loop() {
  let x = $("details>summary>span:nth-child(5)");
  $(x).each(function(index) {
    color = colours[$(this).text()];
    $(this).closest("details")
      .css("border-color", color);
    
    $(this).parent()
      .css("background", color);
    
    console.log(index + " " + 
      $(this).text() + 
      " gets colored " + color);
  })
}

function setpost() {
 // const obj = JSON.parse(database);
}

//setpost();
loop();


