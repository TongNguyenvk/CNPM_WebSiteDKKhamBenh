// lib/auth.ts
export interface User {
    username: string;
    password: string;
    role: 'benhnhan' | 'bacsi' | 'admin';
  }
  
  export interface LoginResponse {
    token: string;
    role: 'benhnhan' | 'bacsi' | 'admin';
  }
  
  export const users: User[] = [
    { username: 'benhnhan1', password: 'benhnhan123', role: 'benhnhan' },
    { username: 'benhnhan2', password: 'benhnhan123', role: 'benhnhan' },
    { username: 'bacsi1', password: 'bacsi123', role: 'bacsi' },
    { username: 'bacsi2', password: 'bacsi123', role: 'bacsi' },
    { username: 'admin', password: 'admin123', role: 'admin' },
  ];
  
  export const loginUser = async (credentials: { username: string; password: string }): Promise<LoginResponse> => {
    const user = users.find(
      (u) => u.username === credentials.username && u.password === credentials.password
    );
  
    if (!user) {
      throw new Error('Tên người dùng hoặc mật khẩu không đúng');
    }
  
    return {
      token: `fake-token-${user.role}-${Date.now()}`,
      role: user.role,
    };
  };