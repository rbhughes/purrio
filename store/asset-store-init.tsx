"use client";

import React from "react";
import { useAssetStore } from "@/store/use-asset-store";
import {
  ASSET_CACHE_NAME,
  ASSET_CACHE_EXPIRY_MS,
} from "@/store/use-asset-store";

export default function AssetStoreInit() {
  const setExpiry = useAssetStore((state) => state.setExpiry);
  const fetchGeographixAssets = useAssetStore(
    (state) => state.fetchGeographixAssets,
  );
  const fetchPetraAssets = useAssetStore((state) => state.fetchPetraAssets);

  React.useEffect(() => {
    const cacheObj = localStorage.getItem(ASSET_CACHE_NAME);
    const cache = JSON.parse(cacheObj!);

    const assetFetcher = async () => {
      console.log("fetching GeoGraphix asset definitions...");
      await fetchGeographixAssets();
      console.log("fetching Petra asset definitions...");
      await fetchPetraAssets();
    };

    const expirySetter = () => {
      const newExpiry = new Date().getTime() + ASSET_CACHE_EXPIRY_MS;
      setExpiry(newExpiry);
      console.log(`set new cache expiry to ${new Date(newExpiry)}`);
    };

    if (cache && cache.state.expiry > new Date().getTime()) {
      console.log("using asset cache; expiry=", new Date(cache.state.expiry));
    } else {
      console.log("refreshing asset cache:");
      assetFetcher();
      expirySetter();
    }
  }, []);

  return false;

  // function AssetCounter() {
  //   const expiry = useAssetStore((state) => state.expiry);
  //   const geographixAssets = useAssetStore((state) => state.geographixAssets);
  //   const petraAssets = useAssetStore((state) => state.petraAssets);
  //
  //   return (
  //     <>
  //       <div>{String(new Date(expiry))}</div>
  //       <div>
  //         {geographixAssets.well && <pre>{geographixAssets.well.select}</pre>}
  //       </div>
  //       <div>{petraAssets.well && <pre>{petraAssets.well.select}</pre>}</div>
  //     </>
  //   );
  // }
  //
  // return (
  //   <div className="bg-yellow-300 w-11/12 break-words">
  //     <AssetCounter />
  //   </div>
  // );
}
