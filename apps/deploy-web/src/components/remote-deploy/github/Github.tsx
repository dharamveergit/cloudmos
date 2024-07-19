import { Dispatch } from "react";
import { Control } from "react-hook-form";

import { SdlBuilderFormValues, Service } from "@src/types";
import { useRepos } from "../api/api";
import Branches from "./Branches";
import Repos from "./Repos";

const Github = ({
  control,
  setValue,
  services,
  setDeploymentName,
  deploymentName
}: {
  setDeploymentName: Dispatch<string>;
  deploymentName: string;
  control: Control<SdlBuilderFormValues>;

  setValue: any;
  services: Service[];
}) => {
  const { data: repos, isLoading } = useRepos();

  return (
    <>
      <Repos
        repos={repos}
        setValue={setValue}
        isLoading={isLoading}
        services={services}
        setDeploymentName={setDeploymentName}
        deploymentName={deploymentName}
      />
      <Branches services={services} control={control} />
    </>
  );
};

export default Github;
