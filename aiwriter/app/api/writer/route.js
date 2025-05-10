import generateWriting from '@/app/lib/gemini'
import { withClerkMiddleware } from '@clerk/nextjs'
import { getAuth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function POST(req) {
    const user = await getAuth(req);

    if (!user) {
        return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    try {
        const body = await req.json();
        const { topic, tone, length, targetAudience, keywords, useCase } = body;

       

        if (!topic || !tone || !length) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        const prompt = `
        You are an expert content creator, skilled in writing compelling and insightful articles. Your task is to generate a well-researched and engaging piece of content based on the following parameters.
        
        Here is a list of parameters provided -
        Topic: ${topic}
        Tone: ${tone}
        Length: ${length} words
        Target Audience: ${targetAudience}
        Keywords: ${keywords}
        Use Case: ${useCase}
        
        Do not try to fill any parameters by yourself if its not provided.
        
        In the result, Just write what the user asks for. Do not write anything the user did not ask for.

        Please create an original and engaging piece that adheres to the given parameters. Ensure the content is clear, informative, and resonates with the target audience. Make sure to incorporate the keywords naturally and provide valuable insights related to the topic.

        Focus on delivering high-quality, actionable content that provides value to the reader.

        Start the article with a captivating introduction that sets the tone and encourages further reading.
        `

        const generatedContent = await generateWriting(prompt);

        return NextResponse.json({generatedContent})
    } catch (error) {
        
        return new NextResponse({message:'Error generating content', status: 500 })
    }

}