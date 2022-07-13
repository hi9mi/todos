declare namespace Express {
  export interface Request {
    user?: User;
  }

  interface User {
    id: number;
    email: string;
    name: string | null;
    avatar: string | null;
    createdAt: Date;
    updatedAt: Date;
  }
}
