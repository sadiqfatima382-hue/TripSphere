import bcrypt from "bcrypt";
import env from "../config/env.js";

export async function hashPassword (password){
    const salt = await bcrypt.genSalt(Number(env.BCRYPT_SALT_ROUNDS));
    return bcrypt.hash(password,salt)
}

export async function comparePasswords(password, hashPassword) {
    return bcrypt.compare(password, hashPassword)
    
}