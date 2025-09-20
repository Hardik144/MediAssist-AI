import React from 'react';
import { Bot, Heart, Sparkles, MessageCircle } from 'lucide-react';

interface AnimatedBotProps {
  isThinking?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showHeartbeat?: boolean;
}

const AnimatedBot: React.FC<AnimatedBotProps> = ({ 
  isThinking = false, 
  size = 'md',
  showHeartbeat = false 
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  const containerSizeClasses = {
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4'
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Main Bot Container */}
      <div className={`
        ${containerSizeClasses[size]} 
        rounded-full 
        bg-gradient-primary 
        ${isThinking ? 'animate-thinking' : 'animate-bot-pulse'}
        shadow-lg
        relative
      `}>
        <Bot className={`${sizeClasses[size]} text-white`} />
        
        {/* Thinking Dots */}
        {isThinking && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-1 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg">
              <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
      </div>

      {/* Heartbeat Animation */}
      {showHeartbeat && (
        <div className="absolute -top-2 -right-2 animate-bounce-gentle">
          <Heart className="h-4 w-4 text-red-500 fill-current" />
        </div>
      )}

      {/* Floating Sparkles */}
      {!isThinking && (
        <>
          <div className="absolute -top-1 -right-1 animate-float" style={{ animationDelay: '0s' }}>
            <Sparkles className="h-3 w-3 text-yellow-400" />
          </div>
          <div className="absolute -bottom-1 -left-1 animate-float" style={{ animationDelay: '2s' }}>
            <MessageCircle className="h-3 w-3 text-blue-400" />
          </div>
        </>
      )}

      {/* Pulse Rings */}
      <div className={`
        absolute inset-0 rounded-full border-2 border-primary/30 
        ${isThinking ? 'animate-ping' : 'animate-pulse'} 
        ${containerSizeClasses[size]}
      `}></div>
      <div className={`
        absolute inset-0 rounded-full border border-primary/20 
        animate-pulse 
        ${containerSizeClasses[size]}
      `} style={{ animationDelay: '1s' }}></div>
    </div>
  );
};

export default AnimatedBot;