import "dotenv/config";
import app from "./app";
import { prisma } from "./config/prisma";

const PORT = parseInt(process.env.PORT || "5000", 10);

async function main() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

main();
