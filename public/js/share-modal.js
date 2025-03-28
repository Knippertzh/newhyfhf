// Share modal functionality
document.addEventListener('DOMContentLoaded', function() {
  // Wait for the DOM to be fully loaded
  setTimeout(() => {
    // Use querySelectorAll to get all share buttons
    const shareButtons = document.querySelectorAll('.share-button');
    
    if (shareButtons && shareButtons.length > 0) {
      // Add event listener to each share button
      shareButtons.forEach(button => {
        button.addEventListener('click', function() {
          // Open share modal logic would go here
          console.log('Share button clicked');
        });
      });
    } else {
      console.log('No share buttons found in the DOM');
    }
  }, 500);
});