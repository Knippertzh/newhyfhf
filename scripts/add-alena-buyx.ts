import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: 'alena.buyx@tum.de'
      },
      include: {
        Expert: true
      }
    });

    let user;
    
    if (existingUser) {
      console.log('User already exists:', existingUser);
      user = existingUser;
    } else {
      // Create a new user for Prof. Dr. med. Alena Michaela Buyx
      user = await prisma.user.create({
        data: {
          username: 'alenabuyx',
          email: 'alena.buyx@tum.de',
          passwordHash: 'temppassword123', // This should be properly hashed in production
          role: 'USER',
          status: 'ACTIVE',
        },
      });
      console.log('Created new user:', user);
    }

    // Check if expert profile already exists for this user
    let expert;
    
    if (existingUser?.Expert) {
      console.log('Expert profile already exists:', existingUser.Expert);
      expert = existingUser.Expert;
      
      // Update the expert profile with the latest information
      expert = await prisma.expert.update({
        where: {
          id: existingUser.Expert.id
        },
        data: {
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
        },
      });
      console.log('Updated expert profile:', expert);
    } else {
      // Create a new expert profile
      expert = await prisma.expert.create({
        data: {
          userId: user.id,
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
        },
      });
      console.log('Created new expert profile:', expert);
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
    await prisma.$disconnect();
  }
}

main();