/**
 * Expert Template Schema
 * 
 * This file defines the standardized template for expert data in the AI Expert Database.
 * It combines elements from various existing schemas to ensure consistency across
 * the application and database.
 */

/**
 * Standard Expert Template
 * This template should be used for all new experts added to the database.
 */
const expertTemplate = {
  // Unique identifier for the expert
  id: "exp-firstname-lastname", // Format: exp-firstname-lastname or custom ID
  
  // Personal Information
  personalInfo: {
    title: null, // Academic or professional title (Dr., Prof., etc.)
    firstName: "", // First name
    lastName: "", // Last name
    fullName: "", // Full name including title
    image: "/placeholder/expert-placeholder.jpg", // Path to profile image
    email: null, // Email address
    phone: null, // Phone number
    languages: ["Deutsch", "Englisch"], // Languages spoken
    address: null, // Physical address (optional)
    dateOfBirth: null, // Date of birth (optional)
    nationality: null, // Nationality (optional)
    location: null // Geographic location (optional)
  },
  
  // Institutional Affiliation
  institution: {
    name: null, // Company or organization name
    position: "", // Job title or position
    department: null, // Department within the organization
    website: null // Organization website
  },
  
  // Areas of Expertise
  expertise: {
    primary: [], // Primary fields of expertise
    secondary: [], // Secondary fields of expertise
    industries: [] // Industry sectors
  },
  
  // Academic Metrics
  academicMetrics: {
    publications: {
      total: null, // Total number of publications
      sources: {
        googleScholar: null, // Google Scholar profile
        scopus: null // Scopus profile
      }
    }
  },
  
  // Current Role Information
  currentRole: {
    title: "", // Current job title
    organization: null, // Current organization
    focus: "" // Main focus area
  },
  
  // Online Profiles
  profiles: {
    linkedin: null, // LinkedIn profile URL
    company: null, // Company website
    twitter: null, // Twitter/X profile
    other: null // Other relevant links
  },
  
  // Biographical Information
  bio: "", // Short biography or description
  
  // Education History
  education: [
    // {
    //   degree: "Ph.D.", // Degree obtained
    //   institution: "University Name", // Educational institution
    //   year: "2015", // Year of completion
    //   fieldOfStudy: "Computer Science" // Field of study
    // }
  ],
  
  // Publications
  publications: [
    // {
    //   title: "Publication Title", // Title of publication
    //   venue: "Journal/Conference Name", // Publication venue
    //   year: "2020" // Year of publication
    // }
  ],
  
  // Projects
  projects: [
    // {
    //   name: "Project Name", // Name of project
    //   description: "Project Description" // Description of project
    // }
  ],
  
  // References
  references: [
    // {
    //   name: "Reference Name", // Name of reference
    //   link: null // Link to reference
    // }
  ],
  
  // Additional Information
  priorCompany: null, // Previous company or organization
  comments: null, // Additional comments or notes
  
  // Searchable Tags
  tags: [], // Keywords for search functionality
  
  // Metadata
  createdAt: new Date(), // Creation timestamp
  updatedAt: new Date() // Last update timestamp
};

/**
 * Function to create a new expert object with the standard template
 * @param {Object} expertData - Initial expert data to populate the template
 * @returns {Object} - A new expert object based on the template
 */
function createExpertFromTemplate(expertData = {}) {
  // Create a deep copy of the template
  const newExpert = JSON.parse(JSON.stringify(expertTemplate));
  
  // Set creation and update timestamps
  newExpert.createdAt = new Date();
  newExpert.updatedAt = new Date();
  
  // Merge provided data with the template
  return mergeExpertData(newExpert, expertData);
}

/**
 * Function to merge expert data with the template
 * @param {Object} template - The expert template
 * @param {Object} data - The expert data to merge
 * @returns {Object} - The merged expert object
 */
function mergeExpertData(template, data) {
  // Helper function to merge nested objects
  function mergeObjects(target, source) {
    for (const key in source) {
      if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        // Create target key if it doesn't exist
        if (!target[key]) target[key] = {};
        // Recursively merge nested objects
        mergeObjects(target[key], source[key]);
      } else if (source[key] !== undefined) {
        // Copy non-object values
        target[key] = source[key];
      }
    }
    return target;
  }
  
  // Create a copy of the template
  const result = JSON.parse(JSON.stringify(template));
  
  // Merge the data with the template
  return mergeObjects(result, data);
}

/**
 * Function to normalize expert data from various sources to match our schema
 * @param {Object} expertData - The expert data to normalize
 * @returns {Object} - The normalized expert object
 */
