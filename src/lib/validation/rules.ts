// Windows-like absolute (C:\…), UNC (\\server\…), relative (./…, ../…), or env-var-prefixed (%USERPROFILE%\…)
export const WINDOWS_PATH = /^([a-zA-Z]:[\\/].*|\\\\.+|\.\.?[\\/].*|%[A-Z_][A-Z0-9_]*%.*)$/;

export const HEX_COLOR = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
