import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API with the API key from environment variables
const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { expertData, customKeywords } = data;
    
    if (!expertData) {
      return NextResponse.json(
        { error: 'Missing required field: expertData' },
        { status: 400 }
      );
    }
    
    // Create a model instance
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    // Prepare the prompt based on expert data and any custom keywords
    let prompt = `Analyze the following expert data and extract key professional insights, achievements, and background information:\n\n`;
    
    // Add expert data to the prompt
    prompt += `Name: ${expertData.personalInfo?.fullName || expertData.name || 'Unknown'}\n`;
    prompt += `Title: ${expertData.personalInfo?.title || expertData.title || 'Unknown'}\n`;
    
    if (expertData.bio) {
      prompt += `Bio: ${expertData.bio}\n`;
    }
    
    if (expertData.specializations && expertData.specializations.length > 0) {
      prompt += `Specializations: ${expertData.specializations.join(', ')}\n`;
    }
    
    if (expertData.expertise) {
      if (expertData.expertise.primary && expertData.expertise.primary.length > 0) {
        prompt += `Primary Expertise: ${expertData.expertise.primary.join(', ')}\n`;
      }
      if (expertData.expertise.secondary && expertData.expertise.secondary.length > 0) {
        prompt += `Secondary Expertise: ${expertData.expertise.secondary.join(', ')}\n`;
      }
    }
    
    if (expertData.education && expertData.education.length > 0) {
      prompt += `Education:\n`;
      expertData.education.forEach((edu: any) => {
        const degree = edu.degree || edu.degreeName || '';
        const institution = edu.institution || edu.schoolName || '';
        const year = edu.year || (edu.timePeriod?.endDate?.year ? `${edu.timePeriod.endDate.year}` : '');
        prompt += `- ${degree} ${institution} ${year}\n`;
      });
    }
    
    if (expertData.publications && expertData.publications.length > 0) {
      prompt += `Publications:\n`;
      expertData.publications.forEach((pub: any) => {
        prompt += `- ${pub.title}, ${pub.venue}, ${pub.year}\n`;
      });
    }
    
    // Add custom keywords if provided
    if (customKeywords && customKeywords.trim()) {
      prompt += `\nPlease focus on the following areas: ${customKeywords}\n`;
    }
    
    // Add instructions for the output format
    prompt += `\nBased on the above information, provide 10 key insights about this expert in the following JSON format:\n`;
    prompt += `[\n  { "id": 1, "info": "[insight text]", "category": "[category]" },\n  { "id": 2, "info": "[insight text]", "category": "[category]" },\n  ...\n]\n`;
    prompt += `\nCategories should be one of: Publications, Education, Experience, Speaking, Awards, Projects, Collaborations, Leadership, Patents, or other relevant categories.\n`;
    prompt += `Each insight should be a concise, factual statement about the expert's achievements, background, or expertise.\n`;
    
    // Generate content using the Gemini API
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Try to parse the response as JSON
    try {
      // Extract JSON from the response (it might be wrapped in markdown code blocks)
      const jsonMatch = text.match(/\[\s*\{.*\}\s*\]/s);
      const jsonStr = jsonMatch ? jsonMatch[0] : text;
      const enrichmentData = JSON.parse(jsonStr);
      
      return NextResponse.json({
        success: true,
        enrichmentData,
      });
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      // If parsing fails, return the raw text
      return NextResponse.json({
        success: false,
        error: 'Failed to parse AI response',
        rawResponse: text,
      }, { status: 500 });
    }
  } catch (err) {
    console.error('Error calling Gemini API:', err);
    return NextResponse.json(
      { error: 'Failed to process request with Gemini API' },
      { status: 500 }
    );
  }
}