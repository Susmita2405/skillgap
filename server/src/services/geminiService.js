import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export const generateGeminiRoadmap = async ({
  targetRole,
  roleSkills,
  userSkills,
  skillGap
}) => {
  const prompt = `
You are an expert career-roadmap generator.

TARGET ROLE:
${targetRole}

STUDENT CURRENT SKILLS:
${JSON.stringify(userSkills, null, 2)}

ROLE REQUIRED SKILLS:
${JSON.stringify(roleSkills, null, 2)}

CURRENT SKILL GAP ANALYSIS:
${JSON.stringify(skillGap, null, 2)}

Create a realistic 24-week learning roadmap.

IMPORTANT RULES:

1. Do not waste roadmap time teaching skills the student
   already knows at an appropriate proficiency level.

2. Do not treat basic technologies such as HTML as if they
   require an entire six-month period.

3. Do not create artificial content simply to fill six months.

4. Do not create illogical dependencies between technologies.

5. Put learning in a realistic prerequisite order.

6. Group related concepts together.

7. Focus on skills genuinely relevant to the target role.

8. Required skills should receive higher priority than optional skills.

9. Git/GitHub should be included as a practical development
   workflow skill where appropriate, not as a prerequisite
   for unrelated technologies.

10. Include practical projects.

11. Avoid duplicate skills.

12. If the student already has a skill, move to the next
   meaningful level rather than teaching the basics again.

13. Use realistic estimated hours.

14. The roadmap covers approximately 24 weeks.

15. The roadmap should make the student progressively more
   capable of building real projects.

Return ONLY valid JSON.
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json"
    }
  });

  return JSON.parse(response.text);
};