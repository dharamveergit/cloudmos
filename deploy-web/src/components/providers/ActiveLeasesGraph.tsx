"use client";
import React, { useState } from "react";
import { FormattedNumber } from "react-intl";
import { ProviderSnapshots } from "@src/types";
import { percIncrease } from "@src/utils/mathHelpers";
import { DiffPercentageChip } from "@src/components/shared/DiffPercentageChip";
import { DiffNumber } from "@src/components/shared/DiffNumber";
import dynamic from "next/dynamic";
import { getSnapshotMetadata } from "@src/utils/providerUtils";
import { useProviderActiveLeasesGraph } from "@src/queries/useProvidersQuery";
import { ClientProviderDetailWithStatus } from "@src/types/provider";
import Spinner from "@src/components/shared/Spinner";
import { TimeRange } from "@src/components/shared/TimeRange";
import { selectedRangeValues } from "@src/utils/constants";

const Graph = dynamic(() => import("../graph/Graph"), {
  ssr: false
});

interface IProps {
  provider: ClientProviderDetailWithStatus;
}

export const ActiveLeasesGraph: React.FunctionComponent<IProps> = ({ provider }) => {
  const { data: snapshotData, status } = useProviderActiveLeasesGraph(provider.owner);
  const [selectedRange, setSelectedRange] = useState(selectedRangeValues["7D"]);
  const snapshotMetadata = snapshotData && getSnapshotMetadata();
  const rangedData = snapshotData && snapshotData.snapshots.slice(Math.max(snapshotData.snapshots.length - selectedRange, 0), snapshotData.snapshots.length);
  const metric = snapshotData && snapshotMetadata.unitFn(snapshotData.currentValue);
  const metricDiff = snapshotData && snapshotMetadata.unitFn(snapshotData.currentValue - snapshotData.compareValue);

  return (
    <div className="m-auto max-w-[800px] py-4">
      <div className="mb-1">
        <h1 className="text-center text-lg font-normal sm:text-left">
          Active Leases&nbsp;
          {provider.name && <span className="text-sm text-muted-foreground">({provider.name})</span>}
        </h1>
      </div>

      {!snapshotData && status === "loading" && (
        <div className="flex items-center justify-center">
          <Spinner size="large" />
        </div>
      )}

      {snapshotData && (
        <>
          <div className="mb-4 flex flex-col flex-wrap items-center justify-center sm:flex-row sm:flex-nowrap">
            <div className="mb-4 basis-full sm:mb-0 sm:basis-auto">
              <h3 className="font-bol flex items-center justify-center text-3xl sm:justify-start">
                <FormattedNumber value={metric.modifiedValue || metric.value} maximumFractionDigits={2} />
                &nbsp;{metric.unit}&nbsp;
                <DiffPercentageChip value={percIncrease(snapshotData.compareValue, snapshotData.currentValue)} size="medium" />
                &nbsp;
                <DiffNumber value={metricDiff.modifiedValue || metricDiff.value} unit={metricDiff.unit} className="text-xs font-light" />
              </h3>
            </div>

            <TimeRange selectedRange={selectedRange} onRangeChange={setSelectedRange} />
          </div>
          <Graph
            rangedData={rangedData}
            snapshotMetadata={snapshotMetadata}
            snapshot={ProviderSnapshots.count}
            snapshotData={snapshotData}
            selectedRange={selectedRange}
          />
        </>
      )}
    </div>
  );
};