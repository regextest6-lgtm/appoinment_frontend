import { testConnection } from "../lib/db"

async function main() {
  console.log("Testing database connection...")
  console.log("Environment variables:")
  console.log("- MYSQL_HOST:", process.env.MYSQL_HOST || "not set")
  console.log("- MYSQL_PORT:", process.env.MYSQL_PORT || "not set")
  console.log("- MYSQL_USER:", process.env.MYSQL_USER || "not set")
  console.log("- MYSQL_DATABASE:", process.env.MYSQL_DATABASE || "not set")
  console.log("- MYSQL_PASSWORD:", process.env.MYSQL_PASSWORD ? "***" : "not set")
  console.log("\n")

  const result = await testConnection()
  
  if (result.connected) {
    console.log("✅ Database connection successful!")
    console.log("Message:", result.message)
    process.exit(0)
  } else {
    console.error("❌ Database connection failed!")
    console.error("Message:", result.message)
    if (result.error) {
      console.error("Error:", result.error)
    }
    process.exit(1)
  }
}

main().catch((error) => {
  console.error("Unexpected error:", error)
  process.exit(1)
})

