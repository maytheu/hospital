import { cleanEnv, num, port, str } from "envalid";

const secret = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ["development", "test", "production"] }),
  PORT: port({ default: 4004 }),
  MONGODB: str(),
  JWTSIGN: str(),
  EMAIL_USERNAME: str(),
  EMAIL_HOST: str(),
  EMAIL_PORT: num(),
  EMAIL_PASSWORD:str()
});

export default secret;
