import { useEffect, useRef, useState } from "react";
import { ElectionStatus } from '../../api/admin/api';

export default function StatusDropdown ({ 
  electionId, 
  currentStatus, 
  isOpen, 
  onStatusChange 
}: { 
  electionId: number; 
  currentStatus: ElectionStatus; 
  isOpen: boolean; 
  onStatusChange: (electionId: number, status: ElectionStatus) => void;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getStatusText = (status: ElectionStatus) => {
    switch (status) {
      case 'active': return 'открыто';
      case 'scheduled': return 'будет';
      default: return 'закрыто';
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={`text-xs px-2 py-1 rounded ${isOpen ? 'bg-green-600' : 'bg-red-600'}`}
      >
        {getStatusText(currentStatus)}
      </button>
      {isMenuOpen && (
        <div className="absolute right-0 mt-1 w-38 bg-dark-2 border border-border-dark-2 rounded shadow-lg z-10">
          {(['scheduled', 'active', 'closed'] as const).map((status) => (
            <button
              key={status}
              className="block w-full text-left px-3 py-2 text-xs hover:bg-bright-01"
              onClick={() => {
                onStatusChange(electionId, status);
                setIsMenuOpen(false);
              }}
            >
              {status === 'scheduled' && 'будет'}
              {status === 'active' && 'открыто'}
              {status === 'closed' && 'закрыто'}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};