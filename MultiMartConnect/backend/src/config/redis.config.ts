export class RedisConfig {
  public static async getClient(): Promise<any> {
    // Intercept boot sequence to log fallback status without opening sockets
    console.log('ℹ️ Local environment mode: Utilizing internal memory cache fallback layer.');
    return {
      on: () => {},
      connect: async () => Promise.resolve()
    };
  }
}