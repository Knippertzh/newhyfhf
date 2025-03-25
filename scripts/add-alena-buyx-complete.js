// Script to add Prof. Dr. med. Alena Michaela Buyx to MongoDB directly
import { MongoClient, ObjectId } from 'mongodb';

// MongoDB connection URI from environment variable
const uri = process.env.DISHBRAIN_MONGODB_URI;

if (!uri) {
  console.error('Please define the DISHBRAIN_MONGODB_URI environment variable');
  process.exit(1);
}
const dbName = 'dishbrain';

async function main() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(dbName);
    const expertsCollection = db.collection('expert');
    const usersCollection = db.collection('users');
    
    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email: 'alena.buyx@tum.de' });
    
    let userId;
    
    if (existingUser) {
      console.log('User already exists:', existingUser);
      userId = existingUser._id;
    } else {
      // Create a new user
      const newUser = {
        username: 'alenabuyx',
        email: 'alena.buyx@tum.de',
        passwordHash: 'temppassword123', // This should be properly hashed in production
        role: 'USER',
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const result = await usersCollection.insertOne(newUser);
      userId = result.insertedId;
      console.log('Created new user with ID:', userId);
    }
    
    // Check if expert profile already exists
    const existingExpert = await expertsCollection.findOne({ userId: userId });
    
    if (existingExpert) {
      console.log('Expert profile already exists:', existingExpert);
      
      // Update the expert profile
      const updatedExpert = await expertsCollection.findOneAndUpdate(
        { _id: existingExpert._id },
        {
          $set: {
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
            ],
            updatedAt: new Date()
          }
        },
        { returnDocument: 'after' }
      );
      
      console.log('Updated expert profile:', updatedExpert.value);
    } else {
      // Create a new expert profile
      const newExpert = {
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
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const result = await expertsCollection.insertOne(newExpert);
      console.log('Created new expert profile with ID:', result.insertedId);
    }
    
    console.log('Successfully added Prof. Dr. med. Alena Michaela Buyx to the database');
  } catch (error) {
    console.error('Error adding Prof. Dr. med. Alena Michaela Buyx to the database:', error);
    // Log more detailed error information
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

main();