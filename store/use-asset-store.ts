import { create } from "zustand";

import { createClient } from "@/utils/supabase/client";
import { devtools, persist } from "zustand/middleware";
import { ASSETS } from "@/lib/purr_utils";

export const ASSET_CACHE_EXPIRY_MS = 1000 * 60 * 60 * 24; // 24 hours TODO: set longer
export const ASSET_CACHE_NAME = "PURR_ASSET_CACHE";

const supabase = createClient();

const fetchAssetData = async (ggType: string) => {
  const assets: AssetDNA = {};
  await Promise.all(
    ASSETS.map(async (asset) => {
      console.log(ggType + " <> " + asset);
      const { data, error } = await supabase.functions.invoke(ggType, {
        body: { asset: asset, filter: "" },
      });
      if (error) {
        console.error(error);
      } else {
        assets[asset] = { select: data.sql.select };
      }
    }),
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
  devtools(persist(assetStore, { name: ASSET_CACHE_NAME })),
);
