import { useMutation, useQuery } from "react-query";
import axios, { AxiosError } from "axios";
import { useAtom } from "jotai";
import { usePathname, useRouter } from "next/navigation";

import remoteDeployStore from "@src/store/remoteDeployStore";
import { PROXY_API_URL_AUTH } from "./utils";

const Github_API_URL = "https://api.github.com";

export const CLIEND_ID = "Iv23liZYLYN9I2HrgeOh";
export const REDIRECT_URL = "http://localhost:3000/new-deployment?step=edit-deployment&type=github";

export const handleLogin = () => {
  window.location.href = `https://github.com/login/oauth/authorize?client_id=${CLIEND_ID}&redirect_uri=${REDIRECT_URL}`;
};

const axiosInstance = axios.create({
  baseURL: Github_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  }
});

export const useUserProfile = () => {
  const [token] = useAtom(remoteDeployStore.tokens);
  return useQuery({
    queryKey: ["userProfile", token?.access_token],
    queryFn: async () => {
      const response = await axiosInstance.get("/user", {
        headers: {
          Authorization: `Bearer ${token?.access_token}`
        }
      });
      return response.data;
    },
    enabled: !!token?.access_token && token.type === "github"
  });
};

export const useRepos = () => {
  const [token] = useAtom(remoteDeployStore.tokens);
  return useQuery({
    queryKey: ["repos", token?.access_token],
    queryFn: async () => {
      const response = await axiosInstance.get(
        "/user/repos",

        {
          headers: {
            Authorization: `Bearer ${token?.access_token}`
          }
        }
      );
      return response.data;
    },
    onError: (error: AxiosError<{ message: string }>) => {
      if (error?.response?.data?.message === "Bad credentials") {
        console.log("Bad credentials");
      }
    },
    onSettled: data => {
      console.log(data);

      if (data?.message === "Bad credentials") {
        console.log("Bad credentials");
      }
    },
    enabled: !!token?.access_token && token.type === "github"
  });
};

export const useFetchAccessToken = () => {
  const [, setToken] = useAtom(remoteDeployStore.tokens);
  const pathname = usePathname();
  const router = useRouter();
  return useMutation({
    mutationFn: async (code: string) => {
      const response = await axios.post(`${PROXY_API_URL_AUTH}/authenticate`, {
        code
      });

      return response.data;
    },
    onSuccess: data => {
      console.log(data);

      setToken({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        type: "github"
      });
      router.replace(pathname.split("?")[0] + "?step=edit-deployment&type=github");
    }
  });
};

export const useBranches = (repo: string, fetch: boolean) => {
  const [token] = useAtom(remoteDeployStore.tokens);
  return useQuery({
    queryKey: ["branches", repo, token?.access_token],
    queryFn: async () => {
      const response = await axiosInstance.get(`/repos/${repo}/branches`, {
        headers: {
          Authorization: `Bearer ${token?.access_token}`
        }
      });
      return response.data;
    },

    enabled: fetch
  });
};
