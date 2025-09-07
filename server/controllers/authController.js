import User from '../models/userModels.js';
import { generateToken } from '../utils/token.js';
import transporter from '../config/nodemailer.js';
import bcrypt from 'bcryptjs';

export const Register = async (req, res, next) => { /* ... */ };
export const Login = async (req, res, next) => { /* ... */ };
export const Logout = (req, res) => { /* ... */ };
export const GoogleLogin = async (req, res, next) => { /* ... */ };