function normalizeExpertData(expertData) {
  // Create a new expert from template
  const normalizedExpert = createExpertFromTemplate();
  
  // Handle different possible structures
  
  // Case 1: Data already follows our schema with personalInfo
  if (expertData.personalInfo) {
    mergeExpertData(normalizedExpert, expertData);
    return normalizedExpert;
  }
  
  // Case 2: Flat structure with direct properties (from daten.json)
  if (expertData.Vorname || expertData.Nachname) {
    // Handle personal information
    normalizedExpert.personalInfo = {
      title: expertData.Titel || null,
      firstName: expertData.Vorname || '',
      lastName: expertData.Nachname || '',
      fullName: `${expertData.Titel ? expertData.Titel + ' ' : ''}${expertData.Vorname || ''} ${expertData.Nachname || ''}`.trim(),
      email: expertData.Email || null,
      phone: expertData.Tel || null,
      // Generate a placeholder image path based on name
      image: `/experts/${(expertData.Vorname || '').toLowerCase()}-${(expertData.Nachname || '').toLowerCase()}.jpg`,
      languages: ['Deutsch'] // Assuming German as default language
    };
    
    // Handle institution data
    normalizedExpert.institution = {
      name: expertData.Company || '',
      position: expertData["Job Title"] || '',
      department: null,
      website: expertData["Homepage Link"] || null
    };
    
    // Handle expertise data
    const primaryExpertise = [];
    if (expertData["Field of Activity"]) {
      // Split by comma if multiple fields are provided
      const fields = expertData["Field of Activity"].split(',').map(field => field.trim());
      primaryExpertise.push(...fields);
    }
    
    normalizedExpert.expertise = {
      primary: primaryExpertise,
      secondary: [],
      industries: []
    };
    
    // Handle profiles/links
    normalizedExpert.profiles = {
      linkedin: expertData["LinkedIn Link"] || null,
      company: expertData["Homepage Link"] || null
    };
    
    // Add other links if available
    if (expertData["Other Links"]) {
      normalizedExpert.profiles.other = expertData["Other Links"];
    }
    
    // Add tags for better searchability
    normalizedExpert.tags = [...primaryExpertise];
    
    // Add company name as tag if available
    if (expertData.Company) {
      normalizedExpert.tags.push(expertData.Company);
    }
    
    // Add job title as tag if available
    if (expertData["Job Title"]) {
      normalizedExpert.tags.push(expertData["Job Title"]);
    }
    
    // Add comments if available
    if (expertData.Kommentar) {
      normalizedExpert.comments = expertData.Kommentar;
    }
    
    // Add prior company if available
    if (expertData["Prior Company"]) {
      normalizedExpert.priorCompany = expertData["Prior Company"];
    }
    
    // Add reference if available
    if (expertData["Referenz 1"]) {
      normalizedExpert.references = [{
        name: expertData["Referenz 1"],
        link: expertData["Referenz 1 Link"] || null
      }];
    }
    
    // Add address if available
    if (expertData.Adresse) {
      normalizedExpert.personalInfo.address = expertData.Adresse;
    }
    
    // Generate an ID based on name (for consistency with existing experts)
    const firstName = (expertData.Vorname || '').toLowerCase().replace(/\s+/g, '-');
    const lastName = (expertData.Nachname || '').toLowerCase().replace(/\s+/g, '-');
    normalizedExpert.id = `exp-${firstName}-${lastName}`;
    
    return normalizedExpert;
  }
  
  // Case 3: Simple structure with name, title, company (from frontend form)
  if (expertData.name) {
    // Try to extract first and last name
    const nameParts = expertData.name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    normalizedExpert.personalInfo = {
      firstName,
      lastName,
      fullName: expertData.name,
      title: expertData.title || null,
      email: expertData.email || null,
      image: expertData.imageUrl || `/placeholder/expert-placeholder.jpg`
    };
    
    normalizedExpert.institution = {
      name: expertData.company || null,
      position: expertData.title || null
    };
    
    if (expertData.expertise) {
      // Split expertise by comma if it's a string
      const expertiseArray = typeof expertData.expertise === 'string' 
        ? expertData.expertise.split(',').map(e => e.trim())
        : Array.isArray(expertData.expertise) ? expertData.expertise : [];
      
      normalizedExpert.expertise.primary = expertiseArray;
      normalizedExpert.tags = [...expertiseArray];
    }
    
    if (expertData.bio) {
      normalizedExpert.bio = expertData.bio;
    }
    
    if (expertData.website) {
      normalizedExpert.profiles.company = expertData.website;
    }
    
    if (expertData.linkedin) {
      normalizedExpert.profiles.linkedin = expertData.linkedin;
    }
    
    if (expertData.twitter) {
      normalizedExpert.profiles.twitter = expertData.twitter;
    }
    
    // Generate an ID based on name
    const firstNameSlug = firstName.toLowerCase().replace(/\s+/g, '-');
    const lastNameSlug = lastName.toLowerCase().replace(/\s+/g, '-');
    normalizedExpert.id = `exp-${firstNameSlug}-${lastNameSlug}`;
    
    return normalizedExpert;
  }
  
  return normalizedExpert;
}

module.exports = {
  expertTemplate,
  createExpertFromTemplate,
  mergeExpertData,
  normalizeExpertData
};