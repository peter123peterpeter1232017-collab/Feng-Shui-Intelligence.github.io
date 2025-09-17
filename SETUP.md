# Feng Shui Intelligence - ChatGPT Integration Setup

This guide will help you set up the ChatGPT-powered photo analysis feature for the Feng Shui Intelligence website.

## Prerequisites

1. **Node.js** (version 14 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **OpenAI API Key**
   - Sign up at: https://platform.openai.com/
   - Create an API key at: https://platform.openai.com/api-keys
   - Note: You'll need credits in your OpenAI account to use the API

## Installation Steps

### 1. Install Dependencies

Open a terminal in the project directory and run:

```bash
npm install
```

### 2. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   copy .env.example .env
   ```

2. Edit the `.env` file and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_actual_api_key_here
   PORT=3000
   ```

### 3. Start the Server

Run the development server:

```bash
npm start
```

Or for development with auto-restart:

```bash
npm run dev
```

The server will start on http://localhost:3000

### 4. Test the Application

1. Open your browser and go to: http://localhost:3000/upload.html
2. Upload a photo of an interior space
3. Select the room type
4. Click "Analyze Photo"
5. Wait for ChatGPT to analyze the image and provide feng shui recommendations

## How It Works

1. **Frontend**: The upload.html page captures user photos and room type
2. **Backend**: The Node.js server (server.js) receives the photo and sends it to ChatGPT
3. **AI Analysis**: ChatGPT Vision analyzes the image using feng shui principles
4. **Results**: The analysis is returned and displayed with scores, recommendations, and insights

## API Endpoints

- `POST /api/analyze-photo` - Upload and analyze a photo
- `GET /api/health` - Check server status

## Features

✅ **Real Photo Analysis**: Uses ChatGPT Vision to analyze actual interior photos
✅ **Feng Shui Expertise**: AI trained on feng shui principles and practices
✅ **Detailed Recommendations**: Specific, actionable suggestions for improvement
✅ **Room-Specific Analysis**: Tailored analysis based on room type (living room, bedroom, etc.)
✅ **Scoring System**: Numerical feng shui score with explanations
✅ **Element Balance**: Analysis of the five elements (Wood, Fire, Earth, Metal, Water)
✅ **Energy Flow Assessment**: Chi flow patterns and blockages

## Troubleshooting

### Common Issues

1. **"Error analyzing photo"**
   - Check that your OpenAI API key is correctly set in the `.env` file
   - Ensure you have sufficient credits in your OpenAI account
   - Verify the server is running on port 3000

2. **"Server not responding"**
   - Make sure you ran `npm install` to install dependencies
   - Check that Node.js is properly installed
   - Verify no other application is using port 3000

3. **"Invalid image format"**
   - Only upload image files (JPG, PNG, GIF, etc.)
   - Ensure the image file is under 10MB

### Server Logs

Check the terminal where you started the server for detailed error messages.

## Cost Considerations

Using ChatGPT Vision API incurs costs based on:
- Image size and resolution
- Length of analysis response
- Number of requests

Typical cost per analysis: $0.01 - $0.05 USD

Monitor your usage at: https://platform.openai.com/usage

## Security Notes

- Never commit your `.env` file to version control
- Keep your OpenAI API key secure and private
- Consider implementing rate limiting for production use
- Uploaded photos are temporarily stored and then deleted after analysis

## Next Steps

For production deployment, consider:
- Adding user authentication
- Implementing payment processing
- Setting up a proper database
- Adding image optimization
- Implementing caching for better performance

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review server logs for error messages
3. Ensure all prerequisites are properly installed
4. Verify your OpenAI API key has sufficient credits