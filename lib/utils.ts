import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 윷 번역기
export function toYut(num: number) {
  switch (num) {
      case -1:
          return '빽도';
      case 0:
          return '낙';
      case 1:
          return '도';
      case 2:
          return '개';
      case 3:
          return '걸';
      case 4:
          return '윷';
      case 5:
          return '모';
  }
}
