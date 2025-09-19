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
    'Nintendo Switch': 'nintendoswitch1',
    'Nintendo Switch 2': 'nintendoswitch2',
    'PC': 'pc',
    'Android': 'android',
    'iOS': 'ios'
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
    'Nintendo Switch': BsNintendoSwitch,
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
    'nintendoswitch1': 'Nintendo Switch',
    'nintendoswitch2': 'Nintendo Switch 2'
  };

  return platformMap[key] || key;
};

export const getPlatformTitle = (platform: string): string => {
  return `Доступно для ${platform}`;
};