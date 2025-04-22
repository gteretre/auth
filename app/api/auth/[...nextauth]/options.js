import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

export const options = {
    providers: [
        GitHubProvider({
            profile(profile) {
                console.log("GitHub profile", profile);

                let userRole = "GithubUser";
                if (profile?.email == process.env?.ADMIN) {
                    userRole = "admin";
                }
                return { ...profile, role: userRole };
            },
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        GoogleProvider({
            profile(profile) {
                console.log("Google profile", profile);

                let userRole = "GoogleUser";
                if (profile?.email == process.env?.ADMIN) {
                    userRole = "admin";
                }
                return { ...profile, id: profile.sub, role: userRole };
            },
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.role = token.role;
            return session;
        },
    }
};