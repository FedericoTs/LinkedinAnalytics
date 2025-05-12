// Edge function to handle OpenAI API calls via Pica passthrough

interface CompletionRequest {
  model: string;
  prompt: string | string[];
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stop?: string | string[];
  best_of?: number;
  n?: number;
  stream?: boolean;
  logprobs?: number;
  echo?: boolean;
  logit_bias?: Record<string, number>;
  suffix?: string;
  user?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "authorization, x-client-info, apikey, content-type",
      },
      status: 200,
    });
  }

  try {
    const {
      prompt,
      model,
      max_tokens,
      temperature,
      topic,
      contentType,
      contentPurpose,
      targetAudience,
      keyPoints,
      aiSettings,
    } = await req.json();

    // Construct a more detailed prompt based on the provided parameters
    let enhancedPrompt = `Create a professional ${contentType || "post"} about "${topic || prompt}"`;

    if (contentPurpose?.type) {
      enhancedPrompt += ` with the purpose of ${contentPurpose.type}`;
    }

    if (targetAudience?.customDescription) {
      enhancedPrompt += `. Target audience: ${targetAudience.customDescription}`;
    }

    if (keyPoints && keyPoints.length > 0) {
      enhancedPrompt += `. Include these key points:\n`;
      keyPoints.forEach((point: string, index: number) => {
        enhancedPrompt += `${index + 1}. ${point}\n`;
      });
    }

    if (aiSettings) {
      if (aiSettings.formality < 33) {
        enhancedPrompt += `. Use a casual tone`;
      } else if (aiSettings.formality < 66) {
        enhancedPrompt += `. Use a neutral tone`;
      } else {
        enhancedPrompt += `. Use a formal tone`;
      }

      if (aiSettings.length < 33) {
        enhancedPrompt += `. Keep it short and concise`;
      } else if (aiSettings.length < 66) {
        enhancedPrompt += `. Use a medium length`;
      } else {
        enhancedPrompt += `. Make it comprehensive and detailed`;
      }

      if (aiSettings.includeHashtags) {
        enhancedPrompt += `. Include 3-5 relevant hashtags at the end`;
      }

      if (aiSettings.includeCTA) {
        enhancedPrompt += `. Include a clear call to action at the end`;
      }
    }

    // Format the content based on contentType
    if (contentType === "article") {
      enhancedPrompt += `. Format as a professional article with markdown headings, paragraphs, and bullet points where appropriate.`;
    } else {
      enhancedPrompt += `. Format as a concise LinkedIn post with line breaks for readability.`;
    }

    // Prepare the request to the OpenAI API via Pica passthrough
    const completionRequest: CompletionRequest = {
      model: model || "gpt-3.5-turbo-instruct",
      prompt: enhancedPrompt,
      max_tokens: max_tokens || 500,
      temperature:
        temperature ||
        (aiSettings?.creativity ? aiSettings.creativity / 100 : 0.7),
    };

    const response = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("OPENAI_API_KEY") || ""}`,
      },
      body: JSON.stringify(completionRequest),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error?.message || data.error || "Unknown error occurred",
      );
    }

    return new Response(
      JSON.stringify({
        content: data.choices[0].text,
        usage: data.usage,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      status: 400,
    });
  }
});
