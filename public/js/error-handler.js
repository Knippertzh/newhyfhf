// Custom error handler for Next.js resource loading issues
document.addEventListener('DOMContentLoaded', function() {
  // Create a custom error handler for resource loading errors
  window.addEventListener('error', function(event) {
    // Check if this is a resource loading error
    if (event.target && (event.target.tagName === 'SCRIPT' || event.target.tagName === 'LINK' || event.target.tagName === 'IMG')) {
      const url = event.target.src || event.target.href;
      
      // Check if this is a Next.js chunk
      if (url && url.includes('/_next/')) {
        console.error(`Failed to load Next.js resource: ${url}`);
        console.info('This might be caused by a build issue or incorrect file paths.');
        
        // Log helpful information for debugging
        console.info('Suggested fixes:');
        console.info('1. Try rebuilding the application with "npm run build"');
        console.info('2. Clear browser cache and reload');
        console.info('3. Check for any path issues in next.config.mjs');
      }
      
      // Check if this is an S3 resource
      if (url && url.includes('s3.us-east-1.amazonaws.com')) {
        console.error(`Failed to load S3 resource: ${url}`);
        console.info('This might be caused by CORS or permission issues with the S3 bucket.');
      }
    }
  }, true);
  
  // Log a message to confirm the error handler is loaded
  console.info('Next.js error handler initialized');
});