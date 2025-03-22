import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Mail, Globe, Linkedin, Twitter, Building, Award, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Navbar from "@/components/navbar"
import PageBackground from "@/components/page-background"

// Mock data - replace with actual data fetching
const getExpertById = (id: string) => {
  const experts = {
    "1": {
      id: "1",
      name: "Dr. Jane Smith",
      title: "AI Research Scientist",
      company: "DeepMind",
      companyId: "1",
      email: "jane.smith@deepmind.com",
      website: "https://janesmith.ai",
      linkedin: "janesmith",
      twitter: "janesmith_ai",
      bio: "Dr. Jane Smith is a leading AI researcher specializing in reinforcement learning. She has published over 30 papers in top-tier conferences and journals, including NeurIPS, ICML, and JMLR. Her work on multi-agent reinforcement learning has been widely cited and has influenced the development of several commercial AI systems.",
      specializations: ["Reinforcement Learning", "Multi-agent Systems", "Neural Networks"],
      education: [
        { degree: "Ph.D. in Computer Science", institution: "Stanford University", year: "2015" },
        { degree: "M.S. in Computer Science", institution: "MIT", year: "2011" },
        { degree: "B.S. in Computer Science", institution: "UC Berkeley", year: "2009" },
      ],
      publications: [
        { title: "Multi-Agent Reinforcement Learning in Complex Environments", venue: "NeurIPS", year: "2022" },
        { title: "Advances in Deep Reinforcement Learning", venue: "ICML", year: "2020" },
        { title: "Cooperative Learning in Multi-Agent Systems", venue: "JMLR", year: "2018" },
      ],
      projects: [
        { name: "AlphaGo Next", description: "Advanced reinforcement learning for complex games" },
        { name: "Multi-Agent Cooperation Framework", description: "Framework for training cooperative AI agents" },
      ],
    },
    "2": {
      id: "2",
      name: "Prof. Alex Johnson",
      title: "Chief AI Officer",
      company: "OpenAI",
      companyId: "2",
      email: "alex.johnson@openai.com",
      website: "https://alexjohnson.ai",
      linkedin: "alexjohnson",
      twitter: "alexj_ai",
      bio: "Prof. Alex Johnson leads AI research and development at OpenAI. With a background in natural language processing and machine learning, he has pioneered several breakthroughs in language models and generative AI. Before joining OpenAI, he was a professor at MIT and led the NLP research group.",
      specializations: ["Natural Language Processing", "Large Language Models", "Generative AI"],
      education: [
        { degree: "Ph.D. in Computer Science", institution: "MIT", year: "2010" },
        { degree: "M.S. in Artificial Intelligence", institution: "Carnegie Mellon", year: "2006" },
        { degree: "B.S. in Computer Science", institution: "Harvard", year: "2004" },
      ],
      publications: [
        { title: "Scaling Language Models: Methods and Applications", venue: "ACL", year: "2023" },
        { title: "Transformer Architectures for Efficient NLP", venue: "EMNLP", year: "2021" },
        { title: "Advances in Generative Text Models", venue: "NeurIPS", year: "2019" },
      ],
      projects: [
        { name: "GPT-5", description: "Next-generation language model with enhanced reasoning" },
        { name: "AI Alignment Framework", description: "Methods for aligning AI systems with human values" },
      ],
    },
    "3": {
      id: "3",
      name: "Dr. Michael Chen",
      title: "ML Engineer",
      company: "Google AI",
      companyId: "3",
      email: "michael.chen@google.com",
      website: "https://michaelchen.dev",
      linkedin: "michaelchen",
      twitter: "mchen_ai",
      bio: "Dr. Michael Chen is a machine learning engineer at Google AI, focusing on computer vision and image recognition systems. He has developed several state-of-the-art models for object detection, image segmentation, and visual understanding. His work has been integrated into various Google products.",
      specializations: ["Computer Vision", "Image Recognition", "Deep Learning"],
      education: [
        { degree: "Ph.D. in Computer Vision", institution: "University of Toronto", year: "2017" },
        { degree: "M.S. in Computer Science", institution: "University of Waterloo", year: "2013" },
        { degree: "B.S. in Electrical Engineering", institution: "University of British Columbia", year: "2011" },
      ],
      publications: [
        { title: "Efficient Object Detection in Complex Scenes", venue: "CVPR", year: "2022" },
        { title: "Advances in Image Segmentation Using Transformers", venue: "ICCV", year: "2021" },
        { title: "Self-Supervised Learning for Computer Vision", venue: "ECCV", year: "2020" },
      ],
      projects: [
        { name: "VisualNet", description: "Advanced visual understanding system for complex environments" },
        {
          name: "Real-time Object Tracking",
          description: "Efficient algorithms for tracking objects in video streams",
        },
      ],
    },
    "4": {
      id: "4",
      name: "Sarah Williams",
      title: "AI Ethics Researcher",
      company: "Microsoft Research",
      companyId: "4",
      email: "sarah.williams@microsoft.com",
      website: "https://sarahwilliams.tech",
      linkedin: "sarahwilliams",
      twitter: "sarah_ai_ethics",
      bio: "Sarah Williams is a leading researcher in AI ethics at Microsoft Research. Her work focuses on fairness, accountability, transparency, and ethics in AI systems. She has contributed to developing frameworks for ethical AI deployment and has advised on policy matters related to responsible AI use.",
      specializations: ["AI Ethics", "Fairness in ML", "Responsible AI"],
      education: [
        { degree: "Ph.D. in Computer Science", institution: "UC Berkeley", year: "2016" },
        { degree: "M.S. in Ethics and Technology", institution: "Harvard", year: "2012" },
        { degree: "B.A. in Philosophy", institution: "Princeton", year: "2010" },
      ],
      publications: [
        { title: "Ethical Frameworks for AI Development", venue: "FAccT", year: "2023" },
        { title: "Measuring Fairness in Machine Learning Models", venue: "NeurIPS", year: "2021" },
        { title: "Transparency in AI Decision Making", venue: "AIES", year: "2019" },
      ],
      projects: [
        { name: "Fairness Toolkit", description: "Tools for measuring and mitigating bias in AI systems" },
        { name: "Ethical AI Guidelines", description: "Framework for responsible AI development and deployment" },
      ],
    },
    "5": {
      id: "5",
      name: "Dr. Raj Patel",
      title: "Senior Research Scientist",
      company: "Meta AI",
      companyId: "5",
      email: "raj.patel@meta.com",
      website: "https://rajpatel.ai",
      linkedin: "rajpatel",
      twitter: "raj_ai_research",
      bio: "Dr. Raj Patel is a senior research scientist at Meta AI, specializing in multimodal learning and AI systems that can process and understand multiple types of data simultaneously. His research has led to breakthroughs in systems that can understand both visual and textual information in context.",
      specializations: ["Multimodal Learning", "Computer Vision", "Natural Language Processing"],
      education: [
        { degree: "Ph.D. in Computer Science", institution: "Stanford University", year: "2015" },
        { degree: "M.S. in Artificial Intelligence", institution: "University of Washington", year: "2011" },
        { degree: "B.Tech in Computer Science", institution: "IIT Bombay", year: "2009" },
      ],
      publications: [
        { title: "Unified Multimodal Representations for AI", venue: "CVPR", year: "2023" },
        { title: "Joint Visual-Linguistic Understanding", venue: "ACL", year: "2022" },
        { title: "Cross-Modal Transfer Learning", venue: "ICLR", year: "2020" },
      ],
      projects: [
        { name: "MultiModal-GPT", description: "A model that understands both visual and textual inputs" },
        {
          name: "Cross-Modal Retrieval System",
          description: "System for retrieving relevant content across different modalities",
        },
      ],
    },
    "6": {
      id: "6",
      name: "Emma Rodriguez",
      title: "Robotics Engineer",
      company: "Boston Dynamics",
      companyId: "6",
      email: "emma.rodriguez@bostondynamics.com",
      website: "https://emmarod.tech",
      linkedin: "emmarodriguez",
      twitter: "emma_robotics",
      bio: "Emma Rodriguez is a robotics engineer at Boston Dynamics, focusing on the intersection of AI and robotics. She specializes in developing learning algorithms for robotic movement and interaction with the physical world. Her work has contributed to more natural and adaptive robot behaviors in complex environments.",
      specializations: ["Robotics", "Reinforcement Learning", "Motion Planning"],
      education: [
        { degree: "Ph.D. in Robotics", institution: "Carnegie Mellon University", year: "2018" },
        { degree: "M.S. in Mechanical Engineering", institution: "MIT", year: "2014" },
        { degree: "B.S. in Computer Engineering", institution: "University of Texas", year: "2012" },
      ],
      publications: [
        { title: "Adaptive Motion Planning for Quadruped Robots", venue: "ICRA", year: "2023" },
        { title: "Learning to Navigate Complex Terrains", venue: "RSS", year: "2021" },
        { title: "Reinforcement Learning for Robot Control", venue: "CoRL", year: "2019" },
      ],
      projects: [
        { name: "Agile Quadrupeds", description: "Developing agile movement capabilities for four-legged robots" },
        {
          name: "Human-Robot Interaction",
          description: "Creating natural interaction patterns between humans and robots",
        },
      ],
    },
  }

  return experts[id as keyof typeof experts]
}

