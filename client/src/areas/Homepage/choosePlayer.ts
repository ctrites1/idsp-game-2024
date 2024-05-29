import { createArenaPage } from "../Arena/mainArena";
import { removeHomepage } from "./homepage";

export async function loginSuccess() {
  await removeHomepage();
  await createArenaPage();
}

export async function logout() {
  const logout = await fetch("/api/logout");
  const loggedOut = await logout.json();
  if (loggedOut.success) {
    return true;
  }
  return false;
}
