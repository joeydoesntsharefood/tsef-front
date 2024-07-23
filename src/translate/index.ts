import { copies } from "./copies";

type Messages = {
  [key: string]: string;
};

const locale = "pt-br";

const t = (key: string, lang: string = locale): any => {
  const selectedMessages: Messages = copies?.[lang] || copies?.[locale];
  
  const keys = key.split(".");
  
  let translatedMessage: Messages | string = selectedMessages;

  for (const k of keys) {
    if (!translatedMessage || typeof translatedMessage !== "object") break;
    translatedMessage = translatedMessage[k];
  }
  
  return translatedMessage || key;
};

export default t;