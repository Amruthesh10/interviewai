import { Mistral } from "@mistralai/mistralai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import puppeteer from "puppeteer";

const ai = new Mistral({
    apiKey: process.env.MISTRAL_API_KEY,
});

const interviewReportSchema = z.object({
    matchScore: z.number().describe(
        "A score between 0 and 100 indicating how well the candidate profile matches the job description"
    ),

    technicalQuestions: z.array(
        z.object({
            question: z.string(),
            intention: z.string(),
            answer: z.string(),
        })
    ),

    behavioralQuestions: z.array(
        z.object({
            question: z.string(),
            intention: z.string(),
            answer: z.string(),
        })
    ),

    skillGaps: z.array(
        z.object({
            skill: z.string(),
            severity: z.enum(["low", "medium", "high"]),
        })
    ),

    preparationPlan: z.array(
        z.object({
            day: z.number(),
            focus: z.string(),
            tasks: z.array(z.string()),
        })
    ),

    title: z.string(),
});

async function generateInterviewReport({
    resume,
    selfDescription,
    jobDescription,
}) {
    const prompt = `
Generate an interview report.

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

Return ONLY valid JSON matching this schema:

${JSON.stringify(zodToJsonSchema(interviewReportSchema))}
`;

    const response = await ai.chat.complete({
        model: "mistral-small-2506",

        messages: [
            {
                role: "user",
                content: prompt,
            },
        ],

        responseFormat: {
            type: "json_object",
        },
    });

    const result = response.choices[0].message.content;

    return JSON.parse(result);
}

async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch();

    const page = await browser.newPage();

    await page.setContent(htmlContent, {
        waitUntil: "networkidle0",
    });

    const pdfBuffer = await page.pdf({
        format: "A4",

        margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm",
        },
    });

    await browser.close();

    return pdfBuffer;
}

async function generateResumePdf({
    resume,
    selfDescription,
    jobDescription,
}) {
    const resumePdfSchema = z.object({
        html: z.string(),
    });

    const prompt = `
Generate an ATS friendly professional resume.

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

Return JSON only:

${JSON.stringify(zodToJsonSchema(resumePdfSchema))}
`;

    const response = await ai.chat.complete({
        model: "mistral-small-2506",

        messages: [
            {
                role: "user",
                content: prompt,
            },
        ],

        responseFormat: {
            type: "json_object",
        },
    });

    const result = response.choices[0].message.content;

    const jsonContent = JSON.parse(result);

    const pdfBuffer = await generatePdfFromHtml(
        jsonContent.html
    );

    return pdfBuffer;
}

export {
    generateInterviewReport,
    generateResumePdf,
};