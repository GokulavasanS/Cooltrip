/* eslint-disable @typescript-eslint/no-explicit-any */

declare module "amadeus" {
  interface AmadeusConfig {
    clientId: string;
    clientSecret: string;
    hostname?: "test" | "production";
    logLevel?: "silent" | "warn" | "debug";
  }

  interface AmadeusResponse {
    data: any;
    result: {
      data: any[];
      dictionaries?: {
        carriers?: Record<string, string>;
        aircraft?: Record<string, string>;
        currencies?: Record<string, string>;
        locations?: Record<string, any>;
      };
      meta?: any;
    };
    body: string;
    statusCode: number;
    parsed: boolean;
  }

  class Amadeus {
    constructor(config: AmadeusConfig);

    shopping: {
      flightOffersSearch: {
        get(params: Record<string, string>): Promise<AmadeusResponse>;
      };
      flightOffers: {
        pricing: {
          post(body: string): Promise<AmadeusResponse>;
        };
      };
    };

    referenceData: {
      locations: {
        get(params: Record<string, string>): Promise<AmadeusResponse>;
      };
    };
  }

  export default Amadeus;
}
