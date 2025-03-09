export interface UserSchema {
    _id: string;
    username: string;
    email: string;
    fullName: string;
    password: string;
    avatar: string;
    coverImage: string;
    watchHistory: string[];
    createdAt: string;
    updatedAt: string;
}