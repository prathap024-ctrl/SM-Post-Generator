"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Globe, Hash, Megaphone } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import axios from "axios";
import { toast } from "sonner";

// Zod schema
const formSchema = z.object({
  blogUrl: z
    .string()
    .min(1, "Blog URL is required")
    .url("Enter a valid URL")
    .refine((url) => url.startsWith("http://") || url.startsWith("https://"), {
      message: "URL must start with http:// or https://",
    }),
  platform: z.string().min(1, "Select a social media platform"),
  tone: z.string().min(1, "Select a content tone"),
});

type FormData = z.infer<typeof formSchema>;

const socialPlatforms = [
  { value: "twitter", label: "Twitter", icon: Hash },
  { value: "linkedin", label: "LinkedIn", icon: Globe },
  { value: "facebook", label: "Facebook", icon: Globe },
  { value: "instagram", label: "Instagram", icon: Hash },
  { value: "reddit", label: "Reddit", icon: Globe },
  { value: "threads", label: "Threads", icon: Hash },
  { value: "medium", label: "Medium", icon: Globe },
  { value: "quora", label: "Quora", icon: Globe },
  { value: "whatsapp", label: "WhatsApp", icon: Globe },
  { value: "telegram", label: "Telegram", icon: Globe },
];

const contentTones = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "enthusiastic", label: "Enthusiastic" },
  { value: "educational", label: "Educational" },
  { value: "friendly", label: "Friendly" },
  { value: "witty", label: "Witty" },
  { value: "empathetic", label: "Empathetic" },
  { value: "persuasive", label: "Persuasive" },
  { value: "confident", label: "Confident" },
  { value: "inspirational", label: "Inspirational" },
  { value: "urgent", label: "Urgent" },
  { value: "humorous", label: "Humorous" },
  { value: "sarcastic", label: "Sarcastic" },
  { value: "analytical", label: "Analytical" },
  { value: "neutral", label: "Neutral" },
];

export default function BlogContentForm() {
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsGenerating(true);
      const response = await axios.post(
        "https://sm-post-generator.onrender.com/api/post/generate-post",
        data
      );

      const content =
        typeof response.data?.data === "string"
          ? response.data.data
          : "No content generated.";
      setGeneratedContent(content);
      toast.success("Post Generated Successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        `Failed to generate content! ${
          axios.isAxiosError(error)
            ? error.response?.data?.message || error.message
            : String(error)
        }`
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const platformValue = watch("platform");
  const toneValue = watch("tone");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4 py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Megaphone className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">
            Blog Content Generator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your blog posts into engaging social media content with
            AI-powered optimization
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl text-gray-900">
                Generate Content
              </CardTitle>
              <CardDescription className="text-gray-600">
                Fill in the details below to create optimized social media
                content from your blog post
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Blog URL Input */}
                <div className="space-y-2">
                  <Label htmlFor="blogUrl">
                    Blog URL <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="blogUrl"
                    type="url"
                    required
                    placeholder="https://example.com/your-blog-post"
                    {...register("blogUrl")}
                  />
                  {errors.blogUrl && (
                    <Alert variant="destructive" className="py-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        {errors.blogUrl.message}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Social Platform */}
                <div className="space-y-2">
                  <Label>
                    Social Media Platform{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={platformValue}
                    onValueChange={(value) => setValue("platform", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {socialPlatforms.map(({ value, label, icon: Icon }) => (
                        <SelectItem key={value} value={value}>
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            {label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.platform && (
                    <Alert variant="destructive" className="py-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        {errors.platform.message}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Tone */}
                <div className="space-y-2">
                  <Label>
                    Content Tone <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={toneValue}
                    onValueChange={(value) => setValue("tone", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose content tone" />
                    </SelectTrigger>
                    <SelectContent>
                      {contentTones.map(({ value, label }) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.tone && (
                    <Alert variant="destructive" className="py-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        {errors.tone.message}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-200 transform hover:scale-[1.02]"
                  disabled={!isValid || isGenerating}
                >
                  {isGenerating ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Generating Content...
                    </div>
                  ) : (
                    "Generate Content"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Preview Section */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl text-gray-900">
                Content Preview
              </CardTitle>
              <CardDescription className="text-gray-600">
                Your generated social media content will appear here
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generatedContent ? (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">
                        Generated for {platformValue} – {toneValue} tone
                      </span>
                    </div>
                    <Textarea
                      value={generatedContent}
                      onChange={(e) => setGeneratedContent(e.target.value)}
                      className="min-h-[200px] resize-none border-0 bg-transparent p-0 focus-visible:ring-0"
                      placeholder="Generated content will appear here..."
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() =>
                        navigator.clipboard.writeText(generatedContent)
                      }
                      className="flex-1"
                    >
                      Copy Content
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setGeneratedContent("")}
                      className="text-red-500 border-red-300 hover:bg-red-50"
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Megaphone className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Ready to Generate
                  </h3>
                  <p className="text-gray-500 text-sm max-w-xs">
                    Fill out the form and click "Generate Content" to see your
                    optimized social media post
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
