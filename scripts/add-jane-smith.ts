import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // First, create a user for Dr. Jane Smith
    const user = await prisma.user.create({
      data: {
        username: 'janesmith',
        email: 'jane.smith@deepmind.com',
        passwordHash: 'temppassword123', // This should be properly hashed in production
        role: 'USER',
        status: 'ACTIVE',
      },
    });

    console.log('Created user:', user);

    // Then create the expert profile with all the detailed information
    const expert = await prisma.expert.create({
      data: {
        userId: user.id,
        title: 'AI Research Scientist',
        company: 'DeepMind',
        companyId: '1',
        website: 'https://janesmith.ai',
        linkedin: 'janesmith',
        twitter: 'janesmith_ai',
        bio: "Dr. Jane Smith is a leading AI researcher specializing in reinforcement learning. She has published over 30 papers in top-tier conferences and journals, including NeurIPS, ICML, and JMLR. Her work on multi-agent reinforcement learning has been widely cited and has influenced the development of several commercial AI systems.",
        specializations: [
          'Reinforcement Learning',
          'Multi-agent Systems',
          'Neural Networks'
        ],
        education: [
          { degree: 'Ph.D. in Computer Science', institution: 'Stanford University', year: '2015' },
          { degree: 'M.S. in Computer Science', institution: 'MIT', year: '2011' },
          { degree: 'B.S. in Computer Science', institution: 'UC Berkeley', year: '2009' }
        ],
        publications: [
          { title: 'Multi-Agent Reinforcement Learning in Complex Environments', venue: 'NeurIPS', year: '2022' },
          { title: 'Advances in Deep Reinforcement Learning', venue: 'ICML', year: '2020' },
          { title: 'Cooperative Learning in Multi-Agent Systems', venue: 'JMLR', year: '2018' }
        ],
        projects: [
          { name: 'AlphaGo Next', description: 'Advanced reinforcement learning for complex games' },
          { name: 'Multi-Agent Cooperation Framework', description: 'Framework for training cooperative AI agents' }
        ]
      },
    });

    console.log('Created expert profile:', expert);

    console.log('Successfully added Dr. Jane Smith to the database');
  } catch (error) {
    console.error('Error adding Dr. Jane Smith to the database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();