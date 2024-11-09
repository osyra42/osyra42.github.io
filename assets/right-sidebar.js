document.getElementById("right-sidebar").innerHTML = `
<div>
  <div class="relative">
    <i class="fas fa-search"></i>
    <input type="text" id="search" placeholder="Search" autocomplete="off" />
  </div>
</div>

<h3>Project Links</h3>
<div class="project-links">
  <a href="index.html" class="nav-link"><i class="fas fa-home"></i>Home</a>
  <a href="my_books.html" class="nav-link"><i class="fas fa-book"></i>My Books</a>
  <a href="old/commissions.html" class="nav-link">X <i class="fas fa-shopping-cart"></i>Commissions</a>
  <a href="old/minecraft_server.html" class="nav-link"><i class="fas fa-server"></i>Minecraft Server</a>
  <a href="old/vanity_bot.html" class="nav-link">X <i class="fas fa-robot"></i>Vanity Bot</a>
  <a href="contact_me.html" class="nav-link"><i class="fa-solid fa-address-card"></i>Contact Me</a>
  <hr />
  <a href="backrooms/index.html" class="nav-link"><i class="fas fa-door-open"></i>Backrooms</a>
  <a href="bug_tracker.html" class="nav-link"><i class="fas fa-bug"></i>Bug Tracker</a>
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
