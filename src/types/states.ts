type authState = {
  auth: {
    status: boolean;
    user: {
      _id: string;
      username: string;
      email: string;
      fullName: string;
      avatar: string;
      coverImage: string;
      watchHistory: string[];
    } | null;
  };
};

export type { authState };
