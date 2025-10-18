document.addEventListener('DOMContentLoaded', function() {
    // Add the CSS styles dynamically
const style = document.createElement('style');
style.textContent = `
    .clutter {
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    body.show-clutter .clutter {
        opacity: 1;
    }
`;
document.head.appendChild(style);

// Add the click event listener
document.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'clutter-toggle') {
        document.body.classList.toggle('show-clutter');
        
        // Update button text
        const isHidden = document.body.classList.contains('show-clutter');
        e.target.textContent = isHidden ? 'Hide Clutter' : 'Show Clutter';
    }
});

    // Important dates functionality
    const importantDates = {
        '2026-01-04': 'premium host expiration',
        '2026-09-19': 'website domain renewal',
    };
    
    const today = new Date();
    
    Object.entries(importantDates).forEach(([date, event]) => {
        const expired = new Date(date);
        const remaining = Math.ceil((expired - today) / (1000 * 60 * 60 * 24));
        
        if (remaining < 0) {
            console.log('The day has passed!');
        } else {
            console.log(remaining + ' days remaining before ' + event);
        }
    });
});