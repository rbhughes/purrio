import { create } from "zustand";

import { createClient } from "@/utils/supabase/client";
import { persist } from "zustand/middleware";
import { ASSETS } from "@/lib/purr_utils";

export const ASSET_CACHE_EXPIRY_MS = 1000 * 60 * 60 * 24; // 24 hours TODO: set longer
export const ASSET_CACHE_NAME = "PURR_ASSET_CACHE";

const supabase = createClient();

const fetchAssetData = async (suite: string) => {
  console.log("TRYING TO FETCH ASSETS FOR ", suite);
  const assets: AssetDNA = {};
  await Promise.all(
    ASSETS.map(async (asset) => {
      const { data, error } = await supabase.functions.invoke(suite, {
        //body: { asset: asset, filter: "" },
        body: { asset: asset },
      });
      if (error) {
        console.log("error on  ~~~ " + suite + " ~~~ " + asset);
        console.error(error);
      } else {
        console.log(`fetching ${suite} asset dna for ${asset}`);
        //assets[asset] = { select: data.sql.select };
        // TODO: replace the purr_recent, purr_null, purr_delimiter here

        assets[asset] = { select: data.select };
      }
    })
  );
  return assets;
};

interface AssetDNA {
  [asset: string]: {
    select: string;
  };
}

interface AssetStoreState {
  expiry: number;
  geographixAssets: AssetDNA;
  // kingdomAssets: AssetDNA;
  petraAssets: AssetDNA;
  fetchGeographixAssets: () => Promise<void>;
  fetchPetraAssets: () => Promise<void>;
  setExpiry: (expiry: number) => void;
}

const assetStore = (set: any) => ({
  expiry: 0,
  geographixAssets: {},
  //kingdomAssets: {},
  petraAssets: {},

  fetchGeographixAssets: async () => {
    let assets = await fetchAssetData("geographix");
    set(() => ({
      geographixAssets: assets,
    }));
  },

  fetchPetraAssets: async () => {
    let assets = await fetchAssetData("petra");
    set(() => ({
      petraAssets: assets,
    }));
  },

  setExpiry: (expiry: number) => {
    set(() => ({
      expiry: expiry,
    }));
  },
});

export const useAssetStore = create<AssetStoreState>()(
  persist(assetStore, { name: ASSET_CACHE_NAME })
);
