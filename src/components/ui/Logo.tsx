import logoImage from '/logo.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
};

export const Logo = ({ size = 'md', className = '' }: LogoProps) => {
  return (
    <img 
      src={logoImage} 
      alt="Passport Pals" 
      className={`${sizeMap[size]} object-contain ${className}`}
    />
  );
};
