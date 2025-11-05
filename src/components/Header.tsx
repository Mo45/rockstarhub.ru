// /src/components/Header.tsx

"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { TbSearch, TbChevronDown, TbMenu } from 'react-icons/tb';

interface Article {
  id: number;
  title: string;
  slug: string;
}

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchModalOpen, setSearchModalOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Article[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isGTAODropdownOpen, setGTAODropdownOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchError, setSearchError] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const gtaoDropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const jwt = localStorage.getItem('jwt');
      setIsAuthenticated(!!jwt);
      setIsLoading(false);
    };

    checkAuth();

    const handleAuthChange = () => checkAuth();
    window.addEventListener('authChange', handleAuthChange);

    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('authChange', handleAuthChange);
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  useEffect(() => {
    if (isSearchModalOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isSearchModalOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (gtaoDropdownRef.current && !gtaoDropdownRef.current.contains(event.target as Node)) {
        setGTAODropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Блокировка прокрутки при открытом модальном окне
  useEffect(() => {
    if (isSearchModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSearchModalOpen]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsLoadingSuggestions(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND}/api/articles?filters[title][$containsi]=${searchQuery}&fields[0]=title&fields[1]=slug&pagination[pageSize]=5`
        );
        
        if (response.data && response.data.data) {
          setSuggestions(response.data.data);
        }
      } catch (error) {
        console.error('Ошибка загрузки предложений:', error);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const validateSearchQuery = (query: string): boolean => {
    if (!query.trim()) {
      setSearchError('Поисковый запрос не может быть пустым');
      return false;
    }
    
    const scriptPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, // теги script
      /javascript:/gi, // javascript: в ссылках
      /onerror\s*=/gi, // обработчики событий
      /onload\s*=/gi,
      /onclick\s*=/gi,
      /onmouseover\s*=/gi
    ];
    
    for (const pattern of scriptPatterns) {
      if (pattern.test(query)) {
        setSearchError('Поисковый запрос содержит недопустимое содержимое');
        return false;
      }
    }
    
    setSearchError('');
    return true;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    
    if (!validateSearchQuery(searchQuery)) {
      return;
    }

    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchModalOpen(false);
      setSearchQuery('');
    }
  };

  const handleSuggestionClick = (slug: string) => {
    router.push(`/articles/${slug}`);
    setSearchModalOpen(false);
    setSearchQuery('');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const toggleGTAODropdown = () => {
    setGTAODropdownOpen(!isGTAODropdownOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    setIsAuthenticated(false);
    setDropdownOpen(false);
    
    window.dispatchEvent(new Event('authChange'));
    
    router.push('/');
  };

  return (
    <header className="bg-black shadow-md border-b border-zinc-900">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Мобильное меню - кнопка слева */}
          <div className="md:hidden">
            <button 
              onClick={toggleMobileMenu}
              className="p-2"
              aria-label="Открыть меню"
            >
              <TbMenu className="text-white hover:text-rockstar-500 transition-colors duration-400 w-6 h-6" />
            </button>
          </div>

          <div className="flex items-center md:flex-initial md:justify-start">
            <Link href="/" className="flex items-center mx-auto md:mx-0">
              <div className="rsh-logo-square">
                <span className="rsh-logo-inside">
                  <svg className="w-auto h-10" viewBox="0, 0, 512,128" fill="currentColor"><path id="path0" d="M87.094 38.154 C 67.146 43.750,60.414 81.735,77.964 89.670 C 81.870 91.436,92.001 91.435,96.418 89.668 C 114.684 82.361,118.802 44.637,101.988 38.644 C 98.600 37.437,90.590 37.173,87.094 38.154 M131.833 38.275 C 111.108 45.620,106.462 84.142,125.558 90.309 C 131.608 92.263,140.598 90.883,145.975 87.175 C 150.326 84.173,150.309 84.288,147.167 79.488 C 143.998 74.647,143.616 74.510,139.828 76.865 C 132.756 81.261,129.217 77.250,130.508 66.303 C 132.149 52.386,137.157 46.931,143.890 51.725 C 146.183 53.358,147.073 53.002,150.975 48.894 C 155.194 44.453,155.262 44.186,152.727 41.961 C 147.884 37.708,138.236 36.006,131.833 38.275 M211.980 38.197 C 202.282 40.803,196.740 49.981,199.381 59.065 C 200.618 63.319,202.834 65.479,209.423 68.849 C 216.710 72.576,217.876 74.207,215.354 77.140 C 213.119 79.737,207.557 78.815,203.022 75.096 L 201.501 73.848 197.006 77.956 C 191.857 82.662,191.835 82.725,194.496 85.129 C 208.368 97.662,231.850 90.603,232.857 73.598 C 233.339 65.450,230.788 61.721,221.440 56.913 C 216.152 54.193,215.798 53.914,215.647 52.340 C 215.318 48.921,220.417 48.331,225.027 51.254 C 228.292 53.325,228.672 53.212,232.953 48.904 L 236.759 45.071 235.070 43.328 C 230.173 38.276,220.055 36.027,211.980 38.197 M31.744 38.683 C 31.744 38.883,30.233 49.750,28.386 62.833 C 26.540 75.916,25.100 87.232,25.186 87.982 L 25.344 89.344 33.080 89.485 L 40.815 89.626 42.040 80.525 L 43.265 71.424 46.081 80.505 L 48.896 89.586 56.641 89.593 C 66.868 89.602,66.469 90.364,62.188 79.000 C 58.008 67.906,58.103 69.175,61.269 66.658 C 70.700 59.162,69.088 43.604,58.468 39.624 C 55.977 38.690,31.744 37.837,31.744 38.683 M157.310 41.856 C 154.231 62.706,150.922 88.043,151.187 88.733 C 151.479 89.494,152.451 89.600,159.152 89.600 L 166.785 89.600 168.237 78.871 C 169.036 72.971,169.813 68.264,169.965 68.413 C 170.116 68.562,171.652 73.332,173.378 79.014 L 176.516 89.344 184.898 89.344 C 195.221 89.344,194.789 90.799,189.214 74.826 L 184.862 62.355 192.049 51.382 C 200.915 37.843,200.970 38.694,191.226 38.516 L 183.552 38.377 177.664 47.594 C 174.426 52.663,171.695 56.574,171.597 56.284 C 171.499 55.995,171.926 52.198,172.548 47.847 C 174.018 37.551,174.656 38.400,165.454 38.400 L 157.820 38.400 157.310 41.856 M286.043 38.784 C 284.967 40.616,266.737 87.866,266.860 88.506 C 266.999 89.232,268.088 89.363,275.020 89.485 L 283.019 89.625 283.363 88.205 C 283.552 87.423,284.164 85.229,284.723 83.328 L 285.739 79.872 289.558 79.872 L 293.376 79.872 293.376 84.736 L 293.376 89.600 301.249 89.600 C 306.949 89.600,309.256 89.423,309.606 88.960 C 309.918 88.547,309.080 79.478,307.240 63.360 L 304.392 38.400 295.330 38.400 C 290.346 38.400,286.167 38.573,286.043 38.784 M317.440 38.683 C 317.440 38.883,315.929 49.750,314.082 62.833 C 312.236 75.916,310.796 87.232,310.882 87.982 L 311.040 89.344 318.776 89.485 L 326.511 89.626 327.736 80.525 L 328.961 71.424 331.777 80.505 L 334.592 89.586 342.337 89.593 C 352.564 89.602,352.165 90.364,347.884 79.000 C 343.704 67.906,343.799 69.175,346.965 66.658 C 356.396 59.162,354.784 43.604,344.164 39.624 C 341.673 38.690,317.440 37.837,317.440 38.683 M370.876 39.161 C 370.716 39.579,372.222 44.977,374.223 51.156 L 377.862 62.391 370.436 75.188 C 365.726 83.303,363.125 88.284,363.324 88.805 C 363.598 89.518,364.705 89.606,371.816 89.484 L 379.993 89.344 382.892 82.230 L 385.792 75.116 387.032 82.358 L 388.272 89.600 403.489 89.600 L 418.705 89.600 419.046 88.192 C 419.233 87.418,419.844 85.229,420.403 83.328 L 421.419 79.872 425.238 79.872 L 429.056 79.872 429.056 84.736 L 429.056 89.600 436.929 89.600 C 442.629 89.600,444.936 89.423,445.286 88.960 C 445.598 88.547,444.759 79.474,442.919 63.349 L 440.069 38.378 430.898 38.517 L 421.726 38.656 412.840 61.148 C 407.953 73.519,403.891 83.704,403.814 83.781 C 403.605 83.990,397.272 63.350,397.294 62.530 C 397.304 62.145,400.324 57.019,404.006 51.140 C 412.362 37.796,412.484 38.656,402.232 38.656 L 394.110 38.656 391.685 44.224 C 390.351 47.287,389.142 49.591,388.997 49.344 C 388.853 49.098,388.439 46.534,388.077 43.648 L 387.418 38.400 379.293 38.400 C 372.579 38.400,371.117 38.532,370.876 39.161 M452.700 42.112 C 449.768 62.118,446.385 88.144,446.634 88.791 C 447.092 89.987,468.519 89.983,472.611 88.787 C 480.873 86.371,486.400 78.914,486.400 70.183 C 486.400 60.766,480.160 55.296,469.419 55.296 C 466.978 55.296,466.843 55.228,467.133 54.144 C 467.303 53.510,467.445 52.474,467.449 51.840 C 467.456 50.699,467.525 50.688,474.860 50.688 L 482.265 50.688 482.831 48.512 C 483.142 47.315,483.826 44.874,484.351 43.087 C 485.831 38.052,486.970 38.400,468.999 38.400 L 453.244 38.400 452.700 42.112 M237.463 44.416 C 236.458 51.561,236.219 51.200,241.975 51.200 C 246.216 51.200,246.783 51.306,246.777 52.096 C 246.773 52.589,245.629 61.042,244.235 70.882 C 242.381 83.968,241.850 88.952,242.257 89.442 C 243.382 90.798,257.463 90.360,257.766 88.960 C 257.904 88.326,259.067 80.090,260.352 70.656 C 261.637 61.222,262.800 52.986,262.938 52.352 C 263.175 51.259,263.429 51.200,267.914 51.198 L 272.640 51.196 274.101 45.817 C 276.173 38.182,278.022 38.912,256.606 38.912 L 238.236 38.912 237.463 44.416 M93.868 49.632 C 95.799 50.366,96.453 53.068,96.100 58.860 C 95.283 72.262,91.188 80.905,86.674 78.753 C 81.980 76.515,85.567 52.913,91.055 49.932 C 92.720 49.028,92.375 49.065,93.868 49.632 M50.176 51.200 C 52.647 53.671,49.847 59.904,46.267 59.904 C 44.864 59.904,44.870 59.949,45.645 54.400 C 46.297 49.737,47.713 48.737,50.176 51.200 M335.872 51.200 C 338.343 53.671,335.543 59.904,331.963 59.904 C 330.560 59.904,330.566 59.949,331.341 54.400 C 331.993 49.737,333.409 48.737,335.872 51.200 M292.864 63.262 L 292.864 68.096 291.017 68.096 C 289.758 68.096,289.244 67.892,289.401 67.456 C 289.528 67.104,290.177 64.816,290.844 62.373 C 292.353 56.841,292.864 57.066,292.864 63.262 M428.544 63.262 L 428.544 68.096 426.697 68.096 C 425.438 68.096,424.924 67.892,425.081 67.456 C 425.208 67.104,425.857 64.816,426.524 62.373 C 428.033 56.841,428.544 57.066,428.544 63.262 M468.423 67.909 C 470.336 69.249,469.803 74.340,467.538 76.364 C 465.344 78.324,463.692 78.348,464.054 76.416 C 464.199 75.642,464.457 73.856,464.626 72.448 C 465.321 66.677,465.818 66.084,468.423 67.909 " stroke="none" fill-rule="evenodd"></path>
                  </svg>
                </span>
              </div>
            </Link>
          </div>

          {/* Навигация для десктопа */}
          <nav className="hidden md:flex space-x-6">

            <Link href="/articles" className="navbar-item">
              Статьи
            </Link>

            <Link href="/guides" className="navbar-item">
              Руководства
            </Link>

            <Link href="/games/gtavi" className="navbar-item">
              GTA 6
            </Link>
            
            <div className="relative" ref={gtaoDropdownRef}>
              <button 
                onClick={toggleGTAODropdown}
                className="navbar-item flex items-center space-x-1"
                aria-expanded={isGTAODropdownOpen}
              >
                <span>GTA Online</span>
                <TbChevronDown className={`transition-transform duration-300 ${isGTAODropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <div 
                className={`absolute top-full left-0 mt-2 w-48 bg-black border border-gray-800 rounded-lg shadow-lg py-2 transition-all duration-300 ease-out z-50 ${
                  isGTAODropdownOpen 
                    ? 'opacity-100 visible translate-y-0' 
                    : 'opacity-0 invisible -translate-y-2'
                }`}
              >
                <Link href="/games/gtao" className="block px-4 py-2 text-white hover:text-black hover:bg-rockstar-500 transition-colors duration-300">
                  Об игре
                </Link>
                <Link href="/categories/gta-online" className="block px-4 py-2 text-white hover:text-black hover:bg-rockstar-500 transition-colors duration-300">
                  Новости
                </Link>
                <Link href="/games/gtao/achievements" className="block px-4 py-2 text-white hover:text-black hover:bg-rockstar-500 transition-colors duration-300">
                  Достижения
                </Link>
                <Link href="/gta-online" className="block px-4 py-2 text-white hover:text-black hover:bg-rockstar-500 transition-colors duration-300">
                  Хаб
                </Link>
              </div>
            </div>

            <Link href="/games" className="navbar-item">
              Все игры
            </Link>
            
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={toggleDropdown}
                className="navbar-item flex items-center space-x-1"
                aria-expanded={isDropdownOpen}
              >
                <span>Профиль</span>
                <TbChevronDown className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <div 
                className={`absolute top-full left-0 mt-2 w-48 bg-black border border-gray-800 rounded-lg shadow-lg py-2 transition-all duration-300 ease-out z-50 ${
                  isDropdownOpen 
                    ? 'opacity-100 visible translate-y-0' 
                    : 'opacity-0 invisible -translate-y-2'
                }`}
              >
                {isAuthenticated ? (
                  <>
                    <Link href="/account" className="block px-4 py-2 text-white hover:text-black hover:bg-rockstar-500 transition-colors duration-300">
                      Аккаунт
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-white hover:text-black hover:bg-rockstar-500 transition-colors duration-300"
                    >
                      Выход
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="block px-4 py-2 text-white hover:text-black hover:bg-rockstar-500 transition-colors duration-300">
                      Вход
                    </Link>
                    <Link href="/register" className="block px-4 py-2 text-white hover:text-black hover:bg-rockstar-500 transition-colors duration-300">
                      Регистрация
                    </Link>
                  </>
                )}
              </div>
            </div>
          </nav>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setSearchModalOpen(true)}
              className="nav-search-button"
              aria-label="Поиск"
            >
              <TbSearch className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Мобильное меню */}
      <div 
        ref={mobileMenuRef}
        className={`fixed inset-0 z-40 bg-black bg-opacity-75 transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div 
          className="fixed left-0 top-0 h-full w-64 bg-black border-r border-gray-800 shadow-lg transform transition-transform duration-300 ease-out z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4">
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="text-white text-2xl mb-4"
              aria-label="Закрыть меню"
            >
              &times;
            </button>
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/articles" 
                className="navbar-item text-white py-2"
                onClick={closeMobileMenu}
              >
                Статьи
              </Link>

              <Link 
                href="/guides" 
                className="navbar-item text-white py-2"
                onClick={closeMobileMenu}
              >
                Руководства
              </Link>

              <Link 
                href="/games/gtavi" 
                className="navbar-item text-white py-2"
                onClick={closeMobileMenu}
              >
                GTA 6
              </Link>
              <Link 
                href="/games/gtao" 
                className="navbar-item text-white py-2"
                onClick={closeMobileMenu}
              >
                GTA Online
              </Link>
              <Link 
                href="/gta-online" 
                className="navbar-item text-white py-2"
                onClick={closeMobileMenu}
              >
                Хаб GTA Online
              </Link>
              <Link 
                href="/games" 
                className="navbar-item text-white py-2"
                onClick={closeMobileMenu}
              >
                Все игры
              </Link>
              {isAuthenticated ? (
                <>
                  <Link 
                    href="/account" 
                    className="navbar-item text-white py-2"
                    onClick={closeMobileMenu}
                  >
                    Аккаунт
                  </Link>
                  <button 
                    onClick={() => {
                      handleLogout();
                      closeMobileMenu();
                    }}
                    className="navbar-item text-white py-2 text-left"
                  >
                    Выход
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/login" 
                    className="navbar-item text-white py-2"
                    onClick={closeMobileMenu}
                  >
                    Вход
                  </Link>
                  <Link 
                    href="/register" 
                    className="navbar-item text-white py-2"
                    onClick={closeMobileMenu}
                  >
                    Регистрация
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </div>

      {isSearchModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div 
            className="absolute inset-0 card bg-opacity-75 transition-opacity duration-300"
            onClick={() => setSearchModalOpen(false)}
          />
          
          <div className="relative transform transition-transform duration-300 ease-out animate-slide-down">
            <div className="container mx-auto px-4 py-4 pt-20">
              <div className="bg-zinc-900 rounded-lg p-4 max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">Поиск</h2>
                  <button 
                    onClick={() => setSearchModalOpen(false)} 
                    className="text-gray-400 cursor-pointer hover:text-white text-2xl"
                  >
                    &times;
                  </button>
                </div>

                <form onSubmit={handleSearch} className="relative">
                  {searchError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                      {searchError}
                    </div>
                  )}
                  
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Введите поисковый запрос..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSearchError('');
                    }}
                    className="w-full px-4 py-3 border border-zinc-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-rockstar-500 bg-zinc-800 text-white"
                    autoComplete="off"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white p-1"
                  >
                    <TbSearch className="w-5 h-5" />
                  </button>
                </form>

                {(suggestions.length > 0 || isLoadingSuggestions) && (
                  <div className="mt-2 bg-zinc-800 rounded-lg shadow-lg overflow-hidden">
                    {isLoadingSuggestions ? (
                      <div className="p-4 text-center text-gray-400">
                        Загрузка...
                      </div>
                    ) : (
                      suggestions.map((article) => (
                        <button
                          key={article.id}
                          onClick={() => handleSuggestionClick(article.slug)}
                          className="w-full text-left p-3 hover:bg-zinc-700 transition-colors border-b border-gray-700 last:border-b-0"
                        >
                          <div className="font-medium text-white">{article.title}</div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}