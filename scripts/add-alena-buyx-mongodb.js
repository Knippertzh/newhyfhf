m// Script to add Prof. Dr. med. Alena Michaela Buyx to MongoDB directly
import { MongoClient, ObjectId } from 'mongodb';

import dotenv from 'dotenv';
dotenv.config();

// MongoDB connection URI from environment variable
const uri = process.env.DATABASE_URL;

if (!uri) {
  console.error('Please define the DATABASE_URL environment variable in .env');
  process.exit(1);
}

async function main() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('dishbrain');
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

    let expertData = {
      userId: userId,
      personalInfo: {
        fullName: "Prof. Dr. med. Alena Michaela Buyx",
        title: "Prof. Dr. med.",
        dateOfBirth: "1977-09-29",
        nationality: "German",
        email: "alena.buyx@tum.de",
        location: "München, Deutschland",
        languages: ["German", "English"],
        image: "https://www.h-brs.de/sites/default/files/2024-10/Alena%20Buyx%20CV_Copyright%20TUM%2C%20Lara%20Freiburger.JPG",
        phone: null,
        allData: {
          id: "18966515",
          profileId: "ACoAAAEhZ_MB-XLRXGOqQm3UfzewHVV-8mVXwOI",
          firstName: "Alena",
          lastName: "Buyx",
          occupation: "Visiting Scholar in The Harvard Program in Ethics and Health",
          publicIdentifier: "alena-buyx-bab4276",
          trackingId: "+8zKUoQOTbOX8u6GMRzJlA==",
          countryCode: "us",
          geoUrn: "urn:li:fs_geo:104597301",
          positions: [
            {
              title: "Visiting scholar",
              timePeriod: {
                startDate: {
                  year: 2008
                }
              },
              companyName: "Harvard Medical School"
            },
            {
              title: "Assistant professor",
              timePeriod: {
                endDate: {
                  year: 2008
                },
                startDate: {
                  year: 2006
                }
              },
              company: {
                employeeCountRange: {
                  start: 5001,
                  end: 10000
                },
                industries: [
                  "Research"
                ],
                objectUrn: "urn:li:company:15594",
                entityUrn: "urn:li:fs_miniCompany:15594",
                name: "University of Münster",
                showcase: false,
                active: true,
                logo: "https://media.licdn.com/dms/image/v2/C4E0BAQGpKl9fXcWaUQ/company-logo_200_200/company-logo_200_200/0/1671697645543/university_of_muenster_logo?e=1747872000&v=beta&t=FgbDqwMgQOkbLxUQ86yfE66pTixtk86sZ1-Iyln6DVc",
                universalName: "university-of-muenster",
                dashCompanyUrn: "urn:li:fsd_company:15594",
                trackingId: "QeGtJUcKQsmgRes32/nAbg=="
              },
              companyName: "University of Muenster"
            }
          ],
          educations: [
            {
              degreeName: "Dr. med.; M.A.",
              fieldOfStudy: "Medicine, Philosophy, Sociology",
              schoolName: "University of Münster",
              timePeriod: {
                endDate: {
                  year: 2005
                },
                startDate: {
                  year: 1997
                }
              }
            },
            {
              fieldOfStudy: "Medicine (Neurology)",
              schoolName: "UCL",
              timePeriod: {
                endDate: {
                  year: 2004
                },
                startDate: {
                  year: 2004
                }
              }
            },
            {
              fieldOfStudy: "Philosophy, health sciences",
              schoolName: "University of York",
              timePeriod: {
                endDate: {
                  year: 2002
                },
                startDate: {
                  year: 2001
                }
              }
            }
          ],
          certifications: [],
          courses: [],
          honors: [],
          languages: [],
          skills: [],
          volunteerExperiences: [],
          headline: "Visiting Scholar in The Harvard Program in Ethics and Health",
          summary: "Alena is a medical ethicist wirh a background in medicine, philosophy and sociology (medical doctorate in neurology, master's degree in philosophy). She works at Muenster University and the Max Planck Institute for Molecular Biomedicine Muenster (on leave). Currently, she is a visiting postdoc scholar in the Harvard Program in Ethics and Health at Harvard Medical School. Her main research areas are justice in healthcare, the ethics of organ donation and transplantation, ethical issues in wish-fulfilling medicine and enhancement, and the theory of teaching medical ethics.\n\nSpecialties: Medical Ethics\nBioethics",
          student: false,
          industryName: "Hospital & Health Care",
          industryUrn: "urn:li:fs_industry:14",
          geoLocationName: "Cambridge, Massachusetts",
          geoCountryName: "United States",
          jobTitle: "Visiting scholar",
          companyName: "Harvard Medical School",
          following: false,
          followable: true,
          followersCount: 39,
          connectionsCount: 21,
          connectionType: "",
        }
      },
      institution: {
        name: "Harvard Medical School",
        position: "Visiting scholar",
        department: null,
        website: null
      },
      expertise: {
        primary: ["Medizin", "KI", "Ethik"],
        secondary: [],
        industries: []
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (existingExpert) {
      console.log('Expert profile already exists:', existingExpert);

      // Update the expert profile
      const updatedExpert = await expertsCollection.findOneAndUpdate(
        { _id: existingExpert._id },
        {
          $set: expertData
        },
        { returnDocument: 'after' }
      );

      console.log('Updated expert profile:', updatedExpert.value);
    } else {
      // Create a new expert profile
      const result = await expertsCollection.insertOne(expertData);
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
