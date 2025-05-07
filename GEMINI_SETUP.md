# Setting Up Gemini API for Rock Identification

This guide will walk you through the process of setting up the Gemini API to identify rocks in your iRock application.

## 1. Create a Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click on "Create API Key"
4. Select "Create API key in new project" (or use an existing project if you have one)
5. Copy the generated API key - you'll need this in the next step

## 2. Add the API Key to Your Project

1. Create a `.env.local` file in the root of your project (same directory as package.json)
2. Add the following line to the file:
   ```
   EXPO_PUBLIC_GEMINI_API_KEY=your_api_key_here
   ```
   Replace `your_api_key_here` with the API key you copied in step 1.5
3. Save the file

## 3. Configure Expo to Use Environment Variables

1. Make sure your project is set up to use environment variables with Expo
2. The `expo-env.d.ts` file should exist in your project
3. If you need to make any changes to accommodate the new environment variable, do so now

## 4. Restart Your Development Server

1. Stop your current development server (if running)
2. Start a new development server with:
   ```
   npm run dev
   ```

## 5. Test the Rock Identification Feature

1. Navigate to the "Identify" tab in your app
2. Take a photo of a rock or upload an image from your gallery
3. The app should send the image to the Gemini API and display the identification results

## Troubleshooting

If you encounter any issues:

1. **API Key Not Working**: Make sure your API key is correct and properly formatted in the `.env.local` file
2. **Environment Variables Not Loading**: Ensure your development server was completely restarted
3. **Error in API Response**: Check the console logs for detailed error messages
4. **Rate Limits**: The free tier of Gemini API has usage limits. If you exceed them, you may need to wait or upgrade to a paid tier

## Additional Resources

- [Gemini API Documentation](https://ai.google.dev/gemini-api/docs)
- [Gemini Pro Vision Model](https://ai.google.dev/gemini-api/docs/models/gemini#gemini-pro-vision)
- [Environment Variables in Expo](https://docs.expo.dev/guides/environment-variables/) 