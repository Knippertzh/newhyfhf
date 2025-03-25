// Script to add real German AI companies to MongoDB
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

// MongoDB connection URI from environment variable
const uri = process.env.DISHBRAIN_MONGODB_URI || process.env.DATABASE_URL;

if (!uri) {
  console.error('Please define the DISHBRAIN_MONGODB_URI or DATABASE_URL environment variable in .env');
  process.exit(1);
}

// Real German AI company data
const germanAICompanies = [
  {
    name: 'DeepL',
    description: 'DeepL is a German AI company that develops neural machine translation systems. Their translation service is known for its accuracy and natural-sounding translations, often outperforming competitors like Google Translate.',
    industry: 'Natural Language Processing',
    location: 'Cologne, Germany',
    foundedYear: 2017,
    website: 'deepl.com',
    email: 'info@deepl.com',
    employees: '400+',
    specializations: ['Machine Translation', 'Natural Language Processing', 'Neural Networks'],
    keyAchievements: [
      'Developed one of the world\'s most accurate translation systems',
      'Expanded to support over 29 languages',
      'Created DeepL Pro for business applications'
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Celonis',
    description: 'Celonis is a German tech unicorn that uses AI-powered process mining to help companies analyze and improve their business processes. Their Execution Management System (EMS) combines process mining with AI to identify and fix inefficiencies.',
    industry: 'Process Mining & Analytics',
    location: 'Munich, Germany',
    foundedYear: 2011,
    website: 'celonis.com',
    email: 'info@celonis.com',
    employees: '3000+',
    specializations: ['Process Mining', 'Business Intelligence', 'Machine Learning', 'Automation'],
    keyAchievements: [
      'Reached unicorn status with over $1 billion valuation',
      'Developed the Execution Management System (EMS)',
      'Partnered with major global enterprises including Siemens, Uber, and Vodafone'
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Ada Health',
    description: 'Ada Health is a Berlin-based AI health company that developed a symptom assessment and care navigation platform. Their AI-powered app helps users understand their health symptoms and directs them to appropriate care.',
    industry: 'Healthcare AI',
    location: 'Berlin, Germany',
    foundedYear: 2011,
    website: 'ada.com',
    email: 'info@ada.com',
    employees: '300+',
    specializations: ['Medical AI', 'Symptom Assessment', 'Healthcare Technology', 'Machine Learning'],
    keyAchievements: [
      'Developed one of the world\'s most accurate medical AI systems',
      'Reached over 12 million users globally',
      'Partnered with health systems and insurers worldwide'
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Twenty Billion Neurons',
    description: 'Twenty Billion Neurons (TwentyBN) is a German AI company focused on computer vision and human-computer interaction. They develop AI systems that can understand human behavior and interact naturally with people.',
    industry: 'Computer Vision',
    location: 'Berlin, Germany',
    foundedYear: 2015,
    website: 'twentybn.com',
    email: 'info@twentybn.com',
    employees: '50+',
    specializations: ['Computer Vision', 'Human-Computer Interaction', 'Deep Learning'],
    keyAchievements: [
      'Created Fitness Ally, an AI-powered fitness coach',
      'Developed large-scale datasets for human action recognition',
      'Acquired by Snap Inc. in 2021'
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Merantix',
    description: 'Merantix is a Berlin-based AI venture studio that builds, scales, and invests in AI companies. They focus on applying AI to solve complex problems across various industries including healthcare, automotive, and manufacturing.',
    industry: 'AI Venture Studio',
    location: 'Berlin, Germany',
    foundedYear: 2016,
    website: 'merantix.com',
    email: 'info@merantix.com',
    employees: '100+',
    specializations: ['Healthcare AI', 'Computer Vision', 'Machine Learning', 'Venture Building'],
    keyAchievements: [
      'Built and scaled multiple successful AI companies',
      'Developed Vara, an AI system for breast cancer screening',
      'Created the Merantix AI Campus in Berlin'
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Aleph Alpha',
    description: 'Aleph Alpha is a German AI research company focused on developing sovereign AI technology for Europe. They are building large multimodal AI models with a focus on transparency, explainability, and European values.',
    industry: 'AI Research',
    location: 'Heidelberg, Germany',
    foundedYear: 2019,
    website: 'aleph-alpha.com',
    email: 'info@aleph-alpha.com',
    employees: '100+',
    specializations: ['Large Language Models', 'Multimodal AI', 'Sovereign AI', 'Explainable AI'],
    keyAchievements: [
      'Developed Luminous, a European large language model',
      'Raised over €100 million in funding',
      'Partnered with European governments and enterprises'
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Konux',
    description: 'Konux is a Munich-based AI company that combines machine learning algorithms and IoT devices to improve railway operations. Their solutions help railway companies monitor infrastructure and predict maintenance needs.',
    industry: 'Industrial IoT & AI',
    location: 'Munich, Germany',
    foundedYear: 2014,
    website: 'konux.com',
    email: 'info@konux.com',
    employees: '150+',
    specializations: ['Predictive Maintenance', 'Industrial IoT', 'Machine Learning', 'Railway Technology'],
    keyAchievements: [
      'Developed AI-based predictive maintenance system for railways',
      'Partnered with Deutsche Bahn and other major railway operators',
      'Raised over $130 million in funding'
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Helsing',
    description: 'Helsing is a European defense technology company with a strong presence in Germany. They develop AI-powered systems for defense and national security applications, focusing on real-time data analysis and sensor fusion.',
    industry: 'Defense Technology',
    location: 'Munich, Germany',
    foundedYear: 2021,
    website: 'helsing.ai',
    email: 'info@helsing.ai',
    employees: '500+',
    specializations: ['Defense AI', 'Sensor Fusion', 'Computer Vision', 'Real-time Analytics'],
    keyAchievements: [
      'Raised €209 million in Series A funding',
      'Developed AI systems for European defense capabilities',
      'Partnered with European defense ministries'
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Mobius Labs',
    description: 'Mobius Labs is a Berlin-based computer vision company that develops AI technology for visual content analysis. Their technology allows for efficient tagging, searching, and analyzing of images and videos.',
    industry: 'Computer Vision',
    location: 'Berlin, Germany',
    foundedYear: 2018,
    website: 'mobiuslabs.com',
    email: 'info@mobiuslabs.com',
    employees: '30+',
    specializations: ['Computer Vision', 'Visual Content Analysis', 'Edge AI'],
    keyAchievements: [
      'Developed on-device computer vision technology',
      'Created customizable visual recognition systems',
      'Partnered with media companies and content creators'
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Nyris',
    description: 'Nyris is a Berlin-based visual search and image recognition company. Their AI technology can identify objects in images with high precision, enabling visual search applications for e-commerce and industry.',
    industry: 'Visual Search & Recognition',
    location: 'Berlin, Germany',
    foundedYear: 2015,
    website: 'nyris.io',
    email: 'info@nyris.io',
    employees: '40+',
    specializations: ['Visual Search', 'Image Recognition', 'E-commerce Technology'],
    keyAchievements: [
      'Developed high-precision visual search technology',
      'Created solutions for industrial and e-commerce applications',
      'Partnered with major retailers and manufacturers'
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Lindera',
    description: 'Lindera is a Berlin-based healthcare AI company that uses computer vision to assess mobility risks for elderly patients. Their smartphone-based 3D analysis helps prevent falls and improve care for seniors.',
    industry: 'Healthcare AI',
    location: 'Berlin, Germany',
    foundedYear: 2017,
    website: 'lindera.de',
    email: 'info@lindera.de',
    employees: '50+',
    specializations: ['Healthcare AI', '3D Motion Analysis', 'Fall Prevention', 'Elderly Care'],
    keyAchievements: [
      'Developed AI-based mobility risk assessment',
      'Created smartphone-based 3D gait analysis',
      'Partnered with nursing homes and healthcare providers'
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Parloa',
    description: 'Parloa is a Berlin-based conversational AI platform that helps businesses automate customer service interactions. Their technology enables the creation of voice and chat assistants for customer support.',
    industry: 'Conversational AI',
    location: 'Berlin, Germany',
    foundedYear: 2017,
    website: 'parloa.com',
    email: 'info@parloa.com',
    employees: '40+',
    specializations: ['Conversational AI', 'Natural Language Processing', 'Customer Service Automation'],
    keyAchievements: [
      'Developed enterprise-grade conversational AI platform',
      'Created voice and chat assistant technology',
      'Partnered with major German companies for customer service automation'
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Daedalus AI',
    description: 'Daedalus AI is a Munich-based company that develops AI solutions for manufacturing and quality control. Their computer vision systems help detect defects and optimize production processes.',
    industry: 'Manufacturing AI',
    location: 'Munich, Germany',
    foundedYear: 2018,
    website: 'daedalus.ai',
    email: 'info@daedalus.ai',
    employees: '25+',
    specializations: ['Manufacturing AI', 'Quality Control', 'Computer Vision', 'Defect Detection'],
    keyAchievements: [
      'Developed AI-based quality control systems',
      'Created solutions for automotive and electronics manufacturing',
      'Reduced defect rates for manufacturing clients'
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Teraki',
    description: 'Teraki is a Berlin-based AI company focused on edge computing for automotive and IoT applications. Their technology enables efficient processing of sensor data directly on edge devices.',
    industry: 'Edge AI & Automotive',
    location: 'Berlin, Germany',
    foundedYear: 2014,
    website: 'teraki.com',
    email: 'info@teraki.com',
    employees: '30+',
    specializations: ['Edge AI', 'Automotive Technology', 'IoT', 'Data Compression'],
    keyAchievements: [
      'Developed edge AI technology for automotive applications',
      'Created data compression algorithms for sensor data',
      'Partnered with automotive manufacturers and suppliers'
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Understand.ai',
    description: 'Understand.ai is a Karlsruhe-based company that specializes in data annotation and AI solutions for autonomous driving. They provide high-quality training data and validation for autonomous vehicle systems.',
    industry: 'Autonomous Driving',
    location: 'Karlsruhe, Germany',
    foundedYear: 2016,
    website: 'understand.ai',
    email: 'info@understand.ai',
    employees: '50+',
    specializations: ['Autonomous Driving', 'Data Annotation', 'Computer Vision', 'Machine Learning'],
    keyAchievements: [
      'Developed data annotation platform for autonomous driving',
      'Created AI-based annotation automation tools',
      'Acquired by dSPACE in 2019'
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Brighter AI',
    description: 'Brighter AI is a Berlin-based company that develops privacy-preserving computer vision technology. Their Deep Natural Anonymization technology enables the use of visual data while protecting personal privacy.',
    industry: 'Privacy Technology',
    location: 'Berlin, Germany',
    foundedYear: 2017,
    website: 'brighter.ai',
    email: 'info@brighter.ai',
    employees: '30+',
    specializations: ['Privacy Technology', 'Computer Vision', 'Data Anonymization'],
    keyAchievements: [
      'Developed Deep Natural Anonymization technology',
      'Created privacy-compliant solutions for smart cities and automotive',
      'Won multiple innovation awards for privacy technology'
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'NavVis',
    description: 'NavVis is a Munich-based company that combines AI with indoor mapping technology. They develop digital twin solutions for indoor spaces using 3D scanning and AI-powered analytics.',
    industry: 'Digital Twin Technology',
    location: 'Munich, Germany',
    foundedYear: 2013,
    website: 'navvis.com',
    email: 'info@navvis.com',
    employees: '200+',
    specializations: ['Indoor Mapping', 'Digital Twins', 'Computer Vision', '3D Visualization'],
    keyAchievements: [
      'Developed the NavVis VLX wearable mapping system',
      'Created the NavVis IVION digital twin platform',
      'Partnered with major industrial companies for facility management'
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function main() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('dishbrain');
    const companiesCollection = db.collection('companies');
    
    // Check if any of these German companies already exist
    const germanCompanyNames = germanAICompanies.map(company => company.name);
    const existingGermanCompanies = await companiesCollection.find({
      name: { $in: germanCompanyNames }
    }).toArray();
    
    if (existingGermanCompanies.length > 0) {
      console.log(`Found ${existingGermanCompanies.length} existing German AI companies in the database.`);
      console.log('Companies already in database:', existingGermanCompanies.map(c => c.name).join(', '));
      
      // Filter out companies that already exist
      const newCompanies = germanAICompanies.filter(company => 
        !existingGermanCompanies.some(existing => existing.name === company.name)
      );
      
      if (newCompanies.length === 0) {
        console.log('All German AI companies are already in the database. No new companies to add.');
      } else {
        // Insert only new companies
        const result = await companiesCollection.insertMany(newCompanies);
        console.log(`Successfully inserted ${result.insertedCount} new German AI companies into the database.`);
        console.log('Inserted company IDs:', result.insertedIds);
      }
    } else {
      // Insert all German AI companies
      const result = await companiesCollection.insertMany(germanAICompanies);
      console.log(`Successfully inserted ${result.insertedCount} German AI companies into the database.`);
      console.log('Inserted company IDs:', result.insertedIds);
    }
    
  } catch (error) {
    console.error('Error adding German AI company data:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Run the main function
main().catch(console.error);