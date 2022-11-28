import { Grid, TextField } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { AlgorithmType } from "../algorithms/algorithms";
import { IProcess } from "../App";

interface Props {
  process: IProcess;
  setProcesses: Dispatch<SetStateAction<IProcess[]>>;
  index: number;
  algorithmType: AlgorithmType;
}

export default function ProcessCard({
  process,
  setProcesses,
  index,
  algorithmType,
}: Props) {
  return (
    <div>
      <h2>Processo {process.processNumber}</h2>
      <Grid container spacing={1}>
        <Grid item xs={4}>
          <TextField
            type="number"
            label="Tempo de chegada"
            value={process.arrivalTime}
            onChange={(e: any) => {
              setProcesses((prev: IProcess[]) => [
                ...prev.filter((_, i) => i !== index),
                {
                  ...prev[index],
                  arrivalTime: +e.target.value,
                },
              ]);
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            type="number"
            label="Tempo de execução"
            value={process.executionTime}
            onChange={(e: any) => {
              setProcesses((prev: IProcess[]) => [
                ...prev.filter((_, i) => i !== index),
                {
                  ...prev[index],
                  executionTime: +e.target.value,
                },
              ]);
            }}
          />
        </Grid>
        {algorithmType === AlgorithmType.edf && (
          <Grid item xs={4}>
            <TextField
              type="number"
              label="Deadline"
              value={process.deadline}
              onChange={(e: any) => {
                setProcesses((prev: IProcess[]) => [
                  ...prev.filter((_, i) => i !== index),
                  {
                    ...prev[index],
                    deadline: +e.target.value,
                  },
                ]);
              }}
            />
          </Grid>
        )}
        {/* <Grid item xs={4}>
          <TextField type="number" label="Prioridade" />
        </Grid> */}
        {/* <Grid item xs={4}>
          <TextField
            type="number"
            label="Paginas Memoria"
            onChange={(e: any) => {
              setProcesses((prev: IProcess[]) => [
                ...prev.filter((_, i) => i !== index),
                {
                  ...prev[index],
                  memoryPages: +e.target.value,
                },
              ]);
            }}
          />
        </Grid> */}
      </Grid>
    </div>
  );
}
