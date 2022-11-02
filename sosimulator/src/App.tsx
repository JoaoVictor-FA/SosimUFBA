import { Button, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import "./App.css";
import Graphic from "./components/Graphic";
import ProcessCard from "./components/ProcessCard";

export interface IProcess {
  processNumber: number;
  arrivalTime: number;
  executionTime: number;
  deadline: number;
}

function App() {
  const [processNumber, setProcessNumber] = useState(0);
  const [quantum, setQuantum] = useState(0);
  const [overload, setOverload] = useState(0);
  const [algorithm, setAlgorithm] = useState("");
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [processes, setProcesses] = useState<IProcess[]>([]);
  const [graphic, setGraphic] = useState(false);

  useEffect(() => {
    if (
      processNumber > 0 &&
      quantum > 0 &&
      overload > 0 &&
      algorithm !== "" &&
      processes.find(
        (p) => p.arrivalTime === 0 || p.deadline === 0 || p.executionTime === 0
      ) == undefined
    ) {
      setBtnDisabled(false);
    } else if (!btnDisabled) {
      setBtnDisabled(true);
    }
  }, [processes, processNumber, quantum, overload, algorithm]);

  useEffect(() => {
    const newProcesses: IProcess[] = [];
    for (let i = 0; i < processNumber; i++) {
      newProcesses.push({
        processNumber: i + 1,
        arrivalTime: 0,
        executionTime: 0,
        deadline: 0,
      });
    }
    setProcesses(newProcesses);
  }, [processNumber]);

  if (graphic) {
    return (
      <div className="App">
        <Graphic />
      </div>
    );
  }

  return (
    <div className="App">
      <TextField
        type="number"
        label="Quantum"
        value={quantum}
        onChange={(e: any) => setQuantum(e.target.value)}
      />
      <TextField
        type="number"
        label="Sobrecarga"
        value={overload}
        onChange={(e: any) => setOverload(e.target.value)}
      />
      <TextField
        type="number"
        label="Quantidade de processos"
        value={processNumber}
        onChange={(e: any) => setProcessNumber(e.target.value)}
      />
      <InputLabel>Algoritmo</InputLabel>
      <Select
        value={algorithm}
        onChange={(e: any) => setAlgorithm(e.target.value)}
        fullWidth
      >
        <MenuItem value="fifo">FIFO</MenuItem>
        <MenuItem value="sjf">SJF</MenuItem>
        <MenuItem value="rr">Round Robin</MenuItem>
        <MenuItem value="edf">EDF</MenuItem>
      </Select>
      {processes.map((process, i) => (
        <ProcessCard process={process} setProcesses={setProcesses} index={i} />
      ))}
      <Button disabled={btnDisabled} onClick={() => setGraphic(true)}>
        Iniciar
      </Button>
    </div>
  );
}

export default App;
