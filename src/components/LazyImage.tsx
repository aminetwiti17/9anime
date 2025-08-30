import React, { useState, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  aspectRatio?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E',
  aspectRatio,
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '50px'
  });

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  return (
    <div 
      ref={ref}
      className={`relative overflow-hidden bg-dark-800 ${className}`}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {!hasError && inView && (
        <>
          {/* Placeholder */}
          <img
            src={placeholder}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              isLoaded ? 'opacity-0' : 'opacity-100'
            }`}
            aria-hidden="true"
          />
          
          {/* Actual Image */}
          <img
            src={src}
            alt={alt}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleLoad}
            onError={handleError}
            loading="lazy"
          />
        </>
      )}
      
      {/* Error Fallback */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-dark-700">
          <div className="text-center text-gray-500">
            <div className="w-12 h-12 mx-auto mb-2 bg-dark-600 rounded" />
            <p className="text-xs">Image unavailable</p>
          </div>
        </div>
      )}
      
      {/* Loading Animation */}
      {!isLoaded && !hasError && inView && (
        <div className="absolute inset-0 bg-dark-800 animate-pulse" />
      )}
    </div>
  );
};