import { cleanEnv, port, str } from "envalid";

const secret = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ["development", "test", "production"] }),
  PORT: port({ default: 4004 }),
});

export default secret;
