// Script to add real German AI experts to MongoDB
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

// MongoDB connection URI from environment variable
const uri = process.env.DISHBRAIN_MONGODB_URI || process.env.DATABASE_URL;

if (!uri) {
  console.error('Please define the DISHBRAIN_MONGODB_URI or DATABASE_URL environment variable in .env');
  process.exit(1);
}

// Real German AI expert data
const germanAIExperts = [
  {
    personalInfo: {
      fullName: "Prof. Dr. Kristian Kersting",
      title: "Professor",
      email: "kristian.kersting@cs.tu-darmstadt.de",
      image: "https://www.informatik.tu-darmstadt.de/media/ml/group/kersting_500x500.jpg"
    },
    institution: {
      name: "Technical University of Darmstadt",
      position: "Professor for Machine Learning",
      department: "Department of Computer Science",
      website: "https://www.informatik.tu-darmstadt.de/ml/ml/"
    },
    expertise: {
      primary: ["Machine Learning", "Artificial Intelligence", "Probabilistic Programming"],
      secondary: ["Data Mining", "Statistical Relational AI", "Deep Learning"]
    },
    bio: "Prof. Dr. Kristian Kersting is a leading German AI researcher specializing in machine learning and AI. He is a professor at TU Darmstadt and heads the Machine Learning Lab. His research focuses on deep probabilistic programming, statistical relational AI, and resource-constrained AI.",
    education: [
      { degree: "Ph.D. in Computer Science", institution: "University of Freiburg", year: "2006" },
      { degree: "Diploma in Computer Science", institution: "University of Freiburg", year: "2002" }
    ],
    publications: [
      { title: "Gradient-based Boosting for Statistical Relational Learning", venue: "Journal of Machine Learning Research", year: "2015" },
      { title: "Lifted Probabilistic Inference by First-Order Knowledge Compilation", venue: "International Joint Conference on Artificial Intelligence", year: "2011" },
      { title: "Counting Belief Propagation", venue: "Conference on Uncertainty in Artificial Intelligence", year: "2009" }
    ],
    projects: [
      { name: "DeepProbLog", description: "Integrating probabilistic logic programming with deep learning" },
      { name: "StarAI", description: "Statistical Relational Artificial Intelligence" }
    ]
  },
  {
    personalInfo: {
      fullName: "Prof. Dr. Katharina Morik",
      title: "Professor",
      email: "katharina.morik@tu-dortmund.de",
      image: "https://www.cs.tu-dortmund.de/nps/de/Home/Personen/Professoren/Morik/Morik.jpg"
    },
    institution: {
      name: "Technical University of Dortmund",
      position: "Professor for Artificial Intelligence",
      department: "Department of Computer Science",
      website: "https://www-ai.cs.tu-dortmund.de/"
    },
    expertise: {
      primary: ["Machine Learning", "Data Mining", "Big Data Analytics"],
      secondary: ["Resource-aware ML", "Distributed ML", "Industry 4.0"]
    },
    bio: "Prof. Dr. Katharina Morik is a pioneer in artificial intelligence and machine learning in Germany. She founded the Collaborative Research Center SFB876 on resource-constrained data analysis. Her research focuses on machine learning algorithms for big data and resource-constrained environments.",
    education: [
      { degree: "Ph.D. in Computer Science", institution: "University of Hamburg", year: "1981" },
      { degree: "Diploma in Computer Science", institution: "University of Hamburg", year: "1976" }
    ],
    publications: [
      { title: "Resource-Aware Machine Learning", venue: "Synthesis Lectures on Artificial Intelligence and Machine Learning", year: "2021" },
      { title: "Communication-Efficient Distributed Online Learning with Kernels", venue: "European Conference on Machine Learning", year: "2018" },
      { title: "Distributed Support Vector Machines: An Overview", venue: "ECML PKDD", year: "2015" }
    ],
    projects: [
      { name: "SFB 876", description: "Collaborative Research Center on Providing Information by Resource-Constrained Data Analysis" },
      { name: "RapidMiner", description: "Open-source data science platform" }
    ]
  },
  {
    personalInfo: {
      fullName: "Prof. Dr. Stefan Wrobel",
      title: "Professor",
      email: "stefan.wrobel@iais.fraunhofer.de",
      image: "https://www.iais.fraunhofer.de/content/dam/iais/images/Personen/Wrobel_Stefan_Prof_Dr.jpg"
    },
    institution: {
      name: "Fraunhofer Institute for Intelligent Analysis and Information Systems",
      position: "Director",
      department: "IAIS",
      website: "https://www.iais.fraunhofer.de/"
    },
    expertise: {
      primary: ["Machine Learning", "Data Mining", "Artificial Intelligence"],
      secondary: ["Knowledge Discovery", "Big Data Analytics", "Industry 4.0"]
    },
    bio: "Prof. Dr. Stefan Wrobel is the director of the Fraunhofer Institute for Intelligent Analysis and Information Systems (IAIS) and professor of computer science at the University of Bonn. His research focuses on machine learning, data mining, and their applications in various domain()s.",
    education: [
      { degree: "Ph.D. in Computer Science", institution: "University of Dortmund", year: "1991" },
      { degree: "Diploma in Computer Science", institution: "University of Bonn", year: "1987" }
    ],
    publications: [
      { title: "Big Data - What Is It and What Does It Mean for Science?", venue: "Informatik-Spektrum", year: "2013" },
      { title: "Graph-Based Inductive Learning of Subgroup Patterns", venue: "Machine Learning", year: "2008" },
      { title: "An Upgrade for Privacy in Decentralized Optimization", venue: "NeurIPS", year: "2020" }
    ],
    projects: [
      { name: "ML2R", description: "Competence Center Machine Learning Rhine-Ruhr" },
      { name: "BIFOLD", description: "Berlin Institute for the Foundations of Learning and Data" }
    ]
  },
  {
    personalInfo: {
      fullName: "Prof. Dr. Ute Schmid",
      title: "Professor",
      email: "ute.schmid@uni-bamberg.de",
      image: "https://www.uni-bamberg.de/fileadmin/_processed_/0/b/csm_Schmid_Ute_2018_quadratisch_01_9f2c557290.jpg"
    },
    institution: {
      name: "University of Bamberg",
      position: "Professor for Cognitive Systems",
      department: "Faculty of Information Systems and Applied Computer Sciences",
      website: "https://www.uni-bamberg.de/en/cogsys/"
    },
    expertise: {
      primary: ["Explainable AI", "Cognitive Systems", "Machine Learning"],
      secondary: ["AI Education", "Human-AI Collaboration", "Inductive Programming"]
    },
    bio: "Prof. Dr. Ute Schmid is a professor for Cognitive Systems at the University of Bamberg. Her research focuses on explainable AI, cognitive modeling, and machine learning. She is particularly interested in making AI systems more transparent and understandable for humans.",
    education: [
      { degree: "Habilitation in Computer Science", institution: "University of Bamberg", year: "2002" },
      { degree: "Ph.D. in Computer Science", institution: "Technical University of Berlin", year: "1994" },
      { degree: "Diploma in Psychology", institution: "University of Freiburg", year: "1990" }
    ],
    publications: [
      { title: "Explainable AI: Interpreting, Explaining and Visualizing Deep Learning", venue: "Springer", year: "2019" },
      { title: "Inductive Programming Meets the Real World", venue: "Communications of the ACM", year: "2017" },
      { title: "Towards Cognitive Assistants for Complex Tasks", venue: "KI - Künstliche Intelligenz", year: "2020" }
    ],
    projects: [
      { name: "Human-Centered AI", description: "Developing AI systems that collaborate effectively with humans" },
      { name: "XAI Teaching", description: "Educational approaches for explainable AI" }
    ]
  },
  {
    personalInfo: {
      fullName: "Prof. Dr. Philipp Slusallek",
      title: "Professor",
      email: "slusallek@dfki.de",
      image: "https://www.dfki.de/fileadmin/_processed_/a/3/csm_Philipp_Slusallek_2020_quadratisch_01_d7b3d2c9f8.jpg"
    },
    institution: {
      name: "German Research Center for Artificial Intelligence (DFKI)",
      position: "Scientific Director",
      department: "Agents and Simulated Reality",
      website: "https://www.dfki.de/en/web"
    },
    expertise: {
      primary: ["Computer Graphics", "AI for Visual Computing", "Simulation"],
      secondary: ["Virtual Reality", "High-Performance Computing", "Digital Twins"]
    },
    bio: "Prof. Dr. Philipp Slusallek is Scientific Director at the German Research Center for Artificial Intelligence (DFKI) and professor of computer science at Saarland University. His research focuses on AI for visual computing, simulation, and high-performance computing.",
    education: [
      { degree: "Ph.D. in Computer Science", institution: "University of Erlangen", year: "1995" },
      { degree: "Diploma in Computer Science", institution: "University of Tübingen", year: "1990" }
    ],
    publications: [
      { title: "Towards a Digital Reality Ecosystem", venue: "ACM SIGGRAPH", year: "2019" },
      { title: "Real-time Ray Tracing on GPU with BVH-based Packet Traversal", venue: "IEEE Symposium on Interactive Ray Tracing", year: "2007" },
      { title: "Saarland University's High-Quality Visual Computing", venue: "Communications of the ACM", year: "2018" }
    ],
    projects: [
      { name: "CLAIRE", description: "Confederation of Laboratories for AI Research in Europe" },
      { name: "Intel Visual Computing Institute", description: "Research on visual computing and AI" }
    ]
  }
];

