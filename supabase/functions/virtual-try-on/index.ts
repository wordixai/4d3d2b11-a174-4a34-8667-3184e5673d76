import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

interface GenerateRequest {
  action: "generate";
  personImage: string;
  clothingImage: string;
  garmentDescription?: string;
}

interface StatusRequest {
  action: "status";
  predictionId: string;
}

type RequestBody = GenerateRequest | StatusRequest;

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const REPLICATE_API_TOKEN = Deno.env.get("REPLICATE_API_TOKEN");
    if (!REPLICATE_API_TOKEN) {
      throw new Error("REPLICATE_API_TOKEN is not configured");
    }

    const body: RequestBody = await req.json();

    if (body.action === "generate") {
      const { personImage, clothingImage, garmentDescription } = body as GenerateRequest;

      if (!personImage || !clothingImage) {
        return new Response(
          JSON.stringify({ error: "Person image and clothing image are required" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Call Replicate API to create a prediction using IDM-VTON
      const response = await fetch("https://api.replicate.com/v1/predictions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json",
          "Prefer": "respond-async",
        },
        body: JSON.stringify({
          version: "c871bb9b046c1b1f6ab2f26a7e6573e10e1b987db0e4aa38acda3fcaafb3331c",
          input: {
            human_img: personImage,
            garm_img: clothingImage,
            garment_des: garmentDescription || "clothing item",
            category: "upper_body",
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Replicate API error:", errorData);
        throw new Error(`Replicate API error: ${response.status}`);
      }

      const prediction = await response.json();

      return new Response(
        JSON.stringify({
          predictionId: prediction.id,
          status: prediction.status,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    if (body.action === "status") {
      const { predictionId } = body as StatusRequest;

      if (!predictionId) {
        return new Response(
          JSON.stringify({ error: "Prediction ID is required" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      const response = await fetch(
        `https://api.replicate.com/v1/predictions/${predictionId}`,
        {
          headers: {
            Authorization: `Bearer ${REPLICATE_API_TOKEN}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Replicate status check failed: ${response.status}`);
      }

      const prediction = await response.json();

      return new Response(
        JSON.stringify({
          status: prediction.status,
          output: prediction.output,
          error: prediction.error,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: "Unknown action. Use 'generate' or 'status'." }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
