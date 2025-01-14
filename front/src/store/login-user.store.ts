import { create } from "zustand";
import User from "../types/interface/user.interface";

interface LoginUserStore {
  loginUserInfo: User | null;
  setLoginUserInfo: (loginUserInfo: User) => void;
  resetLoginUser: () => void;
}

const useLoginUserStore = create<LoginUserStore>((set) => ({
  loginUserInfo: null,
  setLoginUserInfo: (loginUserInfo: User) =>
    set((state) => ({ ...state, loginUserInfo })),
  resetLoginUser: () => set((state) => ({ ...state, loginUserInfo: null })),
}));

export default useLoginUserStore;
