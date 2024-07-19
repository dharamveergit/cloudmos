import React, { Dispatch, useState } from "react";

import { Service } from "@src/types";
import { useBitReposByWorkspace } from "../api/bitbucket-api";
import { ServiceControl } from "../utils";
import Branches from "./Branches";
import Repos from "./Repos";
import WorkSpaces from "./Workspaces";

const Bit = ({
  loading,
  setValue,
  services,
  control,
  setDeploymentName,
  deploymentName
}: {
  setDeploymentName: Dispatch<string>;
  deploymentName: string;
  loading: boolean;
  setValue: any;
  services: Service[];
  control: ServiceControl;
}) => {
  const [workSpace, setWorkSpace] = useState<string>("");

  const { data: repos, isLoading } = useBitReposByWorkspace(workSpace);

  return (
    <>
      <WorkSpaces isLoading={loading} workSpaces={workSpace} setWorkSpaces={setWorkSpace} />
      <Repos isLoading={isLoading} repos={repos} setValue={setValue} setDeploymentName={setDeploymentName} deploymentName={deploymentName} />
      <Branches services={services} control={control} />
    </>
  );
};

export default Bit;