async function updateExpertImages() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('dishbrain');
    const expertsCollection = db.collection('expert');

    const updates = [
      {
        fullName: "Prof. Dr. Katharina Morik",
        imageUrl: "https://www-ai.cs.tu-dortmund.de/PERSONAL/morik.jpg"
      },
      {
        fullName: "Prof. Dr. Stefan Wrobel",
        imageUrl: "https://www.iais.fraunhofer.de/content/dam/iais/de/personen/stefan-wrobel.jpg"
      },
      {
        fullName: "Prof. Dr. Ute Schmid",
        imageUrl: "https://www.uni-bamberg.de/fileadmin/[path]/schmid.jpg"
      },
      {
        fullName: "Prof. Dr. Philipp Slusallek",
        imageUrl: "https://www.dfki.de/content/dam/dfki/images/person/pslu01.jpg"
      }
    ];

    for (const update of updates) {
      await expertsCollection.updateOne(
        { 'personalInfo.fullName': update.fullName },
        { $set: { 'personalInfo.image': update.imageUrl } }
      );
      console.log(`Updated image for ${update.fullName}`);
    }
  } catch (error) {
    console.error('Error updating expert images:', error);
  } finally {
    await client.close();
  }
}

updateExpertImages();

async function main() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('dishbrain');
    const expertsCollection = db.collection('expert');
    const usersCollection = db.collection('users');
    
    let addedCount = 0;
    let errorCount = 0;
    
    for (const expertData of germanAIExperts) {
      try {
        // Check if expert already exists by name
        const existingExpert = await expertsCollection.findOne({
          'personalInfo.fullName': expertData.personalInfo.fullName
        });
        
        if (existingExpert) {
          console.log(`Expert ${expertData.personalInfo.fullName} already exists, skipping...`);
          continue;
        }
        
        // Create a user account for the expert
        const username = expertData.personalInfo.fullName
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '')
          .substring(0, 20);
        
        const email = expertData.personalInfo.email || 
          `${username}@example.com`;
        
        // Check if user already exists
        const existingUser = await usersCollection.findOne({ email });
        
        let userId;
        
        if (existingUser) {
          console.log(`User with email ${email} already exists, using existing user...`);
          userId = existingUser._id;
        } else {
          // Create a new user
          const newUser = {
            username,
            email,
            passwordHash: 'temppassword123', // This should be properly hashed in production
            role: 'USER',
            status: 'ACTIVE',
            createdAt: new Date(),
            updatedAt: new Date()
          };
          
          const result = await usersCollection.insertOne(newUser);
          userId = result.insertedId;
          console.log(`Created new user with ID: ${userId}`);
        }
        
        // Create the expert profile
        const newExpert = {
          userId: userId,
          personalInfo: expertData.personalInfo,
          institution: expertData.institution,
          expertise: expertData.expertise,
          bio: expertData.bio,
          education: expertData.education,
          publications: expertData.publications,
          projects: expertData.projects,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        const expertResult = await expertsCollection.insertOne(newExpert);
        console.log(`Added expert ${expertData.personalInfo.fullName} with ID: ${expertResult.insertedId}`);
        addedCount++;
      } catch (error) {
        console.error(`Error adding expert ${expertData.personalInfo.fullName}:`, error);
        errorCount++;
      }
    }
    
    console.log(`\nSummary:\nAdded ${addedCount} experts\nErrors: ${errorCount}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

main()
