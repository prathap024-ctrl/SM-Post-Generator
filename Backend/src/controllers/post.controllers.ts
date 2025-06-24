import type { Request, Response } from "express";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { RecursiveUrlLoader } from "@langchain/community/document_loaders/web/recursive_url";
import { compile } from "html-to-text";
import { generatePrompt } from "../prompts/prompt";
import { model } from "../AI-Model/Gemini";

const generatePost = async (req: Request, res: Response) => {
  try {
    const { blogUrl, platform, tone } = req.body;
    if (!blogUrl || !platform || !tone) {
      throw new ApiError(400, "All fields required!");
    }
    const compiledConvert = compile({ wordwrap: 130 });
    const url = blogUrl;
    const loader = new RecursiveUrlLoader(url, {
      extractor: compiledConvert,
      maxDepth: 1,
      excludeDirs: ["/docs/api/"],
    });

    const docs = await loader.load();
    const content = docs[0]?.pageContent;

    const prompt = generatePrompt({
      blogUrl: url,
      platform: platform,
      tone: tone,
      content: content,
    });

    const response = await model.invoke(prompt);
    const generatedText = Array.isArray(response.content)
      ? response.content.map((item: any) => item.text || "").join("\n")
      : typeof response.content === "string"
      ? response.content
      : "";

    const output = generatedText
      .replace(/(\*\*|__)(.*?)\1/g, "$2")
      // Remove *italic* and _italic_
      .replace(/(\*|_)(.*?)\1/g, "$2")
      // Remove list markers like "* ", "- ", "+ "
      .replace(/^\s*[-*+]\s+/gm, "")
      // Remove inline code `code`
      .replace(/`(.*?)`/g, "$1")
      // Remove headings like # Heading
      .replace(/^#{1,6}\s*/gm, "")
      // Remove > blockquotes
      .replace(/^>\s?/gm, "")
      // Remove image/video labels like **Visual:** or similar
      .replace(/^\*\*(.*?)\*\*:/gm, "$1:")
      .trim();

    return res
      .status(200)
      .json(new ApiResponse(200, output, "Generated Post Successfully!"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, "", "Internal Server Error"));
  }
};

export { generatePost };
