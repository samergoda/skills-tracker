type LoginType = {
  email: string;
  password: string;
};

type SignupType = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

type User = {
  id: string;
  email: string;
  createdAt: string;
  rule: "admin" | "user";
  firstName: string;
  lastName: string;
};

type Session = {
  id: string;
  userId: string;
  expiresAt: string;
};
