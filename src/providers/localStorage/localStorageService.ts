import LoggerService from "../loggerService/loggerService";
import { Listener } from "./localStorage.types";

export const listeners: Record<string, Record<string, Listener>> = {};

export const getItem = async <T>(key: string): Promise<T | null> => {
  try {
    const value = await localStorage.getItem(key);
    
    if (value !== null) {
      // LoggerService.info("Item fetched from storage", key, value);
    }

    if (value) {
      return JSON.parse(value) as T;
    }

    return null;
  } catch (e) {
    LoggerService.error("Failed to fetch item", key, e);
    return null;
  }
};

export const getParsedItem = <T>(key: string): T | null => {
  const value = localStorage.getItem(key);

  if (!value) {
    return null;
  }
  try {
    const firstParse = JSON.parse(value) as string;
    if (!firstParse) {
      return null;
    }
    const secondParse = JSON.parse(firstParse) as T;
    return secondParse;
  } catch (error) {
    LoggerService.error("JSON parsing failed", key, error);
    return null;
  }
};

export const setItem = async (
  key: string,
  value: string | boolean
): Promise<boolean> => {
  try {
    await localStorage.setItem(key, JSON.stringify(value));
    notifyListeners(key, value);
    return true;
  } catch (e) {
    LoggerService.error("Failed to save item", key, e);
    return false;
  }
};

export const removeItem = async (key: string): Promise<boolean> => {
  try {
    await localStorage.removeItem(key);
    notifyListeners(key, null);
    return true;
  } catch (e) {
    LoggerService.error("Failed to remove item", key, e);
    return false;
  }
};

const notifyListeners = (key: string, value: string | boolean | null): void => {
  if (listeners[key]) {
    Object.keys(listeners[key]).forEach((id) => {
      const listener = listeners[key][id];
      listener?.(value);
    });
  }
};
