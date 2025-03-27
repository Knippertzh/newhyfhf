// Share modal functionality
document.addEventListener('DOMContentLoaded', function() {
  // Wait for the DOM to be fully loaded
  setTimeout(() => {
    const shareButton = document.querySelector('.share-button');
    
    // Add null check before adding event listener
    if (shareButton) {
      shareButton.addEventListener('click', function() {
        // Open share modal logic would go here
        console.log('Share button clicked');
      });
    }
  }, 100);
});