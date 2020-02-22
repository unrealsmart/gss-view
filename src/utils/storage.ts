import isJSON from 'is-json';

export function getToken(): string {
  return localStorage.getItem('adp-token') || '';
}

export function setToken(data: string): void {
  localStorage.setItem('adp-token', data);
}

export function getConfig(): string | object[] {
  return localStorage.getItem('adp-config') || '';
}

export function setConfig(data: string | object[]): void {
  localStorage.setItem('adp-config', JSON.stringify(data));
}

export function getCurrentUser(): AdministratorModel {
  const currentUserString = localStorage.getItem('adp-current-user') || '';
  return isJSON(currentUserString) ? JSON.parse(currentUserString) : {};
}

export function setCurrentUser(data: string): void {
  localStorage.setItem('adp-current-user', data);
}
