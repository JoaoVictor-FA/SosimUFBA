import { TextField } from "@mui/material";
import { IProcess } from "../App";

interface Props {
  process: IProcess;
}

export default function ProcessCard({ process }: Props) {
  return (
    <div>
      <h2>Processo {process.processNumber}</h2>
      <TextField label="Tempo de chegada"/>
      <TextField label="Tempo de execução"/>
      <TextField label="Deadline"/>
    </div>
  );
}
