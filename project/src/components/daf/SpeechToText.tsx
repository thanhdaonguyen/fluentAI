import React, { useEffect, useRef, useState } from 'react';
import { Card, Typography, Tag } from 'antd';
import { SessionData } from '../../types/session';

const { Text } = Typography;

interface SpeechToTextProps {
  isListening: boolean;
  onDataUpdate: (data: Partial<SessionData>) => void;
}

const SpeechToText: React.FC<SpeechToTextProps> = ({ isListening, onDataUpdate }) => {
  const [transcript, setTranscript] = useState('');
  const [interimText, setInterimText] = useState('');
  const [stutteredWords, setStutteredWords] = useState<Set<string>>(new Set());
  const recognitionRef = useRef<any>(null);
  const totalWordsRef = useRef(0);
  const totalStuttersRef = useRef(0);

  useEffect(() => {
    if (!isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setInterimText('');
      return;
    }

    // Reset counters when starting
    totalWordsRef.current = 0;
    totalStuttersRef.current = 0;
    setTranscript('');
    setStutteredWords(new Set());

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error('Speech recognition not supported');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interim += transcript;
        }
      }

      setInterimText(interim);

      if (finalTranscript) {
        setTranscript(prev => prev + finalTranscript);
        
        // Enhanced stutter detection
        const words = finalTranscript.trim().split(/\s+/).filter(w => w.length > 0);
        const detectedStutters = new Set<string>();
        let stutterCount = 0;

        words.forEach((word, index) => {
          const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
          
          // Detect repetitions
          if (index > 0) {
            const prevWord = words[index - 1].toLowerCase().replace(/[^a-z]/g, '');
            if (cleanWord === prevWord && cleanWord.length > 0) {
              detectedStutters.add(word);
              stutterCount++;
            }
          }
          
          // Detect prolongations (3+ repeated letters)
          if (/(.)\1{2,}/.test(cleanWord)) {
            detectedStutters.add(word);
            stutterCount++;
          }
          
          // Detect blocks (very short words that might be incomplete)
          if (cleanWord.length === 1 && index < words.length - 1) {
            const nextWord = words[index + 1].toLowerCase();
            if (nextWord.startsWith(cleanWord)) {
              detectedStutters.add(word);
              stutterCount++;
            }
          }
        });

        setStutteredWords(prev => new Set([...Array.from(prev), ...Array.from(detectedStutters)]));
        
        totalWordsRef.current += words.length;
        totalStuttersRef.current += stutterCount;
        
        onDataUpdate({
          totalWords: totalWordsRef.current,
          stutterCount: totalStuttersRef.current,
          stutteredWords: Array.from(new Set([
            ...Array.from(stutteredWords),
            ...Array.from(detectedStutters)
          ])),
        });
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'no-speech') {
        recognition.stop();
        recognition.start();
      }
    };

    recognition.start();
    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening, onDataUpdate]);

  const renderTranscript = () => {
    const fullText = transcript + (interimText ? ' ' + interimText : '');
    const words = fullText.split(/\s+/).filter(w => w.length > 0);
    
    return words.map((word, index) => {
      const isStuttered = stutteredWords.has(word);
      const isInterim = index >= transcript.split(/\s+/).filter(w => w.length > 0).length;
      
      return (
        <span key={index}>
          {isStuttered ? (
            <Tag color="warning" style={{ margin: '2px' }}>
              {word}
            </Tag>
          ) : (
            <span style={{ 
              margin: '2px',
              opacity: isInterim ? 0.6 : 1,
              fontStyle: isInterim ? 'italic' : 'normal'
            }}>
              {word}{' '}
            </span>
          )}
        </span>
      );
    });
  };

  return (
    <Card title="Speech-to-Text" size="small">
      <div style={{ 
        minHeight: 100, 
        maxHeight: 200, 
        overflowY: 'auto',
        padding: 16,
        background: '#f5f5f5',
        borderRadius: 8,
        fontSize: 18,
        lineHeight: 1.6,
      }}>
        {(transcript || interimText) ? (
          renderTranscript()
        ) : (
          <Text type="secondary">
            {isListening ? 'Listening... Start speaking!' : 'Click Start to begin'}
          </Text>
        )}
      </div>
    </Card>
  );
};

export default SpeechToText;