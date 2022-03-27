import { getAuth } from "firebase/auth";

export const getAuthToken = async () => {
  try {
      const auth = getAuth();
      return await auth.currentUser?.getIdToken(true);
  } catch (e) {
      console.log(e);
      return null;
  }
};