export default function ExpertDetailPage({ params }: { params: { id: string } }) {
  const expert = getExpertById(params.id)

  // Generate avatar URL based on name
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(expert?.name || "Unknown")}&background=random&size=300&bold=true&color=fff`

  if (!expert) {
    return (
      <div className="min-h-screen bg-black">
        <PageBackground intensity="low" />
        <Navbar />
        <div className="container py-10">
          <h1 className="text-3xl font-bold text-white">Expert not found</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <PageBackground intensity="low" color="#4c00b0" />
      <Navbar />
      <div className="container py-10">
        <div className="mb-6">
          <Button asChild variant="dark-solid" size="sm">
            <Link href="/experts">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Experts
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="md:col-span-1">
            <Card className="bg-gray-900/70 border-gray-700">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="relative h-40 w-40 rounded-full overflow-hidden border-4 border-primary/20">
                    <Image src={avatarUrl || "/placeholder.svg"} alt={expert.name} fill className="object-cover" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-white">{expert.name}</CardTitle>
                <CardDescription className="text-white">{expert.title}</CardDescription>
                <div className="mt-2">
                  <Link href={`/companies/${expert.companyId}`}>
                    <Badge className="bg-primary/20 hover:bg-primary/30 text-primary border-primary/30">
                      <Building className="h-3 w-3 mr-1" />
                      {expert.company}
                    </Badge>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center text-white">
                    <Mail className="h-4 w-4 mr-2 text-primary" />
                    <a href={`mailto:${expert.email}`} className="hover:underline">
                      {expert.email}
                    </a>
                  </div>
                  {expert.website && (
                    <div className="flex items-center text-white">
                      <Globe className="h-4 w-4 mr-2 text-primary" />
                      <a href={expert.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        Personal Website
                      </a>
                    </div>
                  )}
                  {expert.linkedin && (
                    <div className="flex items-center text-white">
                      <Linkedin className="h-4 w-4 mr-2 text-primary" />
                      <a
                        href={`https://linkedin.com/in/${expert.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        LinkedIn Profile
                      </a>
                    </div>
                  )}
                  {expert.twitter && (
                    <div className="flex items-center text-white">
                      <Twitter className="h-4 w-4 mr-2 text-primary" />
                      <a
                        href={`https://twitter.com/${expert.twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        Twitter Profile
                      </a>
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-2 text-white">Specializations</h3>
                  <div className="flex flex-wrap gap-2">
                    {expert.specializations.map((spec) => (
                      <Badge key={spec} variant="outline" className="text-white">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Detailed Info */}
          <div className="md:col-span-2">
            <Card className="bg-gray-900/70 border-gray-700 mb-6">
              <CardHeader>
                <CardTitle className="text-white">Biography</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white">{expert.bio}</p>
              </CardContent>
            </Card>

            <Tabs defaultValue="education" className="mb-6">
              <TabsList className="bg-gray-900 border border-gray-700">
                <TabsTrigger
                  value="education"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  Education
                </TabsTrigger>
                <TabsTrigger
                  value="publications"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  Publications
                </TabsTrigger>
                <TabsTrigger
                  value="projects"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  Projects
                </TabsTrigger>
              </TabsList>

              <TabsContent value="education" className="mt-4">
                <Card className="bg-gray-900/70 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Education</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {expert.education.map((edu, index) => (
                        <li key={index} className="border-b border-gray-800 pb-3 last:border-0 last:pb-0">
                          <div className="flex items-start">
                            <Award className="h-5 w-5 mr-2 text-primary mt-0.5" />
                            <div>
                              <h4 className="font-medium text-white">{edu.degree}</h4>
                              <p className="text-sm text-white">
                                {edu.institution}, {edu.year}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="publications" className="mt-4">
                <Card className="bg-gray-900/70 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Publications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {expert.publications.map((pub, index) => (
                        <li key={index} className="border-b border-gray-800 pb-3 last:border-0 last:pb-0">
                          <div className="flex items-start">
                            <BookOpen className="h-5 w-5 mr-2 text-primary mt-0.5" />
                            <div>
                              <h4 className="font-medium text-white">{pub.title}</h4>
                              <p className="text-sm text-white">
                                {pub.venue}, {pub.year}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="projects" className="mt-4">
                <Card className="bg-gray-900/70 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Projects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {expert.projects.map((project, index) => (
                        <li key={index} className="border-b border-gray-800 pb-3 last:border-0 last:pb-0">
                          <h4 className="font-medium text-white">{project.name}</h4>
                          <p className="text-sm text-white">{project.description}</p>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

