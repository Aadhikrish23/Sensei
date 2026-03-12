import apiClient from "./axios";

interface LoginSuccess {
   Status: string;
  Data: {
    status: string;
    isEmailVerified: boolean;
    accessToken?: string;
    id?: string;
    verificationLink?: string;
  };
}
interface SignupSuccess {
  Status: string;
  Data: UserData;
}

interface UserData {
  id: string;
  email: string;
  isEmailVerified: boolean;
  createdAt: Date;

}
const userlogin = async (
  email: string,
  password: string,
): Promise<LoginSuccess> => {
  const userdata = await apiClient.post<LoginSuccess>("auth/login", {
    email: email.trim(),
    password: password.trim(),
  });
  return userdata.data;
};

const userRefresh = async (): Promise<LoginSuccess> => {
  const userdata = await apiClient.post<LoginSuccess>("auth/refresh");
  return userdata.data;
};

const userSignup = async (
  email: string,
  password: string,
): Promise<SignupSuccess> => {
  const userdata = await apiClient.post<SignupSuccess>("auth/signup", {
    email: email.trim(),
    password: password.trim(),
  });
  return userdata.data;
};

const userVerify = async (token: string) : Promise<LoginSuccess> => {
  const userdata = await apiClient.get<LoginSuccess>(`auth/verify-email?token=${token}`);
  return userdata.data;
};

const userLogout = async():Promise<string>=>{
  const usedata = await apiClient.post<string>("/auth/logout");
  return usedata.data;
}
export default { userlogin, userRefresh, userSignup,userVerify,userLogout };
