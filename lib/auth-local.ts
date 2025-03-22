// Local JSON-based authentication system
import fs from 'fs';
import path from 'path';

// Define types
export type Role = 'USER' | 'ADMIN';

export type User = {
  id: string;
  name: string;
  email: string;
  username?: string; // Optional for admin users
  password: string;
  role: Role;
};

// Path to the users JSON file
const usersFilePath = path.join(process.cwd(), 'data', 'users.json');

// Helper function to read users from JSON file
export const getUsers = (): User[] => {
  try {
    if (!fs.existsSync(usersFilePath)) {
      return [];
    }
    const data = fs.readFileSync(usersFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users file:', error);
    return [];
  }
};

// Helper function to save users to JSON file
export const saveUsers = (users: User[]): void => {
  try {
    // Ensure the directory exists
    const dir = path.dirname(usersFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error saving users file:', error);
  }
};

// Find user by email
export const findUserByEmail = (email: string): User | undefined => {
  const users = getUsers();
  return users.find(user => user.email === email);
};

// Find user by username (for admin login)
export const findUserByUsername = (username: string): User | undefined => {
  const users = getUsers();
  return users.find(user => user.username === username);
};

// Validate user credentials
export const validateCredentials = (email: string, password: string): User | null => {
  const user = findUserByEmail(email);
  if (!user || user.password !== password) {
    return null;
  }
  return user;
};

// Validate admin credentials
export const validateAdminCredentials = (username: string, password: string): User | null => {
  const user = findUserByUsername(username);
  if (!user || user.password !== password || user.role !== 'ADMIN') {
    return null;
  }
  return user;
};

// Get user role
export const getUserRole = (userId: string): Role => {
  const users = getUsers();
  const user = users.find(user => user.id === userId);
  return user?.role || 'USER';
};

// Validate if user is admin
export const validateAdmin = (userId: string): boolean => {
  const role = getUserRole(userId);
  return role === 'ADMIN';
};