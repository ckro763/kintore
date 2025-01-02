import { getDocumentsByAccountID } from '@/lib/firestore';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const handler = NextAuth({
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
        }),
    ],
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                const userDocuments = await getDocumentsByAccountID(+(token.sub as string));

                // ドキュメントが存在する場合は最初のドキュメントからaccountIDを追加
                if (userDocuments.length > 0) {
                    token.accountData = userDocuments;
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.sub as string;
                session.user.account = token.accountData;
            }
            return session;
        },
    },
    session: {
        strategy: "jwt",
    },
});
export { handler as GET, handler as POST };