export interface GuestUser {
  companyName: string;
  contactName: string;
  contactEmail: string;
  savedAt: string;
}

const STORAGE_KEY = "talent-market:guest-user";

export function getGuestUser(): GuestUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveGuestUser(
  user: Omit<GuestUser, "savedAt">
): GuestUser {
  const guestUser: GuestUser = {
    ...user,
    savedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(guestUser));

  console.log("[GuestUser]", {
    companyName: guestUser.companyName,
    contactEmail: guestUser.contactEmail,
    savedAt: guestUser.savedAt,
  });

  return guestUser;
}

export function clearGuestUser(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function hasGuestUser(): boolean {
  return getGuestUser() !== null;
}

export function validateGuestInput(input: {
  companyName: string;
  contactName: string;
  contactEmail: string;
}): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!input.companyName.trim()) {
    errors.companyName = "필수 입력 항목입니다";
  }
  if (!input.contactName.trim()) {
    errors.contactName = "필수 입력 항목입니다";
  }
  if (!input.contactEmail.trim()) {
    errors.contactEmail = "필수 입력 항목입니다";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.contactEmail)) {
    errors.contactEmail = "올바른 이메일 형식이 아닙니다";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
