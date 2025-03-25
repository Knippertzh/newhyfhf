// Script to add Prof. Dr. med. Alena Michaela Buyx to MongoDB using the API endpoint
import fetch from 'node-fetch';

async function main() {
  try {
    // First, we would need to create a user and get the userId
    // For this example, we'll assume a user with ID already exists
    // In a real scenario, you would first create the user via an API
    // and then use the returned userId
    
    // For demonstration purposes, we'll use a placeholder userId
    // This should be replaced with a real MongoDB ObjectId
    const userId = '65f5e8c0e5c57e9b4c3a1d2f'; // Replace with actual userId
    
    // Expert data for Prof. Dr. med. Alena Michaela Buyx
    const expertData = {
      userId: userId,
      title: 'Prof. Dr. med.',
      company: 'Technical University of Munich',
      website: 'https://www.professoren.tum.de/buyx-alena',
      linkedin: 'alena-buyx-bab4276',
      twitter: null,
      bio: "Prof. Dr. med. Alena Michaela Buyx is a medical ethicist with a background in medicine, philosophy, and sociology. She currently serves as a professor at the Technical University of Munich and has previously been a visiting scholar at Harvard Medical School. Her main research areas include justice in healthcare, ethics of organ donation and transplantation, ethical issues in wish-fulfilling medicine and enhancement, and the theory of teaching medical ethics.",
      specializations: [
        'Medical Ethics',
        'Bioethics',
        'AI Ethics',
        'Healthcare Ethics'
      ],
      education: [
        { degree: 'Dr. med.; M.A.', institution: 'University of Münster', year: '2005' },
        { degree: 'Medicine (Neurology)', institution: 'UCL', year: '2004' },
        { degree: 'Philosophy, health sciences', institution: 'University of York', year: '2002' }
      ],
      publications: [
        { title: 'Ethics and governance of artificial intelligence for health', venue: 'WHO', year: '2021' },
        { title: 'Patient and public involvement: how much do we need and how much can we afford?', venue: 'Journal of Medical Ethics', year: '2020' },
        { title: 'Medical ethics during a pandemic', venue: 'Bundesgesundheitsblatt', year: '2020' }
      ],
      projects: [
        { name: 'Ethics of AI in Medicine', description: 'Research on ethical implications of AI applications in healthcare' },
        { name: 'German Ethics Council', description: 'Chair of the German Ethics Council advising on bioethical issues' }
      ]
    };
    
    // Make a POST request to the experts API endpoint
    const response = await fetch('http://localhost:3000/api/experts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expertData),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('Successfully added Prof. Dr. med. Alena Michaela Buyx to the database');
      console.log('Expert data:', data);
    } else {
      console.error('Failed to add expert:', data.error);
    }
  } catch (error) {
    console.error('Error adding Prof. Dr. med. Alena Michaela Buyx to the database:', error);
    // Log more detailed error information
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
  }
}

main();