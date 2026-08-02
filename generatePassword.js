const bcrypt = require("bcryptjs");

async function generate() {
  const password = "YOUR_ADMIN_PASSWORD";

  const hash = await bcrypt.hash(password, 12);

  console.log(hash);
}

generate();
