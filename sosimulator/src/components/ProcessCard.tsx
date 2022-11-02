import { TextField } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { IProcess } from "../App";

interface Props {
  process: IProcess;
  setProcesses: Dispatch<SetStateAction<IProcess[]>>;
  index: number;
}

export default function ProcessCard({ process, setProcesses, index }: Props) {
  return (
    <div>
      <h2>Processo {process.processNumber}</h2>
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
    </div>
  );
}
