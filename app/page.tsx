import { Metadata } from "next";
import React from "react";
import HomePageClient from "@components/home-page-client";
import { CountryType } from "@type/countryType";

async function fetchCountryGDP() {
    return fetch("https://api.worldbank.org/v2/country/all/indicator/SL.GDP.PCAP.EM.KD?format=json&date=2020&per_page=266", { cache: "force-cache" })
        .then((res) => res.json())
        .then(
            (data) =>
                data?.[1]
                    ?.slice(49)
                    ?.filter((o: CountryType) => o?.value) // get only countries that have GNP data
                    ?.map((o: CountryType) => ({ ...o, value: Math.trunc(o.value) })) as CountryType[] // truncate GDP value to integer
        )
        .catch(() => [] as CountryType[]); // in case of error when fetching the API // clear cache
}

export const metadata: Metadata = {
    title: "GNP per person",
    description: "List of GNP per person employed of each country in year 2020.",
};

export type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Page(props: { searchParams: SearchParams }) {
    const countryGDPData = await fetchCountryGDP();
    await props.searchParams;
    return (
        <div className="px-5">
            <h1 className="my-2 my-md-3">GDP per person employed (in USD)</h1>
            <HomePageClient data={countryGDPData} />
        </div>
    );
}
