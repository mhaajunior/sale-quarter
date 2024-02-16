require("dotenv").config();

new webpack.DefinePlugin({
  "process.env.DATABASE_URL": JSON.stringify(process.env.DATABASE_URL),
  "process.env.NEXT_PUBLIC_CALLBACK_URL": JSON.stringify(
    process.env.NEXT_PUBLIC_CALLBACK_URL
  ),
  "process.env.NEXTAUTH_SECRET": JSON.stringify(process.env.NEXTAUTH_SECRET),
  "process.env.NEXTAUTH_URL": JSON.stringify(process.env.NEXTAUTH_URL),
  "process.env.JWT_SECRET": JSON.stringify(process.env.JWT_SECRET),
});
