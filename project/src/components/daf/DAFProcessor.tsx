import React, { useEffect, useRef, useState } from 'react';
import { Card, Slider, Typography, Switch, Space } from 'antd';

const { Text } = Typography;

interface DAFProcessorProps {
  isActive: boolean;
  delay: number;
  stream: MediaStream | null;
}

const DAFProcessor: React.FC<DAFProcessorProps> = ({ isActive, delay: initialDelay , stream}) => {
  const [delay, setDelay] = useState(initialDelay);
  const [volume, setVolume] = useState(0.7);
  const [isEnabled, setIsEnabled] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{ source: MediaStreamAudioSourceNode | null, delay: DelayNode | null, gain: GainNode | null }>({
    source: null,
    delay: null,
    gain: null,
  });

  useEffect(() => {
    const cleanup = () => {
      const { source, delay, gain } = nodesRef.current;
      source?.disconnect();
      delay?.disconnect();
      gain?.disconnect();
      
      if (audioContextRef.current?.state !== 'closed') {
        audioContextRef.current?.close();
      }
      
      nodesRef.current = { source: null, delay: null, gain: null };
      audioContextRef.current = null;
    };
    if (!isActive || !isEnabled || !stream ) {
      cleanup();
      return;
    }

    const setupDAF = async () => {
      try {
        if(!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }

        if(!nodesRef.current.source) {
          const source = audioContextRef.current.createMediaStreamSource(stream);
          const delayNode = audioContextRef.current.createDelay(1); // Max 1 second delay
          const gainNode = audioContextRef.current.createGain();

          nodesRef.current = { source, delay: delayNode, gain: gainNode };

          source.connect(delayNode);
          delayNode.connect(gainNode);
          gainNode.connect(audioContextRef.current.destination);
        }

        nodesRef.current.delay!.delayTime.value = delay / 1000;
        nodesRef.current.gain!.gain.value = volume;


      } catch (error) {
        console.error('Error setting up DAF:', error);
        cleanup();
      }
    };

    setupDAF();

    return () => {
      if (nodesRef.current.delay) {
        nodesRef.current.delay.delayTime.value = delay / 1000;
      }
    };
  }, [isActive, isEnabled, stream, delay, volume]);

  // Update delay when it changes
  useEffect(() => {
    if (nodesRef.current.delay) {
      nodesRef.current.delay.delayTime.value = delay / 1000;
    }
  }, [delay]);

  // Update volume when it changes
  useEffect(() => {
    if (nodesRef.current.gain) {
      nodesRef.current.gain.gain.value = volume;
    }
  }, [volume]);

  return (
    <Card title="DAF Settings" size="small">
      <Space direction="vertical" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text>Enable DAF</Text>
          <Switch 
            checked={isEnabled} 
            onChange={setIsEnabled}
            disabled={!isActive}
          />
        </div>
        
        <div>
          <Text>Delay: {delay}ms</Text>
          <Slider
            min={50}
            max={200}
            value={delay}
            onChange={setDelay}
            disabled={!isActive || !isEnabled}
            marks={{
              50: '50ms',
              100: '100ms',
              150: '150ms',
              200: '200ms',
            }}
            tooltip={{ formatter: (value) => `${value}ms` }}
          />
        </div>
        
        <div>
          <Text>Volume: {Math.round(volume * 100)}%</Text>
          <Slider
            min={0}
            max={100}
            value={volume * 100}
            onChange={(value) => setVolume(value / 100)}
            disabled={!isActive || !isEnabled}
            tooltip={{ formatter: (value) => `${value}%` }}
          />
        </div>
        
        <Text type="secondary" style={{ fontSize: 12 }}>
          Delayed Auditory Feedback helps improve speech fluency by playing back your voice with a slight delay.
        </Text>
      </Space>
    </Card>
  );
};

export default DAFProcessor;