import { GoogleGenerativeAI } from "@google/generative-ai";
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

// ------------------------------------------------------------------------
// HOW TO SETUP YOUR GEMINI API KEY:
// 1. Go to https://aistudio.google.com/app/apikey to create a Gemini API key
// 2. Create a .env.local file in the root of your project 
// 3. Add the following line to your .env.local file:
//    EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
// 4. Restart your development server
// ------------------------------------------------------------------------

// Initialize the Gemini API with your API key
const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

// Helper function to convert image to base64
async function getImageBase64(uri: string): Promise<string> {
  try {
    // On web, we need to fetch the image and convert it to base64
    if (Platform.OS === 'web') {
      const response = await fetch(uri);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          // Remove the data URL prefix
          const base64 = base64String.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } else {
      // On native platforms, use FileSystem API
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64;
    }
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw error;
  }
}

// Function to identify rock using Gemini
// Update signature to accept an array of image URIs
export async function identifyRock(imageUris: string[]) {
  try {
    // Check if API key is provided
    if (!API_KEY) {
      throw new Error('Gemini API key is not set. Please add your API key to the .env.local file as EXPO_PUBLIC_GEMINI_API_KEY=your_key_here');
    }
    // Check if any images were provided
    if (!imageUris || imageUris.length === 0) {
      throw new Error('No images provided for identification.');
    }

    // Get base64 encoded images for all URIs
    const base64Images = await Promise.all(
      imageUris.map(uri => getImageBase64(uri))
    );

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Construct the prompt, mentioning multiple images
    const prompt = `
      Analyze these images (${imageUris.length} views provided) and identify the rock or mineral shown.
      Provide the most accurate identification based on all views.
      
      Provide the following information:
      1. Common name of the rock or mineral
      2. Scientific name of the rock or mineral
      3. Confidence level of the identification (as a numerical percentage between 0 and 100)
      4. Basic classification:
         - For rocks: igneous, sedimentary, or metamorphic
         - For minerals: mineral family
      5. Physical properties:
         - Hardness (on the Mohs scale)
         - Luster (metallic, vitreous, earthy, etc.)
         - Typical Color Range
         - Streak Color
         - Cleavage/Fracture Pattern
         - Typical Crystal Structure (if applicable)
      6. Formation process
      7. Common locations
      8. Collecting value
      9. Fun facts
      
      Format your response as a structured JSON object with the following fields:
      {
        "title": "Title of the Rock/Mineral",
        "commonName": "Common Name",
        "scientificName": "Scientific Name",
        "confidenceLevel": 85, // Example of numerical value
        "classification": "Classification",
        "physicalProperties": {
          "hardness": "Value",
          "luster": "Value",
          "colorRange": "Value",
          "streakColor": "Value",
          "cleavageFracture": "Value",
          "crystalStructure": "Value"
        },
        "formationProcess": "Description",
        "commonLocations": "Locations",
        "collectingValue": "Value",
        "funFacts": "Facts",
        "description": "Detailed description..."
        // Removed the old "properties" array as it's redundant
      }
      
      Only return the JSON object without any additional text.
    `;

    // Prepare the image parts for all images
    const imageParts = base64Images.map(base64Image => ({
        inlineData: {
          data: base64Image,
        mimeType: "image/jpeg" // Assuming jpeg, adjust if needed
      }
    }));

    // Generate content with prompt and all image parts
    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text();

    // Parse the response as JSON
    try {
      // Extract JSON from response (handling cases where extra text might appear)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return JSON.parse(text);
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError);
      // Return a generic response if parsing fails
      return {
        name: "Unknown Rock",
        description: "Unable to accurately identify this rock. The image might be unclear or the rock might have unusual characteristics.",
        properties: [
          { name: "Note", value: "Please try with a clearer image or different angle." }
        ]
      };
    }
  } catch (error) {
    console.error('Error identifying rock:', error);
    throw error;
  }
}

// New function for Dr. Rock chat responses
export async function getDrRockChatResponse(userMessage: string, chatHistory?: Array<{role: 'user' | 'model', parts: {text: string}[]}>) {
  try {
    if (!API_KEY) {
      console.error('Gemini API key is not set for chat.');
      return "My geological sensors seem to be offline! Please ensure the API key is configured.";
    }

    // Use the same model as identifyRock, which is known to work
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const personaPrompt = `You are Dr. Rock, a friendly, enthusiastic, and highly knowledgeable geologist with two PhDs. 
    Your primary goal is to educate and engage users about rocks, minerals, and geology in an accessible and exciting way. 
    Use clear language, but don't shy away from interesting geological terms (which you should explain clearly if used). 
    Keep your responses concise and conversational, suitable for a chat interface. 
    If a question is outside your geological expertise, politely say so. 
    You can also gently guide users to the app's 'Education' section if relevant.
    Do not refer to yourself as an AI or language model; maintain the persona of Dr. Rock.`;

    // For now, we'll construct a simple prompt. History can be integrated later for more contextual conversations.
    // The Gemini API expects history in a specific format if used with model.startChat().
    // For a single turn, we prepend the persona and context to the user message.
    
    const fullPrompt = `${personaPrompt}\n\nUSER ASKS: "${userMessage}"\n\nDR. ROCK REPLIES:`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();
    
    return text;

  } catch (error) {
    console.error('Error getting Dr. Rock chat response:', error);
    // Provide a user-friendly error message
    // Type guard for error.message
    if (error instanceof Error && error.message && error.message.includes('API key not valid')) {
        return "It seems there's an issue with my connection to the geological data-banks (API key error). Please check the configuration.";
    } else if (error instanceof Error) {
        // Handle other generic errors that are instances of Error
        return `Apologies, an unexpected geological tremor occurred: ${error.message}. Could you try again?`;
    }
    return "Apologies, my seismograph is picking up some interference! I couldn't process that. Could you try rephrasing or asking again?";
  }
}