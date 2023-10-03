const container = document.getElementById("container");
const counterCount = 10;

// Generate the colors
const colors = colorMake(counterCount);

for (let i = 0; i < counterCount; i++) {
  // Create a new div element using template literals
  const div = document.createElement("div");
  
  // Set the background color based on the colors array
  div.style.backgroundColor = colors[i];

  div.innerHTML = `
    <input type="number" id="num${i}" value="0" onchange="saveToLocalStorage('num${i}')">
    <button class="plus" onclick="incrementNumber('num${i}')">+</button>
    <button class="minus" onclick="decrementNumber('num${i}')">&ndash;</button>
    <input type="text" value="Number ${i}" id="text${i}" onchange="saveToLocalStorage('text${i}')">
  `;

  // Append the div to the container
  container.appendChild(div);
}

var pieChart; // Declare pieChart globally

function colorMake(x) {
  var hueIncrement = 360 / x;
  var colors = [];

  for (var i = 0; i < x; i++) {
    var hue = i * hueIncrement;
    var hslColor = "hsl(" + hue + ", 80%, 50%)";
    colors.push(hslColor);
  }
  return colors;
}

function updatePieChart(data, labels) {
  if (pieChart) {
    pieChart.data.labels = labels;
    pieChart.data.datasets[0].data = data;
    pieChart.data.datasets[0].backgroundColor = colorMake(data.length);
    pieChart.update();
  } else {
    var ctx = document.getElementById('pieChart').getContext('2d');
    pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colorMake(data.length),
        }],
      },
      options: {
        plugins: {
          legend: {
            display: true,
            position: 'left',
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                var label = context.label || '';
                var value = context.formattedValue;
                var total = context.dataset.data.reduce(function (accumulator, currentValue) {
                  return accumulator + currentValue;
                });
                var percentage = total > 0 ? ((context.parsed / total) * 100).toFixed(2) + '%' : '0%';
                return label + ': ' + value + ' (' + percentage + ')';
              },
            },
          },
        },
      },
    });
  }
}

// Rest of your code...


function saveToLocalStorage(id) {
  var inputValue = document.getElementById(id).value;
  localStorage.setItem(id, inputValue);
  updateTotal();
}

function loadFromLocalStorage() {
  for (var i = 0; i <= 9; i++) {
    var numId = 'num' + i;
    var textId = 'text' + i;
    var savedNum = localStorage.getItem(numId);
    var savedText = localStorage.getItem(textId);
    if (savedNum !== null) {
      document.getElementById(numId).value = savedNum;
    }
    if (savedText !== null) {
      document.getElementById(textId).value = savedText;
    }
  }
  updateTotal();
}

function updateTotal() {
  var totalElement = document.getElementById('total');
  var totalValue = 0;

  var data = [];
  var labels = [];

  for (var i = 0; i <= 9; i++) {
    var numInput = document.getElementById('num' + i);
    var numValue = parseInt(numInput.value);

    totalValue += numValue;
    data.push(numValue);

    var textInput = document.getElementById('text' + i);
    var labelText = textInput.value;
    labels.push(labelText);
  }

  totalElement.textContent = totalValue;
  updatePieChart(data, labels);
}

function incrementNumber(id) {
  var numberInput = document.getElementById(id);
  var currentValue = parseInt(numberInput.value);
  currentValue++;
  numberInput.value = currentValue;
  saveToLocalStorage(id);
  updateTotal();
}

function decrementNumber(id) {
  var numberInput = document.getElementById(id);
  var currentValue = parseInt(numberInput.value);
  if (currentValue > 0) {
    currentValue--;
    numberInput.value = currentValue;
    saveToLocalStorage(id);
    updateTotal();
  }
}

// Load saved values from localStorage when the page loads
window.onload = loadFromLocalStorage;