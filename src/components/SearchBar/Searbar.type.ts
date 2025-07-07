export interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isSearchVisible: boolean;
  setIsSearchVisible: (visible: boolean) => void;
  onSearch?: (term: string) => void;
  onToggleSearch?: () => void;
}