    // Function to dynamically create the navigation menu
    function createNavigationMenu() {
      const currentPath = window.location.pathname;
      const pathSegments = currentPath.split('/').filter(segment => segment !== '');

      const $navElement = $('<nav></nav>');

      // Add "Home" link with the URL "../home/index.html"
      const homePath = '../home/index.html';
      const $homeLink = $('<a></a>', {
        href: homePath,
        text: 'Home'
      });

      $navElement.append($homeLink);

      // Build the clickable links for each segment
      for (let i = 0; i < pathSegments.length; i++) {
        const segmentPath = `/${pathSegments.slice(0, i + 1).join('/')}`;
        const $linkElement = $('<a></a>', {
          href: segmentPath,
          text: pathSegments[i]
        });

        $navElement.append(' / ', $linkElement);
      }

      

      // Append the <nav> element to the <body> section of the document
      $('body').append($navElement);
    }

    // Call the function to create the navigation menu when the document is ready
    $(document).ready(function() {
      createNavigationMenu();
    });