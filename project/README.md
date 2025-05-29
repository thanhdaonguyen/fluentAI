# FluentAI - Speech Therapy Demo App

A demo application designed to help children with stuttering disorders using Delayed Auditory Feedback (DAF) technology and personalized speech exercises.

## Features

### DAF Interface
- **Real-time Speech Processing**: Start/stop listening with prominent controls
- **Audio Visualization**: Live waveform display of speech
- **Speech-to-Text**: Real-time transcription with stuttered words highlighted
- **DAF Technology**: Delayed auditory feedback with adjustable delay (50-200ms)
- **Performance Scoring**: Real-time fluency score calculation
- **Session Feedback**: Encouraging messages based on performance

### Exercise Interface
- **Speech Analytics**: Track stuttering patterns and progress over time
- **Personalized Practice Plans**: AI-generated recommendations based on performance
- **Exercise Library**: Various exercises for breathing, reading, rhythm, and speaking
- **Progress Tracking**: Visual charts showing improvement trends
- **Gamification**: Unlockable exercises and achievement tracking

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Development Server**
   ```bash
   npm start
   ```

3. **Access the Application**
   - Open [http://localhost:3000](http://localhost:3000) in your browser
   - The app will automatically reload when you make changes

## Project Structure

```
src/
├── components/
│   ├── daf/
│   │   ├── AudioVisualizer.tsx
│   │   ├── SpeechToText.tsx
│   │   ├── DAFProcessor.tsx
│   │   └── FeedbackDisplay.tsx
│   ├── exercise/
│   │   ├── Analytics.tsx
│   │   ├── PracticePlan.tsx
│   │   └── ExerciseLibrary.tsx
│   └── Navigation.tsx
├── pages/
│   ├── DAFPage.tsx
│   └── ExercisePage.tsx
├── types/
│   └── session.ts
├── App.tsx
├── App.css
└── index.tsx
```

## Technical Requirements

### Browser Requirements
- Modern browser with Web Audio API support
- Microphone access permission
- Chrome/Edge recommended for best speech recognition

### Key Technologies
- **React 18** with TypeScript
- **Ant Design** for UI components
- **React Router** for navigation
- **Recharts** for data visualization
- **Web Audio API** for audio processing
- **Web Speech API** for speech recognition

## Usage Notes

### DAF Practice
1. Click "Start Listening" to begin a session
2. Speak naturally into your microphone
3. Watch the real-time visualizations and transcription
4. Adjust DAF delay if needed (default: 150ms)
5. Click "Stop Listening" to end and see feedback

### Exercise Tracking
1. Navigate to "Exercises & Analytics" tab
2. View your progress charts and statistics
3. Follow the personalized practice plan
4. Complete exercises from the library
5. Track improvement over time

## Demo Limitations

This is a demo application with simplified features:
- Speech recognition uses basic pattern matching for stutter detection
- Data is stored in localStorage (not persistent across devices)
- No user authentication system
- Limited exercise content
- Simplified AI recommendations

## Future Enhancements

For a production version, consider:
- Advanced ML-based stutter detection
- Cloud storage with user accounts
- Real speech therapist integration
- More comprehensive exercise library
- Mobile app versions
- Multiplayer/social features
- Professional analytics dashboard

## Troubleshooting

### Microphone Access
- Ensure browser has microphone permissions
- Check system audio settings
- Try using headphones to avoid feedback

### Speech Recognition Issues
- Speak clearly and at a moderate pace
- Ensure quiet environment
- Check browser console for errors
- Try refreshing the page

### Performance Issues
- Close other audio applications
- Use Chrome/Edge for best performance
- Check system resources

## License

This is a demo application for educational purposes.