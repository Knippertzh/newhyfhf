/**
 * Utility functions for handling company logos
 */

/**
 * Generates a logo URL for a company based on its website or name
 * Includes proper domain extraction and validation
 * 
 * @param website The company website URL (optional)
 * @param name The company name (used as fallback if website is not provided)
 * @param logoUrl A direct logo URL if already available (highest priority)
 * @returns The best available logo URL
 */
export function generateLogoUrl(website?: string, name?: string, logoUrl?: string): string {
  // If a direct logo URL is provided, use it
  if (logoUrl) return logoUrl;
  
  // If no website is provided, generate a fallback URL based on company name
  if (!website && name) {
    // This is just for generating a domain for Clearbit lookup
    const fallbackDomain = name.toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9]/g, "");
    return `https://logo.clearbit.com/${fallbackDomain}.com`;
  }
  
  // Clean the domain for Clearbit API (remove protocol and path)
  const cleanDomain = website ? website.replace(/^https?:\/\//, "").replace(/\/.*$/, "") : "";
  
  // Return the Clearbit logo URL
  return `https://logo.clearbit.com/${cleanDomain}`;
}

/**
 * Checks if a URL is valid
 * 
 * @param url The URL to validate
 * @returns True if the URL is valid, false otherwise
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Gets the placeholder logo URL with optional size parameters
 * 
 * @param width Optional width for the placeholder
 * @param height Optional height for the placeholder
 * @returns The placeholder logo URL
 */
export function getPlaceholderLogo(width?: number, height?: number): string {
  if (width && height) {
    return `/placeholder-logo.svg?height=${height}&width=${width}`;
  }
  return "/placeholder-logo.svg";
}