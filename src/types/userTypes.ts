
export type CreateUserType= {
  fullName: string;
  phone: string;
  email?: string;
  profileImage?: string;
  password: string;
  playerEvent?: any; // Assuming playerEvent is a string, adjust as necessary
  [key: string]: any;
}