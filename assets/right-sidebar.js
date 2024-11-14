document.getElementById("right-sidebar").innerHTML = `
<div>
  <div class="relative">
    <i class="fas fa-search"></i>
    <input type="text" id="search" placeholder="Search" autocomplete="off" />
  </div>
</div>

<h3>Project Links</h3>
<div class="project-links">
  <a title="Click to return to the home page" href="index.html" class="nav-link"><i class="fas fa-home"></i>Home</a>
  <a title="Click to the page with my books" href="my_books.html" class="nav-link"
    ><i class="fas fa-book"></i>My Books</a
  >

  <a title="Click to view information about the Minecraft server" href="minecraft.html" class="nav-link"
    ><i class="fas fa-server"></i>Minecraft Server</a
  >
  <a title="Click to view information about the Vanity" href="vanity.html" class="nav-link"
    ><i class="fas fa-robot"></i>Vanity Bot</a
  >
  <a title="Click to submit a commission request" href="old/commissions.html" class="nav-link"
    >X <i class="fas fa-shopping-cart"></i>Commissions</a
  >
  <a title="Click to contact me or view basic information about me" href="about_me.html" class="nav-link"
    ><i class="fa-solid fa-address-card"></i>About Me</a
  >

  <a title="Click to view bugs or submit a bug report" href="bug_tracker.html" class="nav-link"
    ><i class="fas fa-bug"></i>Bug Tracker</a
  >
  <hr />
  <a title="Click to view notes on new project ideas" href="backrooms/index.html" class="nav-link"
    ><i class="fas fa-door-open"></i>Backrooms</a
  >
</div>

<div class="pth">
  <div>
    <hr />
    <a href="privacy.html" class="nav-link pth-link"><i class="fas fa-shield-alt"></i> Privacy</a> |
    <a href="terms.html" class="nav-link pth-link"><i class="fas fa-gavel"></i> Terms</a> |
    <a href="help.html" class="nav-link pth-link"><i class="fas fa-question-circle"></i> Help</a>
  </div>
</div>
`;