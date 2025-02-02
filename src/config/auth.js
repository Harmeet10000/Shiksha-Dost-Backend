// src/config/auth.js
import { google } from "googleapis";
import { googleConfig } from "./googleConfig.js";

export const oauth2Client = new google.auth.OAuth2(
  googleConfig.clientId,
  googleConfig.clientSecret,
  googleConfig.redirectUri
);

export const calendar = google.calendar({ version: "v3", auth: oauth2Client });
