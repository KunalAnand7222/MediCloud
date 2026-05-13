import { cn } from '../../lib/utils';

export default function LoadingSpinner({ size = 'md', className }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12', xl: 'w-16 h-16' };
  return (
    <div className={cn('relative', sizes[size], className)}>
      <div className={cn('absolute inset-0 rounded-full border-2 border-medical-500/20')} />
      <div className={cn('absolute inset-0 rounded-full border-2 border-transparent border-t-medical-500 animate-spin')} />
      <div className="absolute inset-2 bg-gradient-to-br from-medical-500/10 to-teal-500/5 rounded-full" />
    </div>
  );
}
