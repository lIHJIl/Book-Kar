import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface HeritageImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
}

export const HeritageImage: React.FC<HeritageImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  priority = false,
  sizes,
  srcSet,
  width = 800,
  height = 500,
  ...rest
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Generate responsive srcSet for Unsplash images if not explicitly provided
  const computedSrcSet = useMemo(() => {
    if (srcSet) return srcSet;
    if (src && src.includes('unsplash.com')) {
      const baseUrl = src.split('?')[0];
      return `${baseUrl}?auto=format&fit=crop&q=80&w=480 480w, ${baseUrl}?auto=format&fit=crop&q=80&w=800 800w, ${baseUrl}?auto=format&fit=crop&q=80&w=1200 1200w, ${baseUrl}?auto=format&fit=crop&q=80&w=1600 1600w`;
    }
    return undefined;
  }, [src, srcSet]);

  const defaultSizes = sizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px';

  return (
    <div className={`relative overflow-hidden bg-theme-border/40 ${containerClassName}`}>
      {/* Shimmer Skeleton Placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-theme-border/30 overflow-hidden" aria-hidden="true">
          <motion.div
            animate={{ x: ['-100%', '100%'] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            className="h-full w-full bg-gradient-to-r from-transparent via-theme-border/50 to-transparent"
          />
        </div>
      )}

      {/* Elegant Heritage Fallback if image load fails / 404s */}
      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-theme-surface border border-theme-border p-6 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-[2px] border border-theme-accent/40 bg-theme-accent/10 mb-2">
            <Sparkles className="h-5 w-5 text-theme-accent" strokeWidth={1.5} />
          </div>
          <p className="font-display text-sm font-medium text-theme-ink max-w-xs line-clamp-2">
            {alt}
          </p>
          <span className="mt-1 font-mono text-[10px] text-theme-muted uppercase tracking-wider">
            Rajasthan Heritage Archives
          </span>
        </div>
      ) : (
        /* The Actual Image with responsive srcSet, sizes and explicit dimension tags */
        <img
          src={src}
          srcSet={computedSrcSet}
          sizes={defaultSizes}
          width={width}
          height={height}
          alt={alt}
          referrerPolicy="no-referrer"
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`${className} transition-opacity duration-250 ease-out ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          {...rest}
        />
      )}
    </div>
  );
};
