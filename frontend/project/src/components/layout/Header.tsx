import React from 'react';
import { Menu } from 'lucide-react';
import Button from '../ui/Button';

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onMenuClick }) => {
  return (
    <header className="bg-white h-16 border-b border-gray-200 flex items-center px-4 sticky top-0 z-10">
      <Button
        variant="outline"
        size="sm"
        className="lg:hidden mr-4"
        onClick={onMenuClick}
      >
        <Menu size={20} />
      </Button>
      
      <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
    </header>
  );
};

export default Header;