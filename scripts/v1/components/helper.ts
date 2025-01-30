import * as cgraphy from "node:crypto";
export function aesDecrypt(
    mode: string,
    text: string,
    key: string,
    iv: string = "12345DefaultIVzz",
  ): string {
    let keySize: number;
    let ivSize: number;
  
    switch (mode) {
      case "aes-128":
        keySize = 16;
        ivSize = 16;
        break;
      case "aes-192":
        keySize = 24;
        ivSize = 16;
        break;
      case "aes-256":
        keySize = 32;
        ivSize = 16;
        break;
      default:
        throw new Error("Unsupported AES mode");
    }
    mode = mode + "-cbc";
    const decipher = cgraphy.createDecipheriv(
      mode,
      key.slice(0, keySize),
      iv.slice(0, ivSize),
    );
    let decrypted = decipher.update(text, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }
  
  export function decryptData(serverdata: string, guildid: string) {
    // @ts-expect-error
    let key = (BigInt(process.env.BOT_OWNER) + BigInt(guildid))
      .toString(36)
      .padEnd(16, "%");
    return atob(aesDecrypt("aes-128", serverdata, key));
  }
  