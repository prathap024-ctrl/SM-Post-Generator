export function generatePrompt({
  blogUrl,
  platform,
  tone,
  content,
}: {
  blogUrl: string | string[];
  platform: string;
  tone?: string;
  content?: string;
}) {
  const urlText = Array.isArray(blogUrl)
    ? `Use the following blog URLs as reference:\n${blogUrl.join("\n")}`
    : `Use this blog URL as reference:\n${blogUrl}`;

  const contentText = content
    ? `\n\nExtracted blog content:\n"""${content.trim()}"""`
    : "";

  return `
You are a social media strategist and expert copywriter.

Write a high-performing post for **${platform}**  
Tone: **${tone || "Neutral"}**

${urlText}${contentText}

Instructions:
- Start with a scroll-stopping hook
- Highlight key insights from the blog
- Match the tone and format suited for **${platform}**
- End with a compelling CTA
- Keep it short, engaging, and platform-native
`.trim();
}
