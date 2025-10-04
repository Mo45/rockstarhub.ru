// src/lib/platforms.ts
import { BsNintendoSwitch, BsPlaystation, BsXbox, BsWindows, BsAndroid2, BsApple } from "react-icons/bs";
import { IconType } from "react-icons";

export const getPlatformClass = (platform: string): string => {
  const platformMap: Record<string, string> = {
    'Xbox 360': 'xbox360',
    'Xbox One': 'xboxone', 
    'Xbox Series': 'xboxseries',
    'PS3': 'ps3',
    'PS4': 'ps4',
    'PS5': 'ps5',
    'Nintendo Switch 1': 'nintendoswitch1',
    'Nintendo Switch 2': 'nintendoswitch2',
    'PC': 'pc',
    'Android': 'android',
    'iOS': 'ios',
    'xbox': 'xbox-platform',
    'steam': 'steam-platform',
    'rockstar': 'rockstar-platform'
  };

  return platformMap[platform] || 'default-platform';
};

export const getPlatformIcon = (platform: string): IconType | null => {
  const platformIconMap: Record<string, IconType> = {
    'Xbox 360': BsXbox,
    'Xbox One': BsXbox,
    'Xbox Series': BsXbox,
    'PS3': BsPlaystation,
    'PS4': BsPlaystation,
    'PS5': BsPlaystation,
    'Nintendo Switch 1': BsNintendoSwitch,
    'Nintendo Switch 2': BsNintendoSwitch,
    'PC': BsWindows,
    'Android': BsAndroid2,
    'iOS': BsApple
  };

  return platformIconMap[platform] || null;
};

export const getPlatformLabel = (platform: string): string => {
  return platform;
};

export const formatPlatformKey = (key: string): string => {
  const platformMap: Record<string, string> = {
    'xbox_360': 'Xbox 360',
    'xbox_one': 'Xbox One',
    'xbox_series': 'Xbox Series',
    'ps3': 'PS3',
    'ps4': 'PS4',
    'ps5': 'PS5',
    'pc': 'PC',
    'android': 'Android',
    'ios': 'iOS',
    'steam': 'Steam',
    'rockstar': 'Rockstar Launcher',
    'nintendoswitch1': 'Nintendo Switch 1',
    'nintendoswitch2': 'Nintendo Switch 2',
    'xbox': 'Xbox',
    // Добавляем поддержку новых форматов ключей
    'pm_kupikod_1': 'Plati.Market',
    'pm_kupikod_2': 'Plati.Market',
    'pm_kupikod_3': 'Plati.Market',
    'pm_steam_1': 'Steam',
    'pm_steam_2': 'Steam',
    'pm_steam_3': 'Steam',
    'pm_rockstar_1': 'Rockstar',
    'pm_rockstar_2': 'Rockstar',
    'pm_rockstar_3': 'Rockstar',
    'kk_steam_1': 'Steam',
    'kk_steam_2': 'Steam',
    'kk_steam_3': 'Steam',
    'kk_rockstar_1': 'Rockstar',
    'kk_rockstar_2': 'Rockstar',
    'kk_rockstar_3': 'Rockstar'
  };

  return platformMap[key] || key;
};

export const getPlatformTitle = (platform: string): string => {
  return `Доступно для ${platform}`;
